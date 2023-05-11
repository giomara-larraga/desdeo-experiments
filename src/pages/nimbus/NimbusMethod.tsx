import React from "react";
import { useEffect, useState, useCallback } from "react";
import {
  ProblemInfo,
  ObjectiveData,
  ObjectiveDatum,
} from "../../types/ProblemTypes";
import { Tokens } from "../../types/AppTypes";
import ClassificationsInputForm from "../../components/ClassificationsInputForm";
import { Row, Col, Form, Table } from "react-bootstrap";
import ReactLoading from "react-loading";
import { ParseSolutions, ToTrueValues } from "../../utils/DataHandling";
//import { ParallelAxes } from "desdeo-components";
import ParallelAxes from "./ParallelAxes";
//import { HorizontalBars } from "desdeo-components";
// import HorizontalBars from "../../components/HorizontalBars";
import SolutionTable from "../../components/SolutionTable";
import SolutionTableMultiSelect from "../../components/SolutionTableMultiSelect";
import { Link } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { CardContent, FormControl, Select } from "@material-ui/core";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import TabPanel from "./TabPanel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Radio from "@mui/material/Radio";
// import RadioGroup from "@mui/material/RadioGroup";
// import FormLabel from "@mui/material/FormLabel/FormLabel";
import { useNavigate } from "react-router-dom";
import HBWindow from "../../components/HBWindow";

const drawerWidth = 550;
interface NimbusMethodProps {
  isLoggedIn: boolean;
  loggedAs: string;
  tokens: Tokens;
  apiUrl: string;
  problemGroup: number;
}
interface ArchiveProps {
  decision_variables: string;
  objective_values: string;
}
type Classification = "<" | "<=" | ">=" | "=" | "0";
type NimbusState =
  | "not started"
  | "classification"
  | "archive"
  | "intermediate"
  | "select preferred"
  | "stop";

function NimbusMethod({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  problemGroup,
}: NimbusMethodProps) {
  const [activeProblemInfo, SetActiveProblemInfo] = useState<ProblemInfo>();
  const [methodStarted, SetMethodStarted] = useState<boolean>(false);
  const [helpMessage, SetHelpMessage] = useState<string>(
    "Method not started yet."
  );
  const [initialSolution, SetInitialSolution] = useState<number[]>([]);
  const [fetchedInitial, SetFetchedInitial] = useState<boolean>(false);
  const [preferredPoint, SetPreferredPoint] = useState<number[]>([]);
  const [fetchedInfo, SetFetchedInfo] = useState<boolean>(false);
  const [loading, SetLoading] = useState<boolean>(false);
  const [nimbusState, SetNimbusState] = useState<NimbusState>("not started");
  const [classifications, SetClassifications] = useState<Classification[]>([]);
  const [classificationLevels, SetClassificationLevels] = useState<number[]>(
    []
  );
  const [classificationOk, SetClassificationOk] = useState<boolean>(false);
  const [numberOfSolutions, SetNumberOfSolutions] = useState<number>(1);
  const [newSolutions, SetNewSolutions] = useState<ObjectiveData>();
  const [selectedIndices, SetSelectedIndices] = useState<number[]>([]);
  const [computeIntermediate, SetComputeIntermediate] =
    useState<boolean>(false);
  const [cont, SetCont] = useState<boolean>(true);
  const [finalVariables, SetFinalVariables] = useState<number[]>([]);
  const navigate = useNavigate();

  const [classificationlevelsOk, SetClassificationlevelsOk] =
    useState<boolean>(false);
  // fetch current problem info
  useEffect(() => {
    /*if (!methodCreated) {
      // method not defined yet, do nothing
      console.log("useEffect: method not defined");
      return;
    }*/
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
          SetClassifications(body.objective_names.map(() => "="));
          SetClassificationLevels(body.objective_names.map(() => 0.0));
          SetClassificationlevelsOk(true);
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
    if (!fetchedInfo) {
      return;
    }
    if (activeProblemInfo === null || activeProblemInfo === undefined) {
      // no active problem, do nothing
      console.log("Active problem not defined yet.");
      return;
    }

    if (methodStarted) {
      // method already started, do nothing
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
          SetNimbusState("classification");
          //console.log(body);
          //console.log(activeProblemInfo);
        }
      } catch (e) {
        console.log("not ok, could not start the method");
        console.log(`${e}`);
      }
    };

    startMethod();
  }, [activeProblemInfo, methodStarted, fetchedInfo]);

  const toQuestionnaire = async () => {
    const log = {
      method: "NIMBUS",
      variables: finalVariables.join(","),
      objectives: preferredPoint.join(","),
    };
    try {
      const res = await fetch(`${apiUrl}/archive`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${tokens.access}`,
        },
        body: JSON.stringify(log),
      });

      if (res.status == 201) {
        // OK
        console.log("OK", log);
      }
    } catch (e) {
      console.log(e);
      // Do nothing
    }
    navigate("/postquestionnaire");
  };
  /*const saveLog = async (data: ArchiveProps) => {
    const log = {
      method: "NIMBUS",
      variables: data.decision_variables,
      objectives: data.objective_values,
    };
    try {
      const res = await fetch(`${apiUrl}/archive`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${tokens.access}`,
        },
        body: JSON.stringify(log),
      });

      if (res.status == 201) {
        // OK
        console.log("OK", log);
      }
    } catch (e) {
      console.log(e);
      // Do nothing
    }
  };*/

  const validateLevels = (clasLevels: number[]) => {
    let isValid = true;

    console.log(clasLevels);
    if (activeProblemInfo !== undefined && nimbusState === "classification") {
      //let isValid = true;
      let trueValues = clasLevels.map((v, i) =>
        activeProblemInfo.minimize[i] === 1 ? v : -v
      );
      for (let index = 0; index < activeProblemInfo?.nObjectives; index++) {
        if (activeProblemInfo?.minimize[index] === 1) {
          if (trueValues[index] < activeProblemInfo?.ideal[index]) {
            isValid = false;
          } else if (trueValues[index] > activeProblemInfo?.nadir[index]) {
            isValid = false;
          }
        } else {
          if (trueValues[index] < -activeProblemInfo?.nadir[index]) {
            isValid = false;
          } else if (trueValues[index] > -activeProblemInfo?.ideal[index]) {
            isValid = false;
          }
        }
      }
    }
    return isValid;
  };

  const iterate = async () => {
    // Attempt to iterate
    SetLoading(true);

    switch (nimbusState) {
      case "classification": {
        if (!classificationOk) {
          // classification not ok, do nothing
          SetHelpMessage(
            "Check the given classifications. Something must be allowed to improve and something must be allowed to worsen."
          );
          break;
        }
        try {
          console.log(`iterating with levels ${classificationLevels}`);
          console.log(activeProblemInfo?.ideal, activeProblemInfo?.nadir);
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
            SetNimbusState("archive");
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
            SetNimbusState("intermediate");
            break;
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
      case "intermediate": {
        if (computeIntermediate && selectedIndices.length !== 2) {
          SetHelpMessage(
            "Please select two on the shown solutions between which you would like to see intermediate solutions."
          );
          // do nothing
          break;
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
                indices: computeIntermediate ? selectedIndices : [],
                number_of_desired_solutions: computeIntermediate
                  ? numberOfSolutions
                  : 0,
              },
            }),
          });

          if (res.status === 200) {
            // ok
            const body = await res.json();
            // const response = JSON.parse(body.response);
            const response = body.response;

            if (computeIntermediate) {
              // update solutions to be shown
              const toBeShown = ParseSolutions(
                response.objectives,
                activeProblemInfo!
              );
              SetNewSolutions(toBeShown);

              // reset and ask to save next
              SetComputeIntermediate(false);
              SetSelectedIndices([]);
              SetNumberOfSolutions(1);
              SetHelpMessage(
                "Would you like to save any of the shown solutions for later viewing?"
              );
              SetNimbusState("archive");
            } else {
              SetComputeIntermediate(false);
              SetSelectedIndices([]);
              SetNumberOfSolutions(1);
              SetHelpMessage(
                "Please select the solution you prefer the most from the shown solution."
              );
              SetNimbusState("select preferred");
            }
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
      case "select preferred": {
        if (selectedIndices.length === 0) {
          SetHelpMessage("Please select a preferred solution first.");
          // do nothing;
          break;
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
              SetNimbusState("classification");
              break;
            } else {
              // stop iterating
              console.log(response);
              SetPreferredPoint(response.objective);
              SetFinalVariables(response.solution);
              SetHelpMessage("Stopped. Showing final solution reached.");
              /*saveLog({
                decision_variables: response.solution.join(","),
                objective_values: preferredPoint.join(","),
              });*/
              SetNimbusState("stop");
              //navigate("/postquestionnaire");

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
      }
      /*case "stop": {
        saveLog({
          decision_variables: finalVariables.join(","),
          objective_values: preferredPoint.join(","),
        });
        //SetNimbusState("stop");
        navigate("/postquestionnaire");
        break;
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
    if (nimbusState === "intermediate") {
      if (selectedIndices.length < 3) {
        // do nothing
        return;
      }
      SetSelectedIndices(selectedIndices.slice(1));
      return;
    } else if (
      nimbusState === "select preferred" ||
      nimbusState === "classification"
    ) {
      if (selectedIndices.length === 1 || selectedIndices.length === 0) {
        // do nothing
        return;
      }
      SetSelectedIndices([selectedIndices[1]]);
      return;
    }
  }, [selectedIndices]);

  useEffect(() => {
    console.log("Classifications changed");
    if (nimbusState === "not started") {
      // do nothing if not started
      console.log("nothing");
      return;
    }
    const improve =
      classifications.includes("<" as Classification) ||
      classifications.includes("<=" as Classification);
    const worsen =
      classifications.includes(">=" as Classification) ||
      classifications.includes("0" as Classification);
    console.log(improve, worsen);
    const validLevels = validateLevels(classificationLevels);
    console.log(validLevels);
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
    } else if (!validLevels) {
      SetHelpMessage("Check levels!");
    } else SetHelpMessage("Classifications ok!");
    SetClassificationOk(true);
    return;
  }, [classifications, classificationLevels, nimbusState]);

  const inferClassifications = (barData: [number, number]) => {
    console.log(barData);
    const value = barData[0];
    const objIndex = barData[1];
    const isDiff =
      Math.abs(
        value - preferredPoint[objIndex] * activeProblemInfo!.minimize[objIndex]
      ) < 1e-12
        ? false
        : true;
    const levels = [...classificationLevels];
    const classes = [...classifications];
    console.log(nimbusState);
    console.log(levels);
    console.log(classes);
    if (!isDiff) {
      // no change, return old classification
    }
    if (activeProblemInfo?.minimize[objIndex] === 1) {
      // minimization
      if (value > preferredPoint[objIndex]) {
        // selected value is greater than currently preferred (worse)
        // Worsen until
        levels[objIndex] = value;
        classes[objIndex] = ">=";
      } else if (value < preferredPoint[objIndex]) {
        // selected value is less than currently preferred (better)
        // improve until
        levels[objIndex] = value;
        classes[objIndex] = "<=";
      } else {
        // no change, keep as it is
      }
    } else if (activeProblemInfo?.minimize[objIndex] === -1) {
      // maximization
      // levels must be transformed back to original scale, hence the minus signs
      if (value > -1 * preferredPoint[objIndex]) {
        // selected value is greater than currently preferred (better)
        // improve until
        levels[objIndex] = -value;
        classes[objIndex] = "<=";
      } else if (value < -1 * preferredPoint[objIndex]) {
        // selected value is less than currently preferred (worse)
        // worsen until
        levels[objIndex] = -value;
        classes[objIndex] = ">=";
      } else {
        // no change, keep as it is
      }
    } else {
      // something went wrong, return previous classification
      console.log("Encountered something strange in inferClassifications...");
      console.log(classifications[objIndex]);
    }
    console.log(levels);
    console.log(classes);

    SetClassificationLevels(levels);
    SetClassifications(classes);
  };

  if (activeProblemInfo === undefined) {
    return <>Please define a method first.</>;
  }

  return (
    <Box sx={{ display: "flex", width: "-webkit-fill-available" }}>
      <Toolbar variant="dense" />
      {nimbusState !== "stop" && (
        <>
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
              <Toolbar variant="dense" />
              {nimbusState === "not started" && (
                <div>Method not started yet</div>
              )}
              {nimbusState === "classification" && (
                <>
                  <Box sx={{ padding: "1rem" }}>
                    <Typography
                      color={"primary"}
                      sx={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        marginBottom: "1rem",
                      }}
                    >
                      Classification {initialSolution[2]}
                    </Typography>
                    <Typography sx={{ marginBottom: "1rem" }}>
                      Select the number of solutions you want to generate and
                      classify the objective functions according to your
                      preferences.
                    </Typography>
                    <Typography>{`Help: ${helpMessage}`}</Typography>
                    <Form style={{ marginBottom: "1.5rem" }}>
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
                    <HBWindow
                      ideal={activeProblemInfo?.ideal}
                      nadir={activeProblemInfo?.nadir}
                      objectiveNames={activeProblemInfo?.objectiveNames}
                      directions={activeProblemInfo?.minimize}
                      setReferencePoint={inferClassifications}
                      referencePoint={classificationLevels.map((v, i) =>
                        activeProblemInfo.minimize[i] === 1 ? v : -v
                      )}
                      currentPoint={preferredPoint.map((v, i) =>
                        activeProblemInfo.minimize[i] === 1 ? v : -v
                      )}
                      setLevelsOK={SetClassificationlevelsOk}
                      levelsOK={classificationlevelsOk}
                      //classifications={classifications}
                    />
                    {!loading && (
                      <Button
                        size={"large"}
                        onClick={iterate}
                        variant={"contained"}
                        disabled={
                          nimbusState === "classification" && !classificationOk
                        }
                      >
                        {nimbusState === "classification" &&
                          classificationOk &&
                          "Iterate"}
                        {nimbusState === "classification" &&
                          !classificationOk &&
                          "Check the classifications"}
                      </Button>
                    )}
                    {loading && (
                      <Button
                        disabled={true}
                        size={"large"}
                        variant={"contained"}
                      >
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
                  </Box>
                </>
              )}
              {nimbusState === "archive" && (
                <Box sx={{ padding: "1rem" }}>
                  <Typography
                    color={"primary"}
                    sx={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                    }}
                  >
                    Archive solutions
                  </Typography>
                  <Typography sx={{ marginBottom: "1rem" }}>
                    Select the solutions you want to save. You can click the
                    desired solutions from the table or from the plot.
                  </Typography>
                  {!loading && (
                    <Button
                      size={"large"}
                      onClick={iterate}
                      variant={"contained"}
                    >
                      {nimbusState === "archive" &&
                        selectedIndices.length > 0 &&
                        "Save"}
                      {nimbusState === "archive" &&
                        selectedIndices.length === 0 &&
                        "Continue"}
                    </Button>
                  )}
                </Box>
              )}
              {nimbusState === "intermediate" && (
                <>
                  <Box sx={{ padding: "1rem" }}>
                    <Typography
                      color={"primary"}
                      sx={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        marginBottom: "1rem",
                      }}
                    >
                      Generate intermediate solutions
                    </Typography>
                    <Typography sx={{ marginBottom: "1rem" }}>
                      You can generate solutions between any two solutions given
                      by the method. The number of intermediate solutions should
                      not be greater than 20.
                    </Typography>
                    <Form>
                      <Form.Group as={Row}>
                        <Form.Label
                          column
                          sm={8}
                          style={{ marginBottom: "1rem" }}
                        >
                          {"Would you like to see intermediate solutions?"}
                        </Form.Label>
                        <Col sm={3}>
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
                        </Col>
                        <Form.Label
                          column
                          sm={8}
                          style={{ marginBottom: "1rem" }}
                        >
                          {"Number of intermediate solutions:"}
                        </Form.Label>
                        <Col sm={3}>
                          <Form.Control
                            type="number"
                            readOnly={!computeIntermediate}
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
                        </Col>
                        <Col sm={1} />
                      </Form.Group>
                    </Form>
                    {!loading && (
                      <Button
                        size={"large"}
                        onClick={iterate}
                        variant={"contained"}
                        disabled={
                          nimbusState === "intermediate" &&
                          computeIntermediate &&
                          selectedIndices.length !== 2
                        }
                      >
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
                      </Button>
                    )}
                    {loading && (
                      <Button
                        disabled={true}
                        size={"large"}
                        variant={"contained"}
                      >
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
                  </Box>
                </>
              )}
              {nimbusState === "select preferred" && (
                <>
                  <Box sx={{ padding: "1rem" }}>
                    <Typography
                      color={"primary"}
                      sx={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        marginBottom: "1rem",
                      }}
                    >
                      Select the most preferred solution
                    </Typography>
                    <Typography sx={{ marginBottom: "1rem" }}>
                      Select the most preferred solution. Then indicate if you
                      want to continue with the process or to stop.
                    </Typography>
                    <Form>
                      <Form.Group as={Row}>
                        <Form.Label column sm={8}>
                          {
                            "Would you like to continue to classification of the selected solution's objectives or to stop?"
                          }
                        </Form.Label>
                        <Col sm={3}>
                          <Form.Check
                            className={"mt-3"}
                            id="stop-switch"
                            type="switch"
                            label={
                              cont ? (
                                <>
                                  {"stop/"}
                                  <b>{"continue"}</b>
                                </>
                              ) : (
                                <>
                                  <b>{"stop"}</b>
                                  {"/continue"}
                                </>
                              )
                            }
                            checked={cont}
                            onChange={() => SetCont(!cont)}
                          ></Form.Check>
                        </Col>
                      </Form.Group>
                    </Form>
                    {!loading && (
                      <Button
                        size={"large"}
                        onClick={iterate}
                        variant={"contained"}
                        disabled={
                          nimbusState === "select preferred" &&
                          selectedIndices.length !== 1
                        }
                      >
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
                          "Select a solution first"}
                      </Button>
                    )}
                  </Box>
                </>
              )}
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
              <>
                {nimbusState === "classification" && (
                  <>
                    <Card variant="outlined" sx={{ marginBottom: "1rem" }}>
                      <CardContent>
                        <Typography
                          color={"primary"}
                          sx={{ fontWeight: "bold", m: 1 }}
                        >
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
                            sx={{
                              backgroundColor: "#eeeeee",
                              textAlign: "center",
                            }}
                          >
                            <CardContent>
                              <Typography sx={{ m: 1 }}>
                                A plot showing a set of solutions will be shown
                                in this section.
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </CardContent>
                    </Card>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography
                          color={"primary"}
                          sx={{ fontWeight: "bold", m: 1 }}
                        >
                          Solutions table
                        </Typography>
                        {newSolutions !== undefined && (
                          <SolutionTableMultiSelect
                            objectiveData={newSolutions!}
                            activeIndices={selectedIndices}
                            setIndices={SetSelectedIndices}
                            tableTitle={""}
                          />
                        )}
                        {newSolutions === undefined && (
                          <Card
                            variant="outlined"
                            sx={{
                              backgroundColor: "#eeeeee",
                              textAlign: "center",
                            }}
                          >
                            <CardContent>
                              <Typography sx={{ m: 1 }}>
                                A table showing a set of solutions will be shown
                                in this section.
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}
                {nimbusState === "archive" && (
                  <>
                    <Card variant="outlined" sx={{ marginBottom: "1rem" }}>
                      <CardContent>
                        <Typography
                          color={"primary"}
                          sx={{ fontWeight: "bold", m: 1 }}
                        >
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
                            sx={{
                              backgroundColor: "#eeeeee",
                              textAlign: "center",
                            }}
                          >
                            <CardContent>
                              <Typography sx={{ m: 1 }}>
                                A plot showing a set of solutions will be shown
                                in this section.
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </CardContent>
                    </Card>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography
                          color={"primary"}
                          sx={{ fontWeight: "bold", m: 1 }}
                        >
                          Solutions table
                        </Typography>
                        {newSolutions !== undefined && (
                          <SolutionTableMultiSelect
                            objectiveData={newSolutions!}
                            activeIndices={selectedIndices}
                            setIndices={SetSelectedIndices}
                            tableTitle={""}
                          />
                        )}
                        {newSolutions === undefined && (
                          <Card
                            variant="outlined"
                            sx={{
                              backgroundColor: "#eeeeee",
                              textAlign: "center",
                            }}
                          >
                            <CardContent>
                              <Typography sx={{ m: 1 }}>
                                A table showing a set of solutions will be shown
                                in this section.
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}
                {nimbusState === "intermediate" && (
                  <>
                    <Card variant="outlined" sx={{ marginBottom: "1rem" }}>
                      <CardContent>
                        <Typography
                          color={"primary"}
                          sx={{ fontWeight: "bold", m: 1 }}
                        >
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
                            sx={{
                              backgroundColor: "#eeeeee",
                              textAlign: "center",
                            }}
                          >
                            <CardContent>
                              <Typography sx={{ m: 1 }}>
                                A plot showing a set of solutions will be shown
                                in this section.
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </CardContent>
                    </Card>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography
                          color={"primary"}
                          sx={{ fontWeight: "bold", m: 1 }}
                        >
                          Solutions table
                        </Typography>
                        {newSolutions !== undefined && (
                          <SolutionTableMultiSelect
                            objectiveData={newSolutions!}
                            activeIndices={selectedIndices}
                            setIndices={SetSelectedIndices}
                            tableTitle={""}
                          />
                        )}
                        {newSolutions === undefined && (
                          <Card
                            variant="outlined"
                            sx={{
                              backgroundColor: "#eeeeee",
                              textAlign: "center",
                            }}
                          >
                            <CardContent>
                              <Typography sx={{ m: 1 }}>
                                A table showing a set of solutions will be shown
                                in this section.
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}
                {nimbusState === "select preferred" && (
                  <>
                    <Card variant="outlined" sx={{ marginBottom: "1rem" }}>
                      <CardContent>
                        <Typography
                          color={"primary"}
                          sx={{ fontWeight: "bold", m: 1 }}
                        >
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
                            sx={{
                              backgroundColor: "#eeeeee",
                              textAlign: "center",
                            }}
                          >
                            <CardContent>
                              <Typography sx={{ m: 1 }}>
                                A plot showing a set of solutions will be shown
                                in this section.
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </CardContent>
                    </Card>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography
                          color={"primary"}
                          sx={{ fontWeight: "bold", m: 1 }}
                        >
                          Solutions table
                        </Typography>
                        {newSolutions !== undefined && (
                          <SolutionTableMultiSelect
                            objectiveData={newSolutions!}
                            activeIndices={selectedIndices}
                            setIndices={SetSelectedIndices}
                            tableTitle={""}
                          />
                        )}
                        {newSolutions === undefined && (
                          <Card
                            variant="outlined"
                            sx={{
                              backgroundColor: "#eeeeee",
                              textAlign: "center",
                            }}
                          >
                            <CardContent>
                              <Typography sx={{ m: 1 }}>
                                A table showing a set of solutions will be shown
                                in this section.
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}
              </>
            </Container>
          </Box>
        </>
      )}
      {nimbusState === "stop" && (
        <Container>
          <Toolbar />
          <Typography
            variant="h5"
            color={"primary"}
            sx={{ marginBottom: "2rem" }}
          >
            Final solution
          </Typography>
          <Typography
            variant="h6"
            color={"primary"}
            sx={{ marginTop: "2rem", marginBottom: "2rem" }}
          >
            Objective values:
          </Typography>
          <SolutionTable
            objectiveData={ParseSolutions([preferredPoint], activeProblemInfo)}
            setIndex={() => console.log("nothing happens...")}
            selectedIndex={0}
            tableTitle={""}
          />
          <Typography
            variant="h6"
            color={"primary"}
            sx={{ marginTop: "2rem", marginBottom: "2rem" }}
          >
            Decision variables:
          </Typography>
          <Table striped bordered hover>
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
          <Button
            variant="contained"
            size="large"
            onClick={toQuestionnaire}
            sx={{ marginTop: "2rem" }}
          >
            {"Continue"}
          </Button>
        </Container>
      )}
    </Box>
  );
}

export default NimbusMethod;
