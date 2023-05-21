import React, { useEffect, useState, useCallback, useRef } from "react";
import { select, Selection, pointer } from "d3-selection";
import { scaleLinear, scaleBand } from "d3-scale";
import { axisBottom } from "d3-axis";
import "d3-transition";
import { easeCubic } from "d3-ease";
import "./Svg.css";
import { ObjectiveDataSingleObjective } from "../types/ProblemTypes";
import { RectDimensions } from "../types/ComponentTypes";
import { type } from "os";
import { symbol } from "d3-shape";

interface SimpleHorizontalBarProps {
  ideal: number;
  nadir: number;
  direction: number;
  index: number;
  setReferencePoint:
    | React.Dispatch<React.SetStateAction<[number, number]>>
    | ((x: [number, number]) => void);
  referencePoint: number;
  currentPoint: number;
  color: string;
  color_sup: string;
  dimensionsMaybe?: RectDimensions;
}
const defaultDimensions = {
  chartHeight: 150,
  chartWidth: 700,
  marginLeft: 20,
  marginRight: 20,
  marginTop: 0,
  marginBottom: 0,
};

// Change me: add arg for reference point and use objective data just to set up.
const SimpleHorizontalBar = ({
  ideal,
  nadir,
  direction,
  index,
  setReferencePoint,
  referencePoint,
  currentPoint,
  color,
  color_sup,
  dimensionsMaybe,
}: SimpleHorizontalBarProps) => {
  /* 
  These hooks are used to store states, which are meaningful to the operation of this component.
  - ref should only ever point to the single svg-element
  - selection is used to have a usable hook to get hold of the DOM through d3 throughout this
    function
  - data is used to refer to the data being displayed
  - prefPointLocs refers to the locations of the pointers indicating preference on each horizontal bar
   */
  const ref = useRef(null);
  // SetStateAction<Selection<SVGSVGElement, unknown, HTMLElement, any> | null>
  const [selection, setSelection] = useState<null | Selection<
    SVGSVGElement,
    unknown,
    null,
    undefined
  >>(null);
  //   const [data] = useState(
  //     objectiveData.values[0].value.map((value, i) => {
  //       return {
  //         name: objectiveData.names[i],
  //         value: value,
  //         direction: objectiveData.directions[i],
  //         selected: objectiveData.values[0].selected,
  //       };
  //     })
  //   );
  const [prefPointerLoc, setPrefPointerLoc] = useState<number>(referencePoint);
  const [infoPointerLoc, setInfoPointerLoc] = useState<number>(referencePoint);
  // const [posNegMiddle, setPosNegMiddle] = useState<number>();
  const [dimensions] = useState(
    dimensionsMaybe ? dimensionsMaybe! : defaultDimensions
  );
  ideal = ideal * direction;
  nadir = nadir * direction;

  useEffect(() => {
    setPrefPointerLoc(referencePoint);
    setInfoPointerLoc(referencePoint);
  }, [referencePoint]);
  // console.log("referencePoint: ", referencePoint);

  // create an array of linear scales to scale each objective being maximized
  const xs = useCallback(() => {
    return scaleLinear()
      .domain([nadir, ideal])
      .range([0, dimensions.chartWidth]);
  }, [dimensions, ideal, nadir]);

  // create also an array of reverse scales to be used when minimizing
  const xs_rev = useCallback(() => {
    return scaleLinear()
      .domain([ideal, nadir])
      .range([0, dimensions.chartWidth]);
  }, [dimensions, ideal, nadir]);

  // create an array of bottom axises to work as the individual x-axis for each bar
  const xAxis = useCallback(() => {
    if (direction === -1) {
      return axisBottom(xs());
    } else {
      return axisBottom(xs_rev());
    }
  }, [dimensions, direction, xs, xs_rev]);

  // create a discrete band to position each of the horizontal bars
  //   const y = useCallback(
  //     () =>
  //       scaleBand()
  //         .domain(data.map((d) => d.name))
  //         .range([0, dimensions.chartHeight])
  //         .padding(0.35),
  //     [dimensions, data]
  //   );

  // This is the main use effect and should really be fired only once per render.
  useEffect(() => {
    // create a discrete band to position each of the horizontal bars
    if (!selection) {
      // add svg and update selection
      const renderH = dimensions.chartHeight;
      const renderW =
        dimensions.chartWidth + dimensions.marginLeft + dimensions.marginRight;

      const newSelection = select(ref.current)
        .classed("svg-container-hb", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${renderW} ${renderH}`)
        .attr("viewBox", `0 0 ${renderW} ${renderH}`)
        .classed("svg-content", true);

      // update selection
      setSelection(newSelection);
    } else {
      // clear the svg of its children
      console.log("svg clear!");
      selection.selectAll("*").remove();

      // enter selection, append to this
      const enter = selection
        .append("g")
        .selectAll("rect")
        .data([currentPoint])
        .enter();

      // draw the positive space for max problems and negative space for min problems
      enter
        .append("rect")
        .attr("class", "posMaxNegMin")
        .attr("transform", `translate(${dimensions.marginLeft}, 0)`)
        .attr("width", () => {
          if (direction === -1) {
            return xs()(currentPoint);
          } else {
            return xs_rev()(currentPoint);
          }
        })
        // .attr("y", (d) => {
        //   return y()(d.name) as number;
        // })
        .attr("x", 0)
        .attr(
          "height",
          dimensions.chartHeight -
            dimensions.marginBottom -
            dimensions.marginTop
        )
        .attr("fill", () => {
          if (direction === -1) {
            return color;
          } else {
            return color_sup;
          }
        });

      // draw the positive space for min problems and the negative space for pos problems
      enter
        .append("rect")
        .attr("class", "negMaxPosMin")
        .attr("transform", `translate(${dimensions.marginLeft}, 0)`)
        .attr("width", () => {
          if (direction === -1) {
            console.log("hi");
            console.log(xs_rev()(currentPoint));
            console.log(currentPoint);
            console.log(xs()(currentPoint));
            console.log(dimensions.chartWidth);
            return dimensions.chartWidth - xs()(currentPoint);
          } else {
            return dimensions.chartWidth - xs_rev()(currentPoint);
          }
        })
        // .attr("y", (d) => {
        //   return y()(d.name) as number;
        // })
        .attr("x", () => {
          if (direction === -1) {
            return xs()(currentPoint);
          } else {
            return xs_rev()(currentPoint);
          }
        })
        .attr(
          "height",
          dimensions.chartHeight -
            dimensions.marginBottom -
            dimensions.marginTop
        )
        .attr("fill", () => {
          if (direction === -1) {
            return color_sup;
          } else {
            return color;
          }
        });

      // draw the info pointers on each bar on top of the event overlay
      enter
        .append("line")
        .attr("class", "infoPointer")
        .attr("y1", dimensions.marginTop)
        .attr("y2", dimensions.chartHeight - dimensions.marginBottom)
        .attr("x1", () => {
          if (direction === -1) {
            return xs()(currentPoint) + dimensions.marginLeft;
          } else {
            return xs_rev()(currentPoint) + dimensions.marginLeft;
          }
        })
        .attr("x2", () => {
          if (direction === -1) {
            return xs()(currentPoint) + dimensions.marginLeft;
          } else {
            return xs_rev()(currentPoint) + dimensions.marginLeft;
          }
        })
        .attr("stroke-width", 2)
        .attr("stroke", "grey")
        .attr("fill", "none");

      // draw the preference pointers on each bar on top of the event overlay
      enter
        .append("line")
        .attr("class", "preferencePointer")
        .attr("y1", dimensions.marginTop)
        .attr("y2", dimensions.chartHeight - dimensions.marginBottom)
        .attr("x1", () => {
          if (direction === -1) {
            return xs()(currentPoint) + dimensions.marginLeft;
          } else {
            return xs_rev()(currentPoint) + dimensions.marginLeft;
          }
        })
        .attr("x2", () => {
          if (direction === -1) {
            return xs()(currentPoint) + dimensions.marginLeft;
          } else {
            return xs_rev()(currentPoint) + dimensions.marginLeft;
          }
        })
        .attr("stroke-width", 3)
        .attr("stroke", "black")
        .attr("fill", "none");

      /*       enter
        .append("text")
        .attr("class", "infoLabel")
        .attr("fill", "black")
        .attr("text-anchor", () => {
          const midPoints = xs().map((x, _) => {
            return (x.domain()[0] + x.domain()[1]) / 2;
          });
          if (d.value >= midPoints[i]) {
            return "end";
          } else {
            return "start";
          }
        })
        .attr("transform", (d, i) => {
          return `translate(${
            d.direction === -1
              ? xs()[i](d.value) + dimensions.marginLeft
              : xs_rev()[i](d.value) + dimensions.marginLeft
          }, ${(y()(d.name) as number) + y().bandwidth() / 2})`;
        })
        .text((d) => `${d.value}`)
        .attr("font-size", "16px")
        .attr("font-weight", "light"); */

      // draw a transparent overlay on top of each bar to work as an event detector
      enter
        .append("rect")
        .attr("class", "preferencePointerOverlay")
        .attr("transform", `translate(${dimensions.marginLeft}, 0)`)
        .attr("width", dimensions.chartWidth)
        .attr("height", dimensions.chartHeight)
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "yellow")
        .attr("opacity", 0.0);

      /*  enter
        .append("path")
        .attr("class", "pointerCurrentPreference")
        .attr("d", symbol())
        .attr("transform", "translate(25,25)")
        .attr("x", () => {
          if (direction === -1) {
            return xs()(currentPoint) + dimensions.marginLeft;
          } else {
            return xs_rev()(currentPoint) + dimensions.marginLeft;
          }
        })
        .attr("y", 0);
 */
      // Position the x-axises

      selection
        .append("g")
        .attr(
          "transform",
          `translate(${dimensions.marginLeft}, ${dimensions.marginTop + 1})`
        )
        .call(xAxis())
        .style("font-size", "1.5rem")
        .attr("font-weight", "bold");
    }
  }, [
    selection,
    xs,
    xs_rev,
    dimensions,
    xAxis,
    currentPoint,
    direction,
    color,
    color_sup,
  ]);

  // update the negative and positive spaces when the current solution is updated
  // useEffect(() => {
  //   if (!selection) {
  //     return;
  //   }
  //   const enterPosMaxNegMin = selection.selectAll(".posMaxNegMin").data(data);
  //   // update the positive space for max problems and negative space for min problems
  //   enterPosMaxNegMin.attr("width", (d, i) => {
  //     if (d.direction === -1) {
  //       return xs()[i](posNegMiddle[i]);
  //     } else {
  //       return xs_rev()[i](posNegMiddle[i]);
  //     }
  //   });

  //   const enterNegMaxPosMin = selection.selectAll(".negMaxPosMin").data(data);
  //   // draw the positive space for min problems and the negative space for pos problems
  //   enterNegMaxPosMin
  //     .attr("width", (d, i) => {
  //       if (d.direction === -1) {
  //         return dimensions.chartWidth - xs()[i](posNegMiddle[i]);
  //       } else {
  //         return dimensions.chartWidth - xs_rev()[i](posNegMiddle[i]);
  //       }
  //     })
  //     .attr("x", (d, i) => {
  //       if (d.direction === -1) {
  //         return xs()[i](posNegMiddle[i]);
  //       } else {
  //         return xs_rev()[i](posNegMiddle[i]);
  //       }
  //     });
  // }, [data, posNegMiddle, dimensions]);

  /* We need an useEffect to watch for changes in the preference pointer values and update not
   *  just the location of the pointers, but also the event handlers on the overlay.
   */
  useEffect(() => {
    if (!selection) {
      return;
    } else {
      // select the preference pointers
      const enterPointer = selection.selectAll(".preferencePointer");

      // update the x location of the preference pointer according to the state of prefPointerLocs
      enterPointer
        .transition()
        .duration(100)
        .ease(easeCubic)
        .attr("x1", () => {
          if (direction === -1) {
            return xs()(prefPointerLoc) + dimensions.marginLeft;
          } else {
            return xs_rev()(prefPointerLoc) + dimensions.marginLeft;
          }
        })
        .attr("x2", () => {
          if (direction === -1) {
            return xs()(prefPointerLoc) + dimensions.marginLeft;
          } else {
            return xs_rev()(prefPointerLoc) + dimensions.marginLeft;
          }
        });

      // select the info pointers
      const enterInfoPtr = selection.selectAll(".infoPointer");

      // update the x location of the info pointer according to the state of infoPointerLocs
      enterInfoPtr
        .attr("x1", (d, i) => {
          if (direction === -1) {
            return xs()(infoPointerLoc) + dimensions.marginLeft;
          } else {
            return xs_rev()(infoPointerLoc) + dimensions.marginLeft;
          }
        })
        .attr("x2", () => {
          if (direction === -1) {
            return xs()(infoPointerLoc) + dimensions.marginLeft;
          } else {
            return xs_rev()(infoPointerLoc) + dimensions.marginLeft;
          }
        });

      // select the info labels
      // const enterInfoLabels = selection.selectAll(".infoLabel").data(data);

      // // update the x location of the info labels according to the state of infoPointerLocs
      // enterInfoLabels
      //   .attr("transform", (d, i) => {
      //     return `translate(${
      //       d.direction === -1
      //         ? xs()[i](infoPointerLocs[i]) + dimensions.marginLeft
      //         : xs_rev()[i](infoPointerLocs[i]) + dimensions.marginLeft
      //     }, ${y()(d.name)! + y().bandwidth() / 2})`;
      //   })
      //   .attr("text-anchor", (_, i) => {
      //     const midPoints = xs().map((x, _) => {
      //       return (x.domain()[0] + x.domain()[1]) / 2;
      //     });
      //     if (infoPointerLocs[i] >= midPoints[i]) {
      //       return "end";
      //     } else {
      //       return "start";
      //     }
      //   })
      //   .text((d, i) => `${infoPointerLocs[i].toExponential(2)}`);

      // select the event detection overlay, this needs to be updated because the first useEffect
      // does not have access to the updated state of preferencePointerLocs
      const enterOverlay = selection.selectAll(".preferencePointerOverlay");

      enterOverlay.on("click", (event, d) => {
        // const match_index = data.findIndex((datum) => datum.name === d.name);
        const prefValue = (direction === -1 ? xs() : xs_rev()).invert(
          pointer(event)[0]
        );
        // SUPER IMPORTANT TO **NOT** CHANGE STATE, BUT TO CREATE A NEW OBJECT!
        // const newLocs = prefPointerLocs.map((loc) => loc);
        // newLocs[match_index] = prefValue;
        const newLoc = prefValue;
        setPrefPointerLoc(newLoc);
        setReferencePoint([newLoc, index]);
      });

      enterOverlay.on("mousemove", (event, d) => {
        // const match_index = data.findIndex((datum) => datum.name === d.name);
        const prefValue = (direction === -1 ? xs() : xs_rev()).invert(
          pointer(event)[0]
        );
        // SUPER IMPORTANT TO **NOT** CHANGE STATE, BUT TO CREATE A NEW OBJECT!
        // const newLocs = infoPointerLocs.map((loc) => loc);
        // newLocs[match_index] = prefValue;
        const newLoc = prefValue;
        setInfoPointerLoc(newLoc);
      });

      enterOverlay.on("mouseleave", () => {
        setInfoPointerLoc(prefPointerLoc);
      });
    }
  }, [
    selection,
    prefPointerLoc,
    infoPointerLoc,
    xs,
    xs_rev,
    xAxis,
    dimensions,
    setReferencePoint,
    direction,
    index,
  ]);

  return <div ref={ref} id="container" className="svg-container-hb"></div>;
};

export default SimpleHorizontalBar;
