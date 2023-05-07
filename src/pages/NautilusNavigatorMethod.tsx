import { useEffect, useState, useRef } from "react";
import { ProblemInfo, NavigationData } from "../types/ProblemTypes";
import { Tokens } from "../types/AppTypes";
import { Row, Col } from "react-bootstrap";
import ReactLoading from "react-loading";
import { NavigationWindow } from "../components/NavigationWindow";
//import Slider from "@material-ui/core/Slider";
import "desdeo-components/src/components/Svg.css";
import { Link, useNavigate } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { CardContent } from "@material-ui/core";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Slider from "@mui/material/Slider";
import { createMethod } from "./nimbus/nimbusHelpers";

const drawerWidth = 300;
// TODO: should be imported, and need to update the NavigationData type in NavigationBars /types
// Test with 7 maximizable objectives.. only possible to test the drawing I guess..
//
// this for navigationProblems
type RectDimensions = {
  chartWidth: number;
  chartHeight: number;
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  marginBottom: number;
};

interface NautilusNavigatorMethodProps {
  isLoggedIn: boolean;
  loggedAs: string;
  tokens: Tokens;
  apiUrl: string;
  problemGroup: number;
}

function NautilusNavigatorMethod({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  problemGroup,
}: NautilusNavigatorMethodProps) {
  // holds active problem info, server form
  const [activeProblemInfo, SetActiveProblemInfo] = useState<ProblemInfo>();
  const [ready, SetReady] = useState<Boolean>(false);
  // boolean to contain method state
  const [methodStarted, SetMethodStarted] = useState<boolean>(false);
  // Data in user form to be sent to NavigationBars.
  const [convertedData, SetConvertData] = useState<NavigationData>();
  // All steps taken, all data in server form. To be used when taking steps back etc.
  const [dataArchive, SetDataArchive] = useState<Array<NavigationData>>([]);
  const [startArchive, SetStartArchive] = useState<NavigationData>();
  // right now acts as the refe point to sent to the InputForm. Could/should be used better
  const [referencePoint, SetReferencePoint] = useState<number[]>([]);
  const [boundaryPoint, SetBoundaryPoint] = useState<number[]>([]);

  // These have point, could possibly do nicer but works and needed
  const [iterateNavi, SetIterateNavi] = useState<boolean>(false);
  const itestateRef = useRef<boolean>();
  itestateRef.current = iterateNavi;

  const navigate = useNavigate();

  // track dataArch change during iterate
  const dRef = useRef<Array<NavigationData>>();
  dRef.current = dataArchive;

  // handles speed.
  const speedo = 200; // in ms. speedo / speed, is the current speed of iteration
  const [speed, SetSpeed] = useState<number>(1);
  const speedRef = useRef<number>();
  speedRef.current = speed;

  const [currentStep, SetCurrentStep] = useState<number>(1);

  const [goPrevious, SetPrevious] = useState<boolean>(false);
  const prevRef = useRef<boolean>(false);
  prevRef.current = goPrevious;

  // keep track of the distance traveled to show in the progress bar
  const [distanceTraveled, SetDistanceTraveled] = useState<number>(0);

  // general
  const [fetchedInfo, SetFetchedInfo] = useState<boolean>(false);
  const [loading, SetLoading] = useState<boolean>(false);

  const [satisfied, SetSatisfied] = useState<boolean>(false);
  const [showFinal, SetShowFinal] = useState<boolean>(false);
  //const [alternatives, SetAlternatives] = useState<ObjectiveData>();
  //const [finalObjectives, SetFinalObjectives] = useState<number[]>([]);

  // TODO: set decision variables here
  const [finalVariables, SetFinalVariables] = useState<number[][]>([]);
  const [finalObjectives, SetFinalObjectives] = useState<number[][]>([]);

  // default dims. Change height to fit objectives better, currently no adaptive chartdims.
  const dims: RectDimensions = {
    chartHeight: 1200,
    chartWidth: 1200,
    marginLeft: 80,
    marginRight: 10,
    marginTop: 40,
    marginBottom: 0,
  };

  // FUNCTIONS to handle stuff

  // NavigationBars needs stuff converted. Logic, ideal is top, maximizing and upperBound is on top.
  const convertData = (data: NavigationData, minimize: number[]) => {
    return {
      upperBounds: data.upperBounds.map((d, i) =>
        d.map((v) => (minimize[i] === 1 ? v : -v))
      ),
      lowerBounds: data.lowerBounds.map((d, i) =>
        d.map((v) => (minimize[i] === 1 ? v : -v))
      ),
      referencePoints: data.referencePoints.map((d, i) =>
        d.map((v) => (minimize[i] === 1 ? v : -v))
      ),
      boundaries: data.boundaries.map((d, i) =>
        d.map((v) => (minimize[i] === 1 ? v : -v))
      ),
      totalSteps: data.totalSteps,
      stepsTaken: data.stepsTaken,
    };
  };

  // TODO: make tests
  const popLast = (dataArchive: any[]) => {
    dataArchive[dataArchive.length - 1].upperBounds.map((d: number[]) => {
      d.pop();
    });

    dataArchive[dataArchive.length - 1].lowerBounds.map((d: number[]) => {
      d.pop();
    });

    dataArchive[dataArchive.length - 1].referencePoints.map((d: number[]) => {
      d.pop();
    });

    dataArchive[dataArchive.length - 1].boundaries.map((d: number[]) => {
      d.pop();
    });
  };

  // temp delay function to make the iter speed animation
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const toggleIteration = () => {
    SetLoading((loading) => !loading);
    SetIterateNavi((iterateNavi) => !iterateNavi);
  };

  // TODO: basic idea works, to be done better.
  const goBack = (step: number) => {
    console.log("here!");
    console.log(dataArchive);
    // need to stop iteration if going back
    if (itestateRef.current === true) {
      SetIterateNavi(false);
      //ite
    }
    if (step > currentStep) {
      console.log("cant go back to the future");
      return;
    }
    console.log(step);
    dataArchive!.splice(step); //, dataArchive!.length - 1);

    const newConData = convertData(
      dataArchive![dataArchive!.length - 1],
      activeProblemInfo!.minimize
    );
    // Update distance traveled
    SetDistanceTraveled(
      dataArchive![dataArchive!.length - 1].distance === undefined
        ? 0
        : dataArchive![dataArchive!.length - 1].distance!
    );
    SetConvertData(newConData);
    // update referencePoints
    const updatedRef = newConData!.referencePoints.flatMap((d: number[]) => [
      d[newConData!.referencePoints[0].length - 1],
    ]);
    SetReferencePoint(updatedRef);
    const updatedBound = newConData!.boundaries.flatMap((d: number[]) => [
      d[newConData!.boundaries[0].length - 1],
    ]);
    console.log("After");
    console.log(dataArchive);
    SetBoundaryPoint(updatedBound);
    //SetDataArchive(dataArchive)
    SetCurrentStep(step);
    SetPrevious(true); // state to true so iterate works properly
    SetShowFinal(false);
  };

  /*   const checkSolution = () => {
    // get decision variables from server
    console.log("checking!");

    const rows = finalObjectives.map((objectives, i) =>
      objectives.concat(finalVariables[i])
    );
    console.log(rows);
  }; */

  // COMPONENT ACTIVITIES

  // fetch current problem info
  useEffect(() => {
    const fetchProblemInfo = async () => {
      try {
        const res = await fetch(`${apiUrl}/problem/access`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokens.access}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ problemGroup: problemGroup }),
        });

        if (res.status == 200) {
          // ok!
          const body = await res.json();

          if (activeProblemInfo === undefined) {
            SetActiveProblemInfo({
              problemId: body.problem_id,
              problemName: body.problem_name,
              problemType: body.problem_type,
              objectiveNames: body.objective_names,
              variableNames: body.variable_names,
              nObjectives: body.n_objectives,
              ideal: body.ideal,
              nadir: body.nadir,
              minimize: body.minimize,
            });
          }
          //SetMethodStarted(true);
          SetReady(true);
        } else {
          //some other code
          console.log(`could not fetch problem, got status code ${res.status}`);
        }
      } catch (e) {
        console.log("not ok, in fetchProblemInfo");
        console.log(e);
        // do nothing
      }
    };

    fetchProblemInfo();
  }, []);

  // start the method
  useEffect(() => {
    if (!ready) {
      return;
    }
    if (activeProblemInfo === null || activeProblemInfo === undefined) {
      // no active problem, do nothing
      console.log("Active problem not defined yet.");
      return;
    }
    if (methodStarted) {
      // method already started, do nothing
      console.log("method already started");
      return;
    }
    // start the method
    const startMethod = async () => {
      try {
        const res = await fetch(`${apiUrl}/method/control`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        });

        if (res.status == 200) {
          const body = await res.json();

          const ideal = activeProblemInfo.ideal;
          const nadir = activeProblemInfo.nadir;
          // NOTE: server sends in different logic than we use here. upperBound is thought as the visual upperbound.
          console.log(body.response.reachable_lb);
          const newArchiveData = {
            upperBounds: activeProblemInfo.minimize.map(
              (val: number, index: number) => {
                if (val === 1) {
                  return [body.response.reachable_ub[index]];
                }
                return [body.response.reachable_lb[index]];
              }
            ),

            lowerBounds: activeProblemInfo.minimize.map(
              (val: number, index: number) => {
                if (val === 1) {
                  return [body.response.reachable_lb[index]];
                }
                return [body.response.reachable_ub[index]];
              }
            ),
            referencePoints: activeProblemInfo.minimize.map(
              (_: any, i: number) => {
                return [(nadir[i] + ideal[i]) / 2].concat(
                  (nadir[i] + ideal[i]) / 2
                );
              }
            ),
            boundaries: activeProblemInfo.minimize.map((d, i) => {
              return [nadir[i]].concat(nadir[i]);
            }),
            totalSteps: 40, // this has to be 100, since step 1 is the first step according to the server.
            stepsTaken: body.response.step_number,
            //stepsTaken: 0,
            distance: body.response.distance, // check for possible float errors
            reachableIdx: body.response.reachable_idx,
            stepsRemaining: body.response.steps_remaining,
            navigationPoint: body.response.navigation_point,
          };

          // put over the old one since we want the steps go along with the drawing, drawing needs more than one point to work
          SetStartArchive(newArchiveData);
          const newconvertedData = convertData(
            newArchiveData,
            activeProblemInfo!.minimize
          );
          SetConvertData(newconvertedData);
          // TODO: this is needed right now, but it creates another archive later for iterations. So this should not be needed.
          SetDataArchive([newArchiveData]);
          // TODO: do we need thse
          SetReferencePoint(
            newconvertedData.referencePoints.flatMap((d: number[]) => [
              d[newconvertedData.referencePoints[0].length - 1],
            ])
          );
          SetBoundaryPoint(
            newconvertedData.boundaries.flatMap((d: number[]) => [
              d[newconvertedData.boundaries[0].length - 1],
            ])
          );

          // update distance traveled
          SetDistanceTraveled(body.response.distance);

          SetFetchedInfo(true);
          SetMethodStarted(true);
        }
      } catch (e) {
        console.log("not ok, could not start the method");
      }
    };

    startMethod();
  }, [activeProblemInfo, methodStarted, ready]);

  useEffect(() => {
    if (itestateRef.current === false) {
      // console.log("lopeta iter");
      return;
    }

    if (dataArchive.length === 0) {
      SetDataArchive([startArchive!]);
    }

    const iterate = async () => {
      // Attempt to iterate
      SetLoading(true);
      console.log("loading...");
      console.log(currentStep);

      // turn these for the server
      //console.log("refe", referencePoint);
      // TODO: handle these better. Should never fire though.
      if (activeProblemInfo === undefined) {
        console.log("not ok, activeProblem not defined");
        return;
      }
      if (startArchive === undefined) {
        console.log("not ok, startArchive not defined");
        return;
      }
      const refe = referencePoint.map((d, i) =>
        activeProblemInfo.minimize[i] === 1 ? d : -d
      );
      const bounds = boundaryPoint.map((d, i) =>
        activeProblemInfo.minimize[i] === 1 ? d : -d
      );

      while (itestateRef.current === true) {
        //const dataArchive = dRef.current;
        if (dataArchive === undefined) {
          return;
        }
        if (dataArchive.length === 0) {
          return;
        }
        let resp: any; // since 2 responses depending are we backtracking or not
        if (prevRef.current === false) {
          const respContinue = {
            reference_point: refe,
            speed: speedRef.current,
            go_to_previous: false,
            stop: !itestateRef.current,
            user_bounds: bounds,
          };
          resp = respContinue;
        }
        if (prevRef.current === true) {
          // TODO: Stepping back to be fixed
          const respGoPrev = {
            ideal: activeProblemInfo.ideal,
            nadir: activeProblemInfo.nadir,
            reachable_ub: dataArchive[currentStep - 1].lowerBounds.flatMap(
              (d: number[]) => [d[currentStep - 1]]
            ),
            reachable_lb: dataArchive[currentStep - 1].upperBounds.flatMap(
              (d: number[]) => [d[currentStep - 1]]
            ),
            reference_point: refe,
            speed: speedRef.current,
            go_to_previous: true,
            stop: !itestateRef.current,
            user_bounds: bounds,
            step_number: dataArchive[currentStep - 1].stepsTaken,
            reachable_idx: dataArchive[currentStep - 1].reachableIdx, // to dataArc
            steps_remaining: dataArchive[currentStep - 1].stepsRemaining, // TODO: does it need to come from archive + possible bug with not being 0
            distance: dataArchive[currentStep - 1].distance,
            allowed_speeds: [1, 2, 3, 4, 5],
            current_speed: speedRef.current,
            navigation_point: dataArchive[currentStep - 1].navigationPoint, // to dataArc
          };
          resp = respGoPrev;
        }

        // Guess im ok until this
        try {
          console.log(`Trying to iterate with ${refe}`);
          if (resp === undefined) {
            console.log(`Trying to iterate with undefined ${resp}`);
            return;
          }
          console.log("call");
          const res = await fetch(`${apiUrl}/method/control`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${tokens.access}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              response: resp,
            }),
          });
          console.log("response");

          if (res.status === 200) {
            // ok
            const body = await res.json();
            const response = body.response;
            //console.log("vastaus", response);
            console.log("body");
            console.log(body);

            // TODO:
            const dataArchive = dRef.current;
            if (dataArchive === undefined) {
              console.log("not ok, dataArchive not defined");
              return;
            }
            // hacky way to remove the last indexes of all the sublists and then pop the last index of dataArchive aswell.
            // have to be done when backtracking to avoid having same two steps (with same distance etc) in a row.
            if (prevRef.current === true && currentStep != 1) {
              popLast(dataArchive); // pop last of arrays
              dataArchive.pop(); // pop last data array
              //SetDataArchive(dataArchive!); // not sure if does anything, not needed
            }

            SetPrevious(false);
            // TODO: concatting here brings the above issue, so if done otherway could be avoided.
            const newArchiveData: NavigationData = {
              upperBounds: activeProblemInfo.minimize.map(
                (val: number, index: number) => {
                  if (val === 1) {
                    return dataArchive[dataArchive.length - 1].upperBounds[
                      index
                    ].concat(body.response.reachable_ub[index]);
                  }
                  return dataArchive[dataArchive.length - 1].upperBounds[
                    index
                  ].concat(body.response.reachable_lb[index]);
                }
              ),
              lowerBounds: activeProblemInfo.minimize.map(
                (val: number, index: number) => {
                  if (val === 1) {
                    return dataArchive[dataArchive.length - 1].lowerBounds[
                      index
                    ].concat(body.response.reachable_lb[index]);
                  }
                  return dataArchive[dataArchive.length - 1].lowerBounds[
                    index
                  ].concat(body.response.reachable_ub[index]);
                }
              ),
              referencePoints: refe.map((d: number, i: number) => {
                return dataArchive[dataArchive.length - 1].referencePoints[
                  i
                ].concat(d);
              }),
              boundaries: body.response.user_bounds.map(
                (d: number, i: number) => {
                  return dataArchive[dataArchive.length - 1].boundaries[
                    i
                  ].concat(d);
                }
              ),
              totalSteps: 40,
              stepsTaken: body.response.step_number,
              distance: body.response.distance, // check for possible float errors
              reachableIdx: body.response.reachable_idx,
              stepsRemaining: body.response.steps_remaining,
              navigationPoint: body.response.navigation_point,
            };

            SetDataArchive((dataArchive) => [...dataArchive!, newArchiveData]);

            // TODO: here we still draw from the newest data though.
            const convertedData = convertData(
              newArchiveData,
              activeProblemInfo!.minimize
            );
            SetConvertData(convertedData);
            SetCurrentStep(convertedData.stepsTaken);
            // update referencePoints
            const updatedRef = convertedData!.referencePoints.flatMap(
              (d: number[]) => [d[convertedData!.referencePoints[0].length - 1]]
            );
            SetReferencePoint(updatedRef);
            const updatedBound = convertedData!.boundaries.flatMap(
              (d: number[]) => [d[convertedData!.boundaries[0].length - 1]]
            );
            SetBoundaryPoint(updatedBound);

            // Update distance traveled
            SetDistanceTraveled(body.response.distance);

            if (newArchiveData.distance === 100) {
              console.log("Method finished with 40 steps");
              // fetch final solution
              const respFinal = {
                reference_point: refe,
                speed: speedRef.current,
                go_to_previous: false,
                stop: true,
                user_bounds: bounds,
              };

              const resFinal = await fetch(`${apiUrl}/method/control`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${tokens.access}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  response: respFinal,
                }),
              });

              const bodyFinal = await resFinal.json();

              const variables = bodyFinal.response.decision_vectors;
              const objectives = bodyFinal.response.objective_vectors;

              if (variables.length > 0 && typeof variables[0] === "number") {
                // non-empty and first element in number
                SetFinalVariables([variables]);
              } else if (variables.length === 0) {
                // empty
                SetFinalVariables([variables]);
              } else {
                // non-empty, first element something else than number (must be a list)
                SetFinalVariables(variables);
              }
              if (objectives.length > 0 && typeof objectives[0] === "number") {
                SetFinalObjectives([objectives]);
              } else if (objectives.length === 0) {
                SetFinalObjectives([objectives]);
              } else {
                SetFinalObjectives(objectives);
              }
              SetIterateNavi(false);
              SetLoading(false);

              SetShowFinal(true);

              return;
            }
            // hacky way to make speed matter
            await delay(speedo / speedRef.current!);
          } else {
            console.log("Got a response which is not 200");
          }
        } catch (e) {
          console.log("Could not iterate nau navi");
          console.log(e);
          // do nothing
        }
      }
      SetIterateNavi(false);
      SetLoading(false);
    };
    iterate();
  }, [iterateNavi, SetIterateNavi, itestateRef.current]);

  return (
    <Box sx={{ display: "flex", width: "-webkit-fill-available" }}>
      <Toolbar />
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          padding: "1rem",
          overflow: "hidden",
        }}
      >
        <Drawer
          sx={{
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
            padding: "1rem",
            overflow: "hidden",
          }}
          variant="permanent"
          anchor="left"
          PaperProps={{ elevation: 9 }}
        >
          <Toolbar />
          <Typography
            sx={{
              alignSelf: "center",
              fontWeight: "lightbold",
              marginTop: "1rem",
            }}
          >
            Progress:
          </Typography>
          <Typography
            variant="h5"
            sx={{
              alignSelf: "center",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
            color={"primary"}
          >{`${Math.round(distanceTraveled)}%`}</Typography>

          <Typography sx={{ marginLeft: 2 }}>Navigation Speed</Typography>

          <Slider
            sx={{ marginLeft: "2rem", width: "80%" }}
            value={speed}
            onChange={(_, val) => {
              SetSpeed(val as number);
            }}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="off"
            step={1}
            marks={[
              {
                value: 1,
                label: "Slow",
              },
              {
                value: 2,
                label: "",
              },
              {
                value: 3,
                label: "",
              },
              {
                value: 4,
                label: "",
              },
              {
                value: 5,
                label: "Fast",
              },
            ]}
            min={1}
            max={5}
          />
          <Box
            justifyContent={"center"}
            display={"flex"}
            sx={{ marginTop: "2rem" }}
          >
            <Button
              disabled={!loading && !iterateNavi && !showFinal ? false : true}
              variant="contained"
              size={"large"}
              onClick={toggleIteration}
              sx={{ marginRight: "1rem" }}
            >
              Start
            </Button>
            <Button
              size={"large"}
              variant="contained"
              disabled={loading ? false : true}
              onClick={toggleIteration}
            >
              Stop
            </Button>
          </Box>

          {/* {!loading && !iterateNavi && (
            <Button disabled={false} size={"large"} onClick={toggleIteration}>
              Start Navigation
            </Button>
          )} */}
          {loading && (
            <Button disabled={true} size={"large"} variant={"outlined"}>
              {"Working... "}
              <ReactLoading
                type={"bubbles"}
                color={"#ffffff"}
                className={"loading-icon"}
                height={28}
                width={32}
              />
            </Button>
          )}
          <Box
            position="absolute"
            bottom="0px"
            display={"flex"}
            justifyContent={"center"}
            width={"-webkit-fill-available"}
          >
            {showFinal && (
              <div>
                {finalObjectives[0].map(
                  (objectives, i) => objectives * activeProblemInfo!.minimize[i]
                )}
              </div>
            )}
            <Button
              //component={Link}
              //to="/nimbus"
              variant="contained"
              color="primary"
              size="large"
              disabled={showFinal ? false : true}
              onClick={() => {
                createMethod(
                  apiUrl,
                  tokens,
                  problemGroup,
                  "synchronous_nimbus"
                );
                navigate("/nimbus");
              }}
            >
              Next
            </Button>
          </Box>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
        }}
      >
        <Toolbar />
        <Container>
          {!satisfied && (
            <>
              <Row>
                <Col>
                  {fetchedInfo && (
                    <div style={{ width: "800px" }}>
                      {/* console.log("ennen piirtoa archive", dataArchive) */}
                      {/*console.log("ennen piirtoa conv data", convertedData) */}
                      <NavigationWindow
                        objectiveData={{
                          ...convertedData!,
                          ...{
                            objectiveNames: activeProblemInfo!.objectiveNames,
                            nadir: activeProblemInfo!.nadir.map((v, i) =>
                              activeProblemInfo!.minimize[i] === 1 ? v : -v
                            ),
                            ideal: activeProblemInfo!.ideal.map((v, i) =>
                              activeProblemInfo!.minimize[i] === 1 ? v : -v
                            ),
                            minimize: activeProblemInfo!.minimize,
                          },
                        }}
                        handleReferenceValue={(refData: [number, number]) => {
                          let refe = referencePoint;
                          refe[refData[1]] = refData[0];
                          SetReferencePoint(refe);
                        }}
                        handleBoundValue={(boundData: [number, number]) => {
                          let boundy = boundaryPoint;
                          boundy[boundData[1]] = boundData[0];
                          SetBoundaryPoint(boundy);
                        }}
                        handleStep={(s: number) => {
                          // if iteration have to stop iteration first
                          if (itestateRef.current === true) {
                            SetIterateNavi(false);
                          }
                          //console.log("ASKEL", s)
                          // checks for step being correct etc..
                          if (s > currentStep) {
                            // do nothing
                            console.log("cant step to the future");
                          }
                          if (s < 1) {
                            console.log("not possible value");
                          }
                          SetCurrentStep(s);
                          goBack(s);
                        }}
                      />
                    </div>
                  )}
                </Col>
              </Row>
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
}
export default NautilusNavigatorMethod;
