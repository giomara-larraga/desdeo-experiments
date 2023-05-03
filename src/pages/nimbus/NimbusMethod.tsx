import React from "react";
import { useEffect, useState, useCallback } from "react";
import {
  ProblemInfo,
  ObjectiveData,
  ObjectiveDatum,
} from "../../types/ProblemTypes";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Tokens } from "../../types/AppTypes";
import ClassificationsInputForm from "./ClassificationsInputForm";
import { Row, Col, Form, Table } from "react-bootstrap";
import ReactLoading from "react-loading";
import { ParseSolutions, ToTrueValues } from "../../utils/DataHandling";
import ParallelAxes from "./ParallelAxes";
import SolutionTable from "./SolutionTable";
import { Link } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import { createMethod, a11yProps } from "./nimbusHelpers";
import { Classification, NimbusMethodProps, NimbusState } from "./nimbusTypes";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { CardContent } from "@material-ui/core";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "./TabPanel";
const drawerWidth = 550;
function NimbusMethod({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  problemGroup,
}: NimbusMethodProps) {
  const [activeProblemInfo, SetActiveProblemInfo] = useState<ProblemInfo>();
  const [methodCreated, SetMethodCreated] = useState<boolean>(false);
  const [methodStarted, SetMethodStarted] = useState<boolean>(false);
  const [helpMessage, SetHelpMessage] = useState<string>(
    "Method not started yet."
  );
  const [preferredPoint, SetPreferredPoint] = useState<number[]>([]);
  const [fetchedInfo, SetFetchedInfo] = useState<boolean>(false);
  const [loading, SetLoading] = useState<boolean>(false);
  //const [nimbusState, SetNimbusState] = useState<NimbusState>("not started");
  const [classifications, SetClassifications] = useState<Classification[]>([]);
  const [classificationLevels, SetClassificationLevels] = useState<number[]>(
    []
  );
  const [classificationOk, SetClassificationOk] = useState<boolean>(false);
  const [numberOfSolutions, SetNumberOfSolutions] = useState<number>(1);
  const [newSolutions, SetNewSolutions] = useState<ObjectiveData>();
  const [selectedIndices, SetSelectedIndices] = useState<number[]>([]);
  /*const [computeIntermediate, SetComputeIntermediate] =
    useState<boolean>(false);*/
  const [cont, SetCont] = useState<boolean>(true);
  const [finalVariables, SetFinalVariables] = useState<number[]>([]);

  const [valueTab, setValueTab] = React.useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  };

  // fetch current problem info
  useEffect(() => {
    /*if (!methodCreated) {
      // method not defined yet, do nothing
      console.log("useEffect: method not defined");
      return;
    }*/
    if (activeProblemInfo === null) {
      // no active problem, do nothing
      console.log("useEffect: active problem is null");
      return;
    }

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
          SetClassifications(body.objective_names.map(() => "="));
          SetClassificationLevels(body.objective_names.map(() => 0.0));
          SetFetchedInfo(true);
        } else {
          //some other code
          console.log(`could not fetch problem, got status code ${res.status}`);
        }
      } catch (e) {
        console.log("not ok");
        console.log(e);
        // do nothing
      }
    };

    fetchProblemInfo();
  }, []);

  // start the method
  useEffect(() => {
    if (activeProblemInfo === undefined) {
      // no active problem, do nothing
      console.log("Active problem not defined yet.");
      return;
    }

    if (methodStarted) {
      // method already started, do nothing
      console.log("Method started.");
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
          SetMethodStarted(true);
          SetPreferredPoint([...body.response.objective_values]); // make copy to avoid aliasing
          SetClassificationLevels(body.response.objective_values);
          SetHelpMessage("Please classify each of the shown objectives.");
          //SetNimbusState("classification");
        }
      } catch (e) {
        console.log("not ok, could not start the method");
        console.log(`${e}`);
      }
    };

    startMethod();
  }, [activeProblemInfo]);

  const intermediate = async () => {
    //SetLoading(true);
    if (selectedIndices.length !== 2) {
      SetHelpMessage(
        "Please select two on the shown solutions between which you would like to see intermediate solutions."
      );
      // do nothing
      return;
    }
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
            number_of_desired_solutions: numberOfSolutions,
          },
        }),
      });

      if (res.status === 200) {
        // ok
        const body = await res.json();
        // const response = JSON.parse(body.response);
        const response = body.response;

        //if (computeIntermediate) {
        // update solutions to be shown
        const toBeShown = ParseSolutions(
          response.objectives,
          activeProblemInfo!
        );
        SetNewSolutions(toBeShown);

        // reset and ask to save next
        //SetComputeIntermediate(false);
        SetSelectedIndices([]);
        SetNumberOfSolutions(1);
        SetHelpMessage(
          "Would you like to save any of the shown solutions for later viewing?"
        );
        //SetNimbusState("archive");
        /*} else {
          SetComputeIntermediate(false);
          SetSelectedIndices([]);
          SetNumberOfSolutions(1);
          SetHelpMessage(
            "Please select the solution you prefer the most from the shown solution."
          );
          SetNimbusState("select preferred");
        }*/
        return;
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
      return;
    }
  };

  const classification = async () => {
    if (!classificationOk) {
      // classification not ok, do nothing
      SetHelpMessage(
        "Check the given classifications. Something must be allowed to improve and something must be allowed to worsen."
      );
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
          "Select the solutions you would like to be saved for later viewing."
        );
        //SetNimbusState("archive");
      } else {
        // not ok
        console.log(`Got response code ${res.status}`);
        // do nothing
      }
    } catch (e) {
      console.log("Could not iterate NIMBUS");
      console.log(e);
      // do nothing
    }
    return;
  };

  const archive = async () => {
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

        // update the solutions to be shown
        const toBeShown = ParseSolutions(
          response.objectives,
          activeProblemInfo!
        );
        SetNewSolutions(toBeShown);

        // reset the active selection
        SetSelectedIndices([]);

        // reset the number of solutions
        SetNumberOfSolutions(1);

        SetHelpMessage(
          "Would you like to compute intermediate solutions between two previously computed solutions?"
        );
        //SetNimbusState("intermediate");
        return;
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
      return;
    }
  };

  const select_preferred = async () => {
    if (selectedIndices.length === 0) {
      SetHelpMessage("Please select a preferred solution first.");
      // do nothing;
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/method/control`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response: {
            index: selectedIndices[0],
            continue: cont,
          },
        }),
      });

      if (res.status === 200) {
        // Ok
        const body = await res.json();
        const response = body.response;

        if (cont) {
          // continue iterating
          SetPreferredPoint([...response.objective_values]); // avoid aliasing
          SetClassificationLevels(response.objective_values);
          SetClassifications(
            response.objective_values.map(() => "=" as Classification)
          );

          SetSelectedIndices([]);
          SetHelpMessage("Please classify each of the shown objectives.");
          //SetNimbusState("classification");
        } else {
          // stop iterating
          console.log(response);
          SetPreferredPoint(response.objective);
          SetFinalVariables(response.solution);
          SetHelpMessage("Stopped. Showing final solution reached.");
          //SetNimbusState("stop");
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
      return;
    }
  };

  // only allow two selected indices at any given time in the 'intermediate' state, and one index at any given time in the
  //
  /*useEffect(() => {
    if (nimbusState === "intermediate") {
      if (selectedIndices.length < 3) {
        // do nothing
        return;
      }
      SetSelectedIndices(selectedIndices.slice(1));
      return;
    } else if (nimbusState === "select preferred") {
      if (selectedIndices.length === 1 || selectedIndices.length === 0) {
        // do nothing
        return;
      }
      SetSelectedIndices([selectedIndices[1]]);
      return;
    }
  }, [selectedIndices]);*/

  useEffect(() => {
    /*if (nimbusState === "not started") {
      // do nothing if not started
      return;
    }*/
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

  if (
    //!methodCreated ||
    //activeProblemId === null ||
    activeProblemInfo === undefined
  ) {
    return <>Please define a method first.</>;
  }

  return (
    <Box sx={{ display: "flex", width: "-webkit-fill-available" }}>
      <Toolbar />
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
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={valueTab}
              onChange={handleChangeTab}
              aria-label="basic tabs example"
            >
              <Tab label="Classification" {...a11yProps(0)} />
              <Tab label="Generate Alternatives" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={valueTab} index={0}>
            <Row>
              <Col sm={12}>
                <Form>
                  <Form.Group as={Row}>
                    <Form.Label column sm="12">
                      Desired number of solutions
                    </Form.Label>
                    <Col sm={12} style={{ marginBottom: "1rem" }}>
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
              <Box
                position="absolute"
                bottom="0px"
                display={"flex"}
                justifyContent={"right"}
                width={"-webkit-fill-available"}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{ mt: 3, mb: 2, mr: 2 }}
                  onClick={classification}
                  disabled={
                    !classificationOk ||
                    (newSolutions !== undefined && selectedIndices.length !== 1)
                  }
                >
                  Iterate
                  {/* {nimbusState === "classification" &&
                    !classificationOk &&
                    "Check the classifications"}
                  {nimbusState === "archive" &&
                    selectedIndices.length > 0 &&
                    "Save"}
                  {nimbusState === "archive" &&
                    selectedIndices.length === 0 &&
                    "Continue"}
                  {nimbusState === "intermediate" &&
                    computeIntermediate &&
                    selectedIndices.length === 2 &&
                    "Compute"}
                  {nimbusState === "intermediate" &&
                    computeIntermediate &&
                    selectedIndices.length !== 2 &&
                    "Select two solutions first"}
                  {nimbusState === "intermediate" &&
                    !computeIntermediate &&
                    "Continue"}
                  {nimbusState === "select preferred" &&
                    cont &&
                    selectedIndices.length === 1 &&
                    "Continue"}
                  {nimbusState === "select preferred" &&
                    cont &&
                    selectedIndices.length !== 1 &&
                    "Select a solution first"}
                  {nimbusState === "select preferred" &&
                    !cont &&
                    selectedIndices.length === 1 &&
                    "Stop"}
                  {nimbusState === "select preferred" &&
                    !cont &&
                    selectedIndices.length !== 1 &&
                    "Select a solution first"} */}
                </Button>
                <Button
                  size="large"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={select_preferred}
                  disabled={selectedIndices.length !== 1}
                >
                  Stop
                </Button>
              </Box>
            </Row>
          </TabPanel>
          <TabPanel value={valueTab} index={1}>
            <Typography></Typography>
            <Form>
              <Form.Group as={Row}>
                {/*                 <Form.Label column sm={8}>
                  {"Would you like to see intermediate solutions?"}
                </Form.Label> */}
                {/*                 <Col sm={3}>
                  <Form.Check
                    id="intermediate-switch"
                    type="switch"
                    label={
                      computeIntermediate ? (
                        <>
                          {"no/"}
                          <b>{"yes"}</b>
                        </>
                      ) : (
                        <>
                          <b>{"no"}</b>
                          {"/yes"}
                        </>
                      )
                    }
                    checked={computeIntermediate}
                    onChange={() =>
                      SetComputeIntermediate(!computeIntermediate)
                    }
                  ></Form.Check>
                </Col> */}
                <Typography sx={{ marginBottom: "1rem" }}>
                  Generate intermediate solutions between two selected
                  alternatives
                </Typography>
                <Form.Label column sm={8}>
                  {"Number of intermediate solutions:"}
                </Form.Label>
                <Col sm={3}>
                  <Form.Control
                    type="number"
                    defaultValue={1}
                    onChange={(v) => {
                      const input = v.target.value;
                      const parsed = parseInt(input);
                      if (!Number.isNaN(parsed)) {
                        if (parsed > 0 && parsed <= 20) {
                          SetNumberOfSolutions(parsed);
                          SetHelpMessage(
                            `Number of intermediate solutions to be computed in the next iteration set to ${parsed}`
                          );
                        } else {
                          SetHelpMessage(
                            "The number of solutions should be more than 0, but less than 20."
                          );
                        }
                      }
                    }}
                  ></Form.Control>
                  <Button
                    variant="contained"
                    sx={{ mt: 3, mb: 2, mr: 2 }}
                    onClick={intermediate}
                    disabled={selectedIndices.length !== 2}
                  >
                    Generate
                  </Button>
                </Col>
                <Col sm={1} />
              </Form.Group>
            </Form>
          </TabPanel>
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
              {newSolutions !== undefined && (
                <ParallelAxes
                  objectiveData={ToTrueValues(newSolutions!)}
                  selectedIndices={selectedIndices}
                  handleSelection={SetSelectedIndices}
                />
              )}
              {newSolutions === undefined && (
                <Card
                  variant="outlined"
                  sx={{ backgroundColor: "#eeeeee", textAlign: "center" }}
                >
                  <CardContent>
                    <Typography sx={{ m: 1 }}>
                      A plot showing a set of solutions will be shown in this
                      section.
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography color={"primary"} sx={{ fontWeight: "bold", m: 1 }}>
                Solutions table
              </Typography>
              {newSolutions !== undefined && (
                <SolutionTable
                  objectiveData={newSolutions!}
                  activeIndices={selectedIndices}
                  setIndices={SetSelectedIndices}
                  tableTitle={""}
                />
              )}
              {newSolutions === undefined && (
                <Card
                  variant="outlined"
                  sx={{ backgroundColor: "#eeeeee", textAlign: "center" }}
                >
                  <CardContent>
                    <Typography sx={{ m: 1 }}>
                      A table showing a set of solutions will be shown in this
                      section.
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}

export default NimbusMethod;
