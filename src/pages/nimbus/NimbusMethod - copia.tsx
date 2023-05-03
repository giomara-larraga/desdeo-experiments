import { useEffect, useState, useCallback } from "react";
import {
  ProblemInfo,
  ObjectiveData,
  ObjectiveDatum,
} from "../../types/ProblemTypes";
import HorizontalBars from "../../components/HorizontalBars";
import { Tokens } from "../../types/AppTypes";

import { Link } from "react-router-dom";
import { ParseSolutions, ToTrueValues } from "../../utils/DataHandling";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ParallelAxes } from "desdeo-components";
import SolutionTable from "../../components/SolutionTable";
import SolutionTableMultiSelect from "../../components/SolutionTableMultiSelect";
import ClassificationsInputForm from "../../components/ClassificationsInputForm";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { CardContent } from "@material-ui/core";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArchiveIcon from "@mui/icons-material/Archive";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";

import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import { NimbusMethodProps, NimbusState, Classification } from "./nimbusTypes";
import { Col, Form, Row, Table } from "react-bootstrap";

const drawerWidth = 550;

function NimbusMethod({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  problemGroup,
}: //activeProblemId,
NimbusMethodProps) {
  const [activeProblemInfo, SetActiveProblemInfo] = useState<ProblemInfo>();
  const [methodCreated, SetMethodCreated] = useState<boolean>(false);
  const [methodStarted, SetMethodStarted] = useState<boolean>(false);
  const [helpMessage, SetHelpMessage] = useState<string>(
    "Method not started yet."
  );
  const [preferredPoint, SetPreferredPoint] = useState<number[]>([]);
  const [fetchedInfo, SetFetchedInfo] = useState<boolean>(false);
  const [loading, SetLoading] = useState<boolean>(false);
  const [color, setColor] = useState("#ffffff");
  const [currentState, SetCurrentState] = useState<NimbusState>("not started");
  const [classifications, SetClassifications] = useState<Classification[]>([]);
  const [classificationLevels, SetClassificationLevels] = useState<number[]>(
    []
  );
  const [classificationOk, SetClassificationOk] = useState<boolean>(false);
  const [numberOfSolutions, SetNumberOfSolutions] = useState<number>(1);
  const [newSolutions, SetNewSolutions] = useState<ObjectiveData>();
  const [archivedSolutions, SetArchivedSolutions] = useState<ObjectiveData>();
  const [selectedIndices, SetSelectedIndices] = useState<number[]>([]);
  const [selectedIndexArchive, SetSelectedIndexArchive] = useState<number>(-1);
  const [nSolutionsInArchive, SetNSolutionsInArchive] = useState<number>(0);
  const [finalVariables, SetFinalVariables] = useState<number[]>([]);
  const [nIteration, SetNIteration] = useState<number>(0);
  const [
    solutionsArchivedAfterClassification,
    SetSolutionsArchivedAfterClassification,
  ] = useState<boolean>(false);
  const [newSolutionTableOffset, SetNewSolutionTableOffset] =
    useState<number>(0);

  // related to quesionnaires
  const [showQAfterIterate, SetShowQAfterIterate] = useState<boolean>(false);
  const [showQAfterNew, SetShowQAfterNew] = useState<boolean>(false);
  const [showQEndMethod, SetShowQEndMethod] = useState<boolean>(false);
  const [afterQEndMethodSuccess, SetAfterQEndMethodSuccess] =
    useState<boolean>(false);
  const [ready, SetReady] = useState<Boolean>(false);
  // create the method
  useEffect(() => {
    const createMethod = async () => {
      try {
        const methodCreation = {
          problemGroup: problemGroup,
          method: "synchronous_nimbus",
        };
        const res = await fetch(`${apiUrl}/method/create`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${tokens.access}`,
          },
          body: JSON.stringify(methodCreation),
        });

        if (res.status === 201) {
          const body = await res.json();
          console.log(body);
          SetMethodCreated(true);
          // created!
        } else {
          console.log(res);
          console.log(
            `Got return code ${res.status}. Could not create method.`
          );
          SetMethodCreated(false);
          // do nothing
        }
      } catch (e) {
        console.log(e);
        // Do nothing
      }
    };
    createMethod();
  }, [methodCreated]);

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
            "Content-Type": "application/json",
          },
        });

        if (res.status == 200) {
          const body = await res.json();
          SetMethodStarted(true);
          SetPreferredPoint([...body.response.objective_values]); // make copy to avoid aliasing
          SetClassificationLevels(body.response.objective_values);
          SetHelpMessage("Please classify each of the shown objectives.");
          SetCurrentState("classification");
          SetNIteration(1);
          console.log("start");
        }
      } catch (e) {
        console.log("not ok, could not start the method");
        //console.log(e);
      }
    };

    startMethod();
  }, [ready, currentState]);

  const iterate = async (nimbusState: NimbusState = "classification") => {
    // Attempt to iterate
    SetLoading(true);

    switch (nimbusState) {
      case "classification": {
        // CLASSIFICATION!
        if (!classificationOk) {
          // classification not ok, do nothing
          SetHelpMessage(
            "Check the given classifications. Something must be allowed to improve and something must be allowed to worsen."
          );
          break;
        }
        try {
          console.log(`iterating with levels ${classificationLevels}`);
          const res = await fetch(`${apiUrl}/method/control`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${tokens.access}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              response: {
                classifications: classifications,
                levels: classificationLevels,
                number_of_solutions: numberOfSolutions,
              },
            }),
          });

          if (res.status === 200) {
            // ok
            const body = await res.json();
            const response = body.response;
            SetNewSolutions(
              ParseSolutions(response.objectives, activeProblemInfo!)
            );
            SetHelpMessage(
              "Select new solutions to be saved to an archive, or select the currently preferred solution for classification or to stop with."
            );

            SetCurrentState("archive");
            SetSolutionsArchivedAfterClassification(false);
            SetSelectedIndexArchive(-1);
            break;
          } else {
            // not ok
            console.log(`Got response code ${res.status}`);
            // do nothing
            break;
          }
        } catch (e) {
          console.log("Could not iterate NIMBUS");
          console.log(e);
          // do nothing
          break;
        }
      }
      case "archive": {
        // ARCHIVE SOLUTIONS -> SELECT PREFERRED
        try {
          const res = await fetch(`${apiUrl}/method/control`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${tokens.access}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              response: {
                indices: selectedIndices,
              },
            }),
          });
          if (res.status === 200) {
            const body = await res.json();
            const response = body.response;

            const chosenNew =
              newSolutions !== undefined
                ? selectedIndices.map((i) => newSolutions.values[i].value)
                : [];
            // update the solutions to be shown
            const toBeShown = ParseSolutions(
              response.objectives.slice(
                nSolutionsInArchive,
                nSolutionsInArchive + numberOfSolutions
              ),
              activeProblemInfo!
            );
            SetNewSolutions(toBeShown);

            SetHelpMessage("CHANGE ME!!!!");
            // SetNimbusState("intermediate");
            // SKIP INTERMEDIATE STEP
            try {
              const resArchive = await fetch(`${apiUrl}/method/control`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${tokens.access}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  response: {
                    indices: [],
                    number_of_desired_solutions: 0,
                  },
                }),
              });

              if (resArchive.status === 200) {
                // ok
                const bodyArchive = await resArchive.json();
                const responseArchive = bodyArchive.response;

                if (selectedIndices.length === 0) {
                  // do nothing
                } else {
                  // pick archived solutions
                  SetArchivedSolutions(
                    ParseSolutions(
                      responseArchive.objectives.slice(
                        0,
                        nSolutionsInArchive + selectedIndices.length
                      ),
                      activeProblemInfo!
                    )
                  );
                }

                SetHelpMessage(
                  "Please select the solution you prefer the most from the shown solutions. You must select only one solution to continue."
                );
                SetCurrentState("select preferred");
                SetSolutionsArchivedAfterClassification(true);
                // how many solutions are in the archive
                SetNSolutionsInArchive(
                  nSolutionsInArchive + selectedIndices.length
                );
                // reset the active selection
                SetSelectedIndices([]);
                break;
              } else {
                // not ok
                console.log(`Got response code ${res.status}`);
                // do nothing
                break;
              }
            } catch (e) {
              console.log("Could not iterate NIMBUS");
              console.log(e);
              // do nothing
              break;
            }
          } else {
            // not ok
            console.log(`Got response code ${res.status}`);
            // do nothing
            return;
          }
        } catch (e) {
          console.log("Could not iterate NIMBUS");
          console.log(e);
          // do nothing
          break;
        }
      }
      /*case "classify preferred":
      case "stop with preferred": {
        // SELECT PREFERRED -> STOP or CLASSIFICATION
        console.log("Selected index archive");
        console.log(selectedIndexArchive);
        console.log("Selected indices");
        console.log(selectedIndices);

        let index: number = 0;

        if (selectedIndices.length === 0 && selectedIndexArchive === -1) {
          SetHelpMessage("Please select a preferred solution first.");
          // do nothing;
          break;
        } else if (selectedIndices.length > 0) {
          index = selectedIndices[0] + newSolutionTableOffset;
        } else if (selectedIndexArchive !== -1) {
          index = selectedIndexArchive;
        } else {
          SetHelpMessage("Invalid selection.");
          // do nothin;
          break;
        }
        try {
          if (!solutionsArchivedAfterClassification) {
            // archive and intermediate steps need to be skipped, henche, empty indices
            const skipRes = await fetch(`${apiUrl}/method/control`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${tokens.access}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                response: {
                  indices: [],
                },
              }),
            });

            if (skipRes.status === 200) {
              // ok
            } else {
              console.log(
                `Could not skip archive, response code ${skipRes.status}`
              );
              // do nothing
              break;
            }

            const resInt = await fetch(`${apiUrl}/method/control`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${tokens.access}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                response: {
                  indices: [],
                  number_of_desired_solutions: 0,
                },
              }),
            });

            if (resInt.status === 200) {
              // ok
            } else {
              console.log(
                `Could not skip intermediate solutions, response code ${skipRes.status}`
              );
              // do nothing
              break;
            }
          }

          // else, continue normally
          const res = await fetch(`${apiUrl}/method/control`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${tokens.access}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              response: {
                index: index,
                continue: nimbusState === "classify preferred",
              },
            }),
          });

          if (res.status === 200) {
            // Ok
            const body = await res.json();
            const response = body.response;

            if (nimbusState === "classify preferred") {
              // continue iterating
              SetPreferredPoint([...response.objective_values]); // avoid aliasing
              SetClassificationLevels(response.objective_values);
              SetClassifications(
                response.objective_values.map(() => "=" as Classification)
              );

              SetSelectedIndices([]);
              SetHelpMessage("Please classify each of the shown objectives.");
              SetCurrentState("classification");
              SetNIteration(nIteration + 1);
              // reset the number of solutions
              // SetNumberOfSolutions(1);
              // update new solution table offset
              SetNewSolutionTableOffset(nSolutionsInArchive);
              break;
            } else {
              // stop iterating
              SetPreferredPoint(response.objective);
              SetFinalVariables(response.solution);
              SetHelpMessage("Stopped. Showing final solution reached.");
              SetCurrentState("stop");
              break;
            }
          } else {
            // not ok
            console.log(`Got response code ${res.status}`);
            // do nothing
            break;
          }
        } catch (e) {
          console.log("Could not iterate NIMBUS");
          console.log(e);
          // do nothing
          break;
        }
      }*/
      default: {
        console.log("Default case");
        break;
      }
    }
    SetLoading(false);
  };

  // only allow two selected indices at any given time in the 'intermediate' state, and one index at any given time in the
  //
  useEffect(() => {
    if (currentState === "select preferred") {
      if (selectedIndices.length === 1 || selectedIndices.length === 0) {
        // do nothing
        return;
      }
      SetSelectedIndices([selectedIndices[1]]);
      return;
    }
  }, [selectedIndices]);

  useEffect(() => {
    if (currentState === "not started") {
      // do nothing if not started
      return;
    }
    const improve =
      classifications.includes("<" as Classification) ||
      classifications.includes("<=" as Classification);
    const worsen =
      classifications.includes(">=" as Classification) ||
      classifications.includes("0" as Classification);

    if (!improve) {
      SetHelpMessage(
        "Check classifications: at least one objective should be improved."
      );
      SetClassificationOk(false);
      return;
    } else if (!worsen) {
      SetHelpMessage(
        "Check classifications: at least one objective should be allowed to worsen."
      );
      SetClassificationOk(false);
      return;
    } else {
      SetHelpMessage("Classifications ok!");
      SetClassificationOk(true);
      return;
    }
  }, [classifications]);

  const inferClassifications = (barSelection: number[]) => {
    const isDiff = barSelection.map((v, i) => {
      const res =
        // The preferred point must be in the original scale to be compared with barSelection
        Math.abs(v - preferredPoint[i] * activeProblemInfo!.minimize[i]) < 1e-12
          ? false
          : true;
      return res;
    });
    const levels = classificationLevels;
    const classes = barSelection.map((value, i) => {
      if (!isDiff[i]) {
        // no change, return old classification
        return classifications[i];
      }
      if (activeProblemInfo?.minimize[i] === 1) {
        // minimization
        if (value > preferredPoint[i]) {
          // selected value is greater than currently preferred (worse)
          // Worsen until
          levels[i] = barSelection[i];
          return ">=" as Classification;
        } else if (value < preferredPoint[i]) {
          // selected value is less than currently preferred (better)
          // improve until
          levels[i] = barSelection[i];
          return "<=" as Classification;
        } else {
          // no change, keep as it is
          return classifications[i];
        }
      } else if (activeProblemInfo?.minimize[i] === -1) {
        // maximization
        // levels must be transformed back to original scale, hence the minus signs
        if (value > -1 * preferredPoint[i]) {
          // selected value is greater than currently preferred (better)
          // improve until
          levels[i] = -barSelection[i];
          return "<=" as Classification;
        } else if (value < -1 * preferredPoint[i]) {
          // selected value is less than currently preferred (worse)
          // worsen until
          levels[i] = -barSelection[i];
          return ">=" as Classification;
        } else {
          // no change, keep as it is
          return classifications[i];
        }
      } else {
        // something went wrong, return previous classification
        console.log("Encountered something strange in inferClassifications...");
        return classifications[i];
      }
    });
    SetClassificationLevels(levels);
    SetClassifications(classes);
  };
  if (!methodCreated || activeProblemInfo === undefined) {
    return (
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
        }}
      >
        <Toolbar />
        <Container>Method not started yet</Container>
      </Box>
    );
  }
  return (
    <Box sx={{ display: "flex", width: "-webkit-fill-available" }}>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          sx={{
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
          PaperProps={{ elevation: 9 }}
        >
          <Toolbar />
          <Container sx={{ padding: "2.3rem", paddingTop: "1rem" }}>
            <Typography sx={{ fontWeight: "bold", m: 1 }}>
              Preference information
            </Typography>
          </Container>
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
          <Card variant="outlined" sx={{ marginBottom: "1rem" }}>
            <CardContent>
              <Typography color={"primary"} sx={{ fontWeight: "bold", m: 1 }}>
                Parallel coordinate plot
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography color={"primary"} sx={{ fontWeight: "bold", m: 1 }}>
                Solutions table
              </Typography>
            </CardContent>
          </Card>
          <Container>
            <Row>
              <Col sm={12}>
                <h3>Synchronous NIMBUS</h3>
              </Col>
              <Col sm={2}></Col>
              <Col sm={8}>
                <p>{`Help: ${helpMessage}`}</p>
              </Col>
              <Col sm={4}></Col>
              <Col sm={4}>
                {!loading && currentState === "classification" && (
                  <Button
                    onClick={() => {
                      if (nIteration === 1 || nIteration === 4) {
                        SetShowQAfterIterate(true);
                      } else {
                        iterate("classification");
                      }
                    }}
                    disabled={!classificationOk}
                  >
                    {classificationOk ? "Iterate" : "Invalid classification"}
                  </Button>
                )}
                {loading && <Button>{"Working... "}</Button>}
              </Col>
              <Col sm={4}></Col>
            </Row>
            {currentState === "not started" && (
              <div>Method not started yet</div>
            )}
            {currentState === "classification" && (
              <>
                <Row>
                  <Col sm={12}>
                    <h4 className={"mt-3"}>{"Classification"}</h4>
                  </Col>
                  <Col sm={4}>
                    <Form>
                      <Form.Group as={Row}>
                        <Form.Label column sm="12">
                          Desired number of solutions
                        </Form.Label>
                        <Col sm={12}>
                          <Form.Check
                            inline
                            label="1"
                            type="radio"
                            value={1}
                            checked={numberOfSolutions === 1 ? true : false}
                            onChange={() => SetNumberOfSolutions(1)}
                          />
                          <Form.Check
                            inline
                            label="2"
                            type="radio"
                            value={2}
                            checked={numberOfSolutions === 2 ? true : false}
                            onChange={() => SetNumberOfSolutions(2)}
                          />
                          <Form.Check
                            inline
                            label="3"
                            type="radio"
                            value={3}
                            checked={numberOfSolutions === 3 ? true : false}
                            onChange={() => SetNumberOfSolutions(3)}
                          />
                          <Form.Check
                            inline
                            label="4"
                            type="radio"
                            value={4}
                            checked={numberOfSolutions === 4 ? true : false}
                            onChange={() => SetNumberOfSolutions(4)}
                          />
                        </Col>
                      </Form.Group>
                    </Form>
                    <ClassificationsInputForm
                      setClassifications={SetClassifications}
                      setClassificationLevels={SetClassificationLevels}
                      classifications={classifications}
                      classificationLevels={classificationLevels}
                      currentPoint={preferredPoint}
                      nObjectives={activeProblemInfo.nObjectives}
                      objectiveNames={activeProblemInfo.objectiveNames}
                      ideal={activeProblemInfo.ideal}
                      nadir={activeProblemInfo.nadir}
                      directions={activeProblemInfo.minimize}
                    />
                  </Col>
                  <Col sm={8}>
                    <div className={"mt-5"}>
                      <HorizontalBars
                        objectiveData={ToTrueValues(
                          ParseSolutions([preferredPoint], activeProblemInfo)
                        )}
                        referencePoint={classificationLevels.map((v, i) =>
                          activeProblemInfo.minimize[i] === 1 ? v : -v
                        )}
                        currentPoint={preferredPoint.map((v, i) =>
                          activeProblemInfo.minimize[i] === 1 ? v : -v
                        )}
                        setReferencePoint={inferClassifications} // the reference point is passed in its true form to the callback
                        dimensionsMaybe={{
                          chartHeight: 400,
                          chartWidth: 800,
                          marginLeft: 0,
                          marginRight: 150,
                          marginTop: 0,
                          marginBottom: 30,
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              </>
            )}
            {(currentState === "archive" ||
              currentState === "select preferred") && (
              <>
                <Row>
                  <Col sm={1}></Col>
                  <Col sm={3}>
                    <Button
                      onClick={() => iterate("archive")}
                      disabled={
                        solutionsArchivedAfterClassification ||
                        selectedIndices.length === 0
                      }
                    >
                      {solutionsArchivedAfterClassification
                        ? "Solutions archived!"
                        : "Save selected solutions to archive"}
                    </Button>
                  </Col>
                  <Col sm={4}>
                    <Button
                      //onClick={() => iterate("classify preferred")}
                      disabled={
                        (selectedIndexArchive !== -1 &&
                          selectedIndices.length > 0) ||
                        (selectedIndexArchive === -1 &&
                          selectedIndices.length === 0) ||
                        selectedIndices.length > 1
                      }
                    >
                      {"Classify currently selected solution"}
                    </Button>
                  </Col>
                  <Col sm={3}>
                    <Button
                      //onClick={() => iterate("stop with preferred")}
                      disabled={
                        (selectedIndexArchive !== -1 &&
                          selectedIndices.length > 0) ||
                        (selectedIndexArchive === -1 &&
                          selectedIndices.length === 0) ||
                        selectedIndices.length > 1
                      }
                    >
                      {"Stop with currently selected solution"}
                    </Button>
                  </Col>
                  <Col sm={1}></Col>
                </Row>
                <Row>
                  <Col sm={12}>
                    <h4 className={"mt-3"}>{"New solutions"}</h4>
                  </Col>
                  <Col sm={6}>
                    <SolutionTableMultiSelect
                      objectiveData={newSolutions!}
                      activeIndices={selectedIndices}
                      setIndices={SetSelectedIndices}
                      tableTitle={""}
                    />
                  </Col>
                  <Col sm={6}>
                    <div className={"mt-1"}>
                      <ParallelAxes
                        objectiveData={ToTrueValues(newSolutions!)}
                        selectedIndices={selectedIndices}
                        handleSelection={SetSelectedIndices}
                        dimensionsMaybe={{
                          chartHeight: 600,
                          chartWidth: 850,
                          marginLeft: 0,
                          marginRight: 0,
                          marginTop: 30,
                          marginBottom: 0,
                        }}
                      />
                    </div>
                  </Col>
                </Row>
                {nSolutionsInArchive > 0 && (
                  <Row>
                    <Col sm={12}>
                      <h4 className={"mt-3"}>{"Archived solutions"}</h4>
                    </Col>
                    <Col sm={6}>
                      <SolutionTable
                        objectiveData={archivedSolutions!}
                        selectedIndex={selectedIndexArchive}
                        setIndex={(x: number) => {
                          SetSelectedIndexArchive(x);
                        }}
                        tableTitle={""}
                      />
                    </Col>
                    <Col sm={6}>
                      <div className={"mt-1"}>
                        <ParallelAxes
                          objectiveData={ToTrueValues(archivedSolutions!)}
                          selectedIndices={[selectedIndexArchive]}
                          handleSelection={(x: number[]) => {
                            if (x.length === 1) {
                              SetSelectedIndexArchive(-1);
                            } else {
                              SetSelectedIndexArchive(x.pop()!);
                            }
                          }}
                          dimensionsMaybe={{
                            chartHeight: 600,
                            chartWidth: 850,
                            marginLeft: 0,
                            marginRight: 0,
                            marginTop: 30,
                            marginBottom: 0,
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                )}
              </>
            )}
            {currentState === "stop" && (
              <>
                <SolutionTable
                  objectiveData={ParseSolutions(
                    [preferredPoint],
                    activeProblemInfo
                  )}
                  setIndex={() => console.log("nothing happens...")}
                  selectedIndex={0}
                  tableTitle={"Final objective values"}
                />
                <p>{"Final decision variable values:"}</p>
                <Table hover>
                  <thead>
                    <tr>
                      {finalVariables.map((_, i) => {
                        return <th>{`x${i + 1}`}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {finalVariables.map((v) => {
                        return <td>{`${v.toFixed(4)}`}</td>;
                      })}
                    </tr>
                  </tbody>
                </Table>
                {!afterQEndMethodSuccess && (
                  <Button onClick={() => SetShowQEndMethod(!showQEndMethod)}>
                    Answer questionnaire
                  </Button>
                )}
                {afterQEndMethodSuccess && (
                  <Link to={"/finish"}>
                    <Button>{"Finish"}</Button>
                  </Link>
                )}
              </>
            )}
          </Container>
          <Box
            position="absolute"
            bottom="0px"
            display={"flex"}
            justifyContent={"right"}
            width={"-webkit-fill-available"}
            paddingRight={"50px"}
          >
            <Button variant="contained" sx={{ mt: 3, mb: 2, mr: 2 }}>
              Iterate
            </Button>
            <Button variant="contained" sx={{ mt: 3, mb: 2 }}>
              Stop
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default NimbusMethod;
