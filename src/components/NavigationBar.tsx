import React, { useEffect, useState, useCallback, useRef } from "react";
import { select, Selection } from "d3-selection";
import { drag } from "d3-drag";
import { scaleLinear } from "d3-scale";
import { range } from "d3-array";
import { axisLeft, axisRight } from "d3-axis";
import { line, curveStepBefore } from "d3-shape";
import { format } from "d3-format";
import "d3-transition";
import "./Svg.css";
import { NavigationDataSingleObjective } from "../types/ProblemTypes2";
import { RectDimensions } from "../types/ComponentTypes";
import { Form, Row, Col } from "react-bootstrap";

interface NavigationBarProps {
  objectiveData: NavigationDataSingleObjective;
  handleReferenceValue:
    | React.Dispatch<React.SetStateAction<[number, number]>>
    | ((x: [number, number]) => void);
  handleBoundValue:
    | React.Dispatch<React.SetStateAction<[number, number]>>
    | ((x: [number, number]) => void);
  handleNewStep:
    | React.Dispatch<React.SetStateAction<number>>
    | ((x: number) => void);
  newStep: number | undefined;
  dimensionsMaybe?: RectDimensions;
  refLineColorMaybe?: string;
  boundLineColorMaybe?: string;
  reachableColorMaybe?: string;
}

// data type to hold datapoints for ref and boundary lines
interface PointData {
  x: number;
  y: number;
}

const defaultDimensions = {
  chartHeight: 200,
  chartWidth: 560,
  marginLeft: 0,
  marginRight: 5,
  marginTop: 5,
  marginBottom: 5,
};

export const NavigationBar = ({
  objectiveData,
  handleReferenceValue,
  handleBoundValue,
  handleNewStep,
  newStep,
  dimensionsMaybe,
  refLineColorMaybe,
  boundLineColorMaybe,
  reachableColorMaybe,
}: NavigationBarProps) => {
  const ref = useRef(null);
  const [selection, setSelection] = useState<null | Selection<
    SVGSVGElement,
    unknown,
    null,
    undefined
  >>(null);
  const [tooltip, setTooltip] = useState<null | Selection<
    HTMLDivElement,
    unknown,
    null,
    undefined
  >>(null);
  const [dimensions] = useState(
    dimensionsMaybe ? dimensionsMaybe : defaultDimensions
  );

  const [refLineColor] = useState(
    refLineColorMaybe ? refLineColorMaybe : "#0000FF"
  );

  const [boundLineColor] = useState(
    boundLineColorMaybe ? boundLineColorMaybe : "#C00000"
  );

  const [reachableColor] = useState(
    reachableColorMaybe ? reachableColorMaybe : "#10ff10aa"
  );

  const [referencePoint, SetReferencePoint] = useState<number>();
  const [boundValue, SetBoundValue] = useState<number>();

  // constants
  const data = objectiveData;
  const allSteps = data.totalSteps;
  //const step = data.stepsTaken;
  const step = data.stepsTaken;
  const ideal = data.ideal;
  const nadir = data.nadir;
  const objectiveID = data.objectiveID;
  const minOrMax = data.minimize;
  const plotHeight =
    dimensions.chartHeight - dimensions.marginTop - dimensions.marginBottom; // size of individual plots
  const drawableSteps = Array.from(
    range(-1, objectiveData.upperReachables.length)
  ); // how many steps will be drawn
  const uReach = data.upperReachables;
  const lReach = data.lowerReachables;
  const referencePoints = data.referencePoints;
  const bounds = data.bounds;

  /*===================
         Scales
    ===================*/

  let top: number, bottom: number;
  if (minOrMax === 1) {
    top = nadir;
    bottom = ideal;
  } else {
    top = ideal;
    bottom = nadir;
  }

  // Scales the objective values to plot coordinates.
  const objValToYPixel = useCallback(() => {
    return scaleLinear().domain([bottom, top]).range([plotHeight, 0]);
  }, [top, bottom, plotHeight]);

  // for returning the svg's coordinate value to parent in original scale.
  const yPixelToObjVal = useCallback(() => {
    return scaleLinear().domain([plotHeight, 0]).range([bottom, top]);
  }, [plotHeight, bottom, top]);

  function linspace(
    startValue: number,
    stopValue: number,
    cardinality: number
  ) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
      arr.push(startValue + step * i);
    }
    return arr;
  }

  const yAxis = useCallback(() => {
    return axisLeft(objValToYPixel())
      .tickValues(linspace(bottom, top, 5))
      .tickFormat(format("~g"))
      .tickSize(
        dimensions.chartWidth - dimensions.marginLeft - dimensions.marginRight
      );
  }, [
    objValToYPixel,
    bottom,
    top,
    dimensions.chartWidth,
    dimensions.marginLeft,
    dimensions.marginRight,
  ]);

  // xAxis handles the steps
  const stepValtoXPixel = useCallback(() => {
    return scaleLinear()
      .domain([-1, allSteps]) // TODO change to -1
      .range([
        0,
        dimensions.chartWidth - dimensions.marginRight - dimensions.marginLeft,
      ]);
  }, [dimensions, allSteps]);

  const xPixelToStepVal = useCallback(() => {
    return scaleLinear()
      .domain([
        0,
        dimensions.chartWidth - dimensions.marginRight - dimensions.marginLeft,
      ])
      .range([-1, allSteps]);
  }, [dimensions, allSteps]);

  // calls xAxis for the objective
  // const xAxis = useCallback(() => {
  //   return axisBottom(stepValtoXPixel()).ticks(6);
  // }, [stepValtoXPixel]);

  // generates the lines for refpoints and boundaries
  const lineGenerator = line<PointData>()
    .x((d) => d["x"])
    .y((d) => d["y"])
    .curve(curveStepBefore);

  // fills pointData objects to use drawing both reference and boundary lines
  const fillPointData = useCallback(
    (data: any, drawableSteps: number[], totalSteps: number) => {
      let pointData: PointData[] = [];
      // if data is NaN we return nothing e.g. if bounds is not set it has Number.NaN in first index and we skip that objective
      if (!Number.isNaN(data[0])) {
        for (let ind of drawableSteps) {
          let currentPoint = data[ind];
          if (ind === -1) {
            currentPoint = data[0];
          } else if (currentPoint === undefined) {
            currentPoint = data[step];
          }
          pointData.push({
            x: stepValtoXPixel()(ind),
            y: objValToYPixel()(currentPoint),
          });
        }
        //pointData.pop();
        let currentPoint = data[data.length - 1];
        for (let ind = drawableSteps.length - 1; ind <= totalSteps; ind++) {
          pointData.push({
            x: stepValtoXPixel()(ind),
            y: objValToYPixel()(currentPoint),
          });
        }
      }
      //console.log(pointData);
      //console.log(drawableSteps);
      //console.log(totalSteps);
      return pointData;
    },
    []
  );

  /*===================
     Main use effect.
     ===================*/

  useEffect(() => {
    if (!selection || !tooltip) {
      // add svg and update selection
      const renderH = dimensions.chartHeight;
      const renderW = dimensions.chartWidth;

      const newSelection = select(ref.current)
        .classed("navigator-svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${renderW} ${renderH}`)
        .classed("svg-content", true);

      const Tooltip = select(ref.current)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "#FFFFFFFF")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px");

      // update selection
      setSelection(newSelection);
      setTooltip(Tooltip);
    } else {
      // clear the svg of its children
      //console.log("svg clear!");
      selection.selectAll("*").remove();

      // chart where to add stuff
      const chart = selection
        .append("g")
        .attr(
          "transform",
          `translate( ${dimensions.marginLeft} ${dimensions.marginTop})`
        );

      var toptext = "";
      var bottomtext = "";
      if (objectiveData.minimize === 1) {
        toptext = "Worst = " + objectiveData.nadir;
        bottomtext = "Best = " + objectiveData.ideal;
      }
      if (objectiveData.minimize === -1) {
        bottomtext = "Worst = " + objectiveData.nadir;
        toptext = "Best = " + objectiveData.ideal;
      }
      // y axis
      chart
        .append("g")
        .attr(
          "transform",
          `translate( ${
            dimensions.chartWidth -
            dimensions.marginLeft -
            dimensions.marginRight
          } )`
        )
        .call(yAxis())
        .call((g) =>
          g.selectAll(".tick:not(:first-of-type) text").attr("x", -4)
        )
        .call((g) =>
          g
            .selectAll(".tick:first-of-type text")
            .attr("x", -4)
            .attr("dy", -dimensions.marginBottom)
        )
        .call((g) =>
          g
            .selectAll(".tick:last-of-type text")
            .attr("x", -4)
            .attr("dy", dimensions.marginTop + 8)
        )
        .call((g) => g.selectAll(".tick:first-of-type text").text(bottomtext))
        .call((g) => g.selectAll(".tick:last-of-type text").text(toptext))
        .call((g) =>
          g
            .selectAll(".tick line")
            .attr("stroke-opacity", 0.5)
            .attr("stroke-dasharray", "2,2")
        )
        .style("font-size", "15px");

      const drawPolygons2 = () => {
        let poly = [
          { step: -1, objval: uReach[0] },
          { step: -1, objval: lReach[0] },
        ];
        let i;
        for (i = 0; i < lReach.length; i++) {
          poly.push({ step: i, objval: lReach[i] });
        }
        for (i = uReach.length - 1; i > -1; i--) {
          poly.push({ step: i, objval: uReach[i] });
        }
        return poly;
      };

      // draw the polygons to the svg
      let dataPoly = drawPolygons2();
      var dataPolyYPixels = dataPoly.map((x) => [
        stepValtoXPixel()(x.step),
        objValToYPixel()(x.objval),
      ]);

      const enter = selection
        .append("g")
        .attr(
          "transform",
          `translate( ${dimensions.marginLeft} ${dimensions.marginTop})`
        )
        .selectAll("polygon")
        .data([dataPoly])
        .enter();

      enter
        .append("polygon")
        .attr("transform", `translate(0)`)
        .attr("fill", reachableColor)
        .attr("points", function (d) {
          return d
            .map(function (d) {
              return [
                stepValtoXPixel()(d.step),
                objValToYPixel()(d.objval),
              ].join(",");
            })
            .join(" ");
        })
        .on("mouseover", function () {
          tooltip.style("opacity", 0.9);
        })
        .on("mousemove", function (event) {
          /* let distances = dataPolyYPixels.map((x) =>
            Math.sqrt(
              Math.pow(event.layerX - x[0], 2) +
                Math.pow(event.layerY - x[1], 2)
            )
          );
          let index: number = distances.indexOf(Math.min(...distances));
          //console.log(datum[index].objval); */
          tooltip
            .html(yPixelToObjVal()(event.layerY).toPrecision(4))
            .style("left", event.layerX + 25 + "px")
            .style("top", event.layerY + 25 + "px");
        })
        .on("mouseleave", function () {
          tooltip.transition().duration(1000).style("opacity", 0);
        });

      const uppLabels = selection
        .append("g")
        .attr(
          "transform",
          `translate( ${dimensions.marginLeft} ${dimensions.marginTop})`
        );
      // upper labels
      uppLabels
        .selectAll("text")
        .data([uReach[step - 1]])
        .enter()
        .append("text")
        .text((d) => {
          return `${d}`;
        })
        .attr("transform", (d) => {
          return `translate( ${stepValtoXPixel()(step - 1) + 5} ${
            objValToYPixel()(d) - 5
          } )`;
        })
        .attr("font-size", "15px");

      const lowLabels = selection
        .append("g")
        .attr(
          "transform",
          `translate( ${dimensions.marginLeft} ${dimensions.marginTop})`
        );
      // lower labels
      lowLabels
        .selectAll("text")
        .data([lReach[step - 1]])
        .enter()
        .append("text")
        .text((d) => {
          return `${d}`;
        })
        .attr("transform", (d) => {
          if (step < 4) {
            return `translate( ${stepValtoXPixel()(step - 1) + 5} ${
              objValToYPixel()(d) + 20
            } )`;
          } else {
            return `translate( ${stepValtoXPixel()(step - 1) + 5} ${
              objValToYPixel()(d) + 10
            } )`;
          }
        })
        .attr("font-size", "15px");
    }
  }, [
    selection,
    tooltip,
    dimensions,
    uReach,
    lReach,
    objectiveData.minimize,
    objectiveData.nadir,
    objectiveData.ideal,
    yAxis,
    step,
    stepValtoXPixel,
    objValToYPixel,
    yPixelToObjVal,
  ]);

  /* ===================
    useEffect for boundary
    ===================*/
  const updateBound = useCallback(
    (newboundvalue: number, referencePoint?: number) => {
      let boundvalue = newboundvalue;
      if (newboundvalue > ideal) {
        boundvalue = ideal;
      }
      if (newboundvalue < nadir) {
        boundvalue = nadir;
      }

      if (referencePoint) {
        //console.log(boundvalue);
        //console.log(referencePoint);
        if (boundvalue * minOrMax < referencePoint * minOrMax) {
          boundvalue = referencePoint;
        }
      }

      // if (boundvalue > uReach[uReach.length - 1]) {
      //   boundvalue = uReach[uReach.length - 1];
      // }
      SetBoundValue(boundvalue);
      handleBoundValue([boundvalue, objectiveID]);
      if (!selection) {
        return;
      }

      selection.selectAll(".boundary").remove(); // removes old points
      selection.selectAll(".movableBound").remove(); // removes old points

      const enter = selection;

      const boundaryPointData = fillPointData(
        bounds.concat([boundvalue]),
        drawableSteps,
        allSteps
      );

      // movableLineData object
      let movableBoundData: PointData[] = [
        { x: stepValtoXPixel()(step), y: 0 }, // now needs some data to work. x coord will always be the step coord
        { x: dimensions.chartWidth - dimensions.marginRight, y: 0 }, //. y will change so it doenst matter here
      ];

      const movePath = () => {
        // remove old movableLine
        enter.selectAll(".movableBound").remove();
        // add new movableLine and draw it
        enter
          .selectAll(".movableBound")
          .data([movableBoundData])
          .enter()
          .append("path")
          .attr("class", "movableBound")
          .attr("d", lineGenerator)
          .attr("transform", `translate(0)`)
          .attr("fill", "none")
          .attr("stroke", boundLineColor)
          //.attr("stroke-dasharray", "4,2")
          .attr("stroke-width", "3px");
      };

      // add the referenceLines. Also implements the drag events.
      enter
        .selectAll(".boundary")
        .data([boundaryPointData])
        .enter()
        .append("path")
        .attr("class", "boundary")
        .attr("d", lineGenerator)
        .attr(
          "transform",
          `translate( ${dimensions.marginLeft} ${dimensions.marginTop})`
        )
        .attr("fill", "none")
        .attr("stroke", boundLineColor)
        //.attr("stroke-dasharray", "4,2")
        .attr("stroke-width", "3px")
        .call(
          drag<SVGPathElement, PointData[], SVGElement>()
            .on("start", function () {
              // do nothing, if call delete here, then when clicking the line we remove the line and we dont have anything to drag.
            })
            .on("drag", function (event) {
              //deleteOldLinePath(); // delete old lines
              // get data and move while dragging
              movableBoundData[0].y = event.y;
              movableBoundData[1].y = event.y;
              movePath();
            })
            .on("end", function (event) {
              // add line coords to reference data
              updateBound(yPixelToObjVal()(event.y), referencePoint);
            })
        );
    },
    [
      allSteps,
      bounds,
      dimensions.chartWidth,
      dimensions.marginRight,
      drawableSteps,
      fillPointData,
      handleBoundValue,
      lReach,
      lineGenerator,
      objectiveID,
      selection,
      step,
      stepValtoXPixel,
      uReach,
      yPixelToObjVal,
    ]
  );

  useEffect(() => {
    var lastPoint: number;
    if (typeof boundValue !== "undefined") {
      lastPoint = boundValue;
    } else {
      lastPoint = bounds[bounds.length - 1];
    }
    updateBound(lastPoint, referencePoint);
  }, [
    selection,
    handleBoundValue,
    bounds,
    boundValue,
    updateBound,
    referencePoint,
  ]);

  /*===================
    useEffect for refLines
    ===================*/

  const updateReference = useCallback(
    (newValue: number) => {
      // if (referencepoint < lReach[lReach.length - 1]) {
      //   referencepoint = lReach[lReach.length - 1];
      // }
      // if (referencepoint > uReach[uReach.length - 1]) {
      //   referencepoint = uReach[uReach.length - 1];
      // }
      let referencepoint = newValue;
      console.log(referencepoint);
      console.log(objectiveID);
      console.log(ideal);
      if (newValue > ideal) {
        referencepoint = ideal;
      } else if (newValue < nadir) {
        referencepoint = nadir;
      }
      SetReferencePoint(referencepoint);
      handleReferenceValue([referencepoint, objectiveID]);
      if (!selection) {
        return;
      }

      selection.selectAll(".refPoint").remove(); // removes old points
      selection.selectAll(".movableLine").remove(); // removes old points

      const enter = selection;
      //.append("g")
      // .attr(
      //   "transform",
      //   `translate( ${dimensions.marginLeft} ${dimensions.marginTop})`
      // );

      const referencePointData = fillPointData(
        referencePoints.concat([referencepoint]),
        drawableSteps,
        allSteps
      );

      /*       const deleteOldLinePath = () => {
        enter.selectAll(".refPoint").remove();
        // remove from component's referencePointData. only for visuals
        //referencePointData.splice(step + 1, allSteps - 1); // step + 1, step - 1
        //console.log(referencePointData);
        enter
          .selectAll(".refPoint")
          .data([referencePointData])
          .enter()
          .append("path")
          .attr("class", "refPoint")
          .attr("d", lineGenerator)
          .attr(
            "transform",
            `translate( ${dimensions.marginLeft} ${dimensions.marginTop})`
          )
          .attr("fill", "none")
          .attr("stroke", "darkgreen")
          //.attr("stroke-dasharray", "4,2")
          .attr("stroke-width", "3px");
      }; */

      // movableLineData object
      let movableLineData: PointData[] = [
        { x: stepValtoXPixel()(step), y: 0 }, // now needs some data to work. x coord will always be the step coord
        { x: dimensions.chartWidth - dimensions.marginRight, y: 0 }, //. y will change so it doenst matter here
      ];

      const movePath = () => {
        // remove old movableLine
        enter.selectAll(".movableLine").remove();
        // add new movableLine and draw it
        enter
          .selectAll(".movableLine")
          .data([movableLineData])
          .enter()
          .append("path")
          .attr("class", "movableLine")
          .attr("d", lineGenerator)
          .attr("transform", `translate(0)`)
          .attr("fill", "none")
          .attr("stroke", refLineColor)
          //.attr("stroke-dasharray", "4,2")
          .attr("stroke-width", "3px");
      };

      // add the referenceLines. Also implements the drag events.
      enter
        .selectAll(".refPoint")
        .data([referencePointData])
        .enter()
        .append("path")
        .attr("class", "refPoint")
        .attr("d", lineGenerator)
        .attr(
          "transform",
          `translate( ${dimensions.marginLeft} ${dimensions.marginTop})`
        )
        .attr("fill", "none")
        .attr("stroke", refLineColor)
        //.attr("stroke-dasharray", "4,2")
        .attr("stroke-width", "3px")
        .call(
          drag<SVGPathElement, PointData[], SVGElement>()
            .on("start", function () {
              // do nothing, if call delete here, then when clicking the line we remove the line and we dont have anything to drag.
            })
            .on("drag", function (event) {
              //deleteOldLinePath(); // delete old lines
              // get data and move while dragging
              movableLineData[0].y = event.y;
              movableLineData[1].y = event.y;
              movePath();
            })
            .on("end", function (event) {
              // add line coords to reference data
              updateReference(yPixelToObjVal()(event.y));
            })
        );
    },
    [
      allSteps,
      dimensions.chartWidth,
      dimensions.marginLeft,
      dimensions.marginRight,
      dimensions.marginTop,
      drawableSteps,
      fillPointData,
      handleReferenceValue,
      lReach,
      lineGenerator,
      objectiveID,
      referencePoints,
      selection,
      step,
      stepValtoXPixel,
      uReach,
      yPixelToObjVal,
    ]
  );

  useEffect(() => {
    var lastPoint: number;
    if (typeof referencePoint !== "undefined") {
      lastPoint = referencePoint;
    } else {
      lastPoint = referencePoints[referencePoints.length - 1];
    }
    updateReference(lastPoint);
  }, [
    selection,
    handleReferenceValue,
    referencePoints,
    referencePoint,
    updateReference,
  ]);

  /*===================
    useEffect for Stepping back
    ===================*/

  useEffect(() => {
    var newstep: number;
    if (typeof newStep !== "undefined") {
      newstep = newStep;
    } else {
      newstep = step;
    }
    if (newstep > step) {
      newstep = step;
    }
    if (newstep < 1) {
      newstep = 1;
    }

    if (!selection) {
      return;
    }

    selection.selectAll(".stepPoint").remove(); // removes old points
    selection.selectAll(".movableStep").remove(); // removes old points

    const enter = selection;
    //.append("g")
    // .attr(
    //   "transform",
    //   `translate( ${dimensions.marginLeft} ${dimensions.marginTop})`
    // );

    let movableStepData: PointData[] = [
      { x: stepValtoXPixel()(newstep - 1), y: 0 }, // now needs some data to work. x coord will always be the step coord
      { x: stepValtoXPixel()(newstep - 1), y: plotHeight }, //. y will change so it doenst matter here
    ];

    // movableLineData object
    let StepData: PointData[] = [
      { x: stepValtoXPixel()(step - 1), y: 0 }, // now needs some data to work. x coord will always be the step coord
      { x: stepValtoXPixel()(step - 1), y: plotHeight }, //. y will change so it doenst matter here
    ];

    const movePath = () => {
      // remove old movableLine
      enter.selectAll(".movableStep").remove();
      // add new movableLine and draw it
      enter
        .selectAll(".movableStep")
        .data([movableStepData])
        .enter()
        .append("path")
        .attr("class", "movableStep")
        .attr("d", lineGenerator)
        .attr(
          "transform",
          `translate( ${dimensions.marginLeft} ${dimensions.marginTop})`
        )
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-dasharray", "4,2");
      //.attr("stroke-width", "3px");
    };
    movePath();
    // add the referenceLines. Also implements the drag events.
    enter
      .selectAll(".stepPoint")
      .data([StepData])
      .enter()
      .append("path")
      .attr("class", "stepPoint")
      .attr("d", lineGenerator)
      .attr(
        "transform",
        `translate( ${dimensions.marginLeft} ${dimensions.marginTop})`
      )
      .attr("fill", "none")
      .attr("stroke", "black")
      //.attr("stroke-dasharray", "4,2")
      .attr("stroke-width", "5px")
      .call(
        drag<SVGPathElement, PointData[], SVGElement>()
          .on("start", function () {
            // do nothing, if call delete here, then when clicking the line we remove the line and we dont have anything to drag.
          })
          .on("drag", function (event) {
            //deleteOldLinePath(); // delete old lines
            // get data and move while dragging
            movableStepData[0].x = event.x;
            movableStepData[1].x = event.x;
            movePath();
          })
          .on("end", function (event) {
            // add line coords to reference data
            let tempstep = Math.floor(xPixelToStepVal()(event.x));
            if (tempstep < 1) {
              tempstep = 1;
            }
            movableStepData[0].x = stepValtoXPixel()(tempstep);
            movableStepData[1].x = stepValtoXPixel()(tempstep);
            movePath();
            handleNewStep(tempstep + 1);
          })
      );
  });
  return (
    <div className="navigator-block">
      <div className="navigator-input">
        <div>
          <b>{objectiveData.objectiveName}</b>{" "}
          {objectiveData.minimize === 1 && "(Min)"}
          {objectiveData.minimize === -1 && "(Max)"}
        </div>
        <hr className="solid"></hr>
        <div>
          {objectiveData.minimize === 1 && (
            <div>
              {/* <div>Nadir value: {objectiveData.nadir}</div> */}
              <div>
                Worst reachable value:{" "}
                {format("~g")(
                  objectiveData.upperReachables[
                    objectiveData.upperReachables.length - 1
                  ]
                )}
              </div>
            </div>
          )}
        </div>
        <div>
          {objectiveData.minimize === -1 && (
            <div>
              {/* <div>Ideal = {objectiveData.ideal}</div> */}
              <div>
                Best reachable value:{" "}
                {format("~g")(
                  objectiveData.upperReachables[
                    objectiveData.upperReachables.length - 1
                  ]
                )}
              </div>
            </div>
          )}
        </div>
        <Form>
          <Form.Group as={Row} controlId="referencevalue">
            <Form.Label column sm={4}>
              Aspiration
            </Form.Label>
            <Col sm={7}>
              <Form.Control
                style={{
                  margin: "0px",
                }}
                key={"controlof{objectiveData.objectiveName}"}
                defaultValue={
                  objectiveData.upperReachables[
                    objectiveData.upperReachables.length - 1
                  ]
                }
                value={referencePoint?.toFixed(4)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateReference(Number(e.target.value));
                }}
                type="number"
                step={0.0001}
                placeholder="Enter desired value"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="boundvalue">
            <Form.Label column sm={4}>
              Bound
            </Form.Label>
            <Col sm={7}>
              <Form.Control
                type="number"
                step={0.0001}
                placeholder="Enter bound value"
                defaultValue={bounds[bounds.length - 1]}
                value={boundValue?.toFixed(4)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateBound(Number(e.target.value));
                }}
              />
            </Col>
          </Form.Group>
        </Form>
        <div>
          {objectiveData.minimize === 1 && (
            <div>
              <div>
                Best reachable value:{" "}
                {format("~g")(
                  objectiveData.lowerReachables[
                    objectiveData.lowerReachables.length - 1
                  ]
                )}
              </div>
              {/* <div>Ideal = {objectiveData.ideal}</div> */}
            </div>
          )}
        </div>
        <div>
          {objectiveData.minimize === -1 && (
            <div>
              <div>
                Worst reachable value:{" "}
                {format("~g")(
                  objectiveData.lowerReachables[
                    objectiveData.lowerReachables.length - 1
                  ]
                )}
              </div>
              {/* <div>Nadir value: {objectiveData.nadir}</div> */}
            </div>
          )}
        </div>
      </div>

      <div
        ref={ref}
        id={objectiveData.objectiveName + "-chart"}
        className="navigator-svg-container"
      ></div>
    </div>
  );
};

export default NavigationBar;
