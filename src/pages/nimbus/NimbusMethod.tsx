import { useCallback, useEffect, useState } from "react";
import { ProblemInfo, ObjectiveData } from "../../types/ProblemTypes";
import { Tokens } from "../../types/AppTypes";
import ClassificationsInputForm from "../../components/ClassificationsInputForm";
import { Row, Col, Form, Table } from "react-bootstrap";
import ReactLoading from "react-loading";
import { ParseSolutions, ToTrueValues } from "../../utils/DataHandling";
import { HorizontalBars } from "desdeo-components";
import ParallelAxes from "./ParallelAxes";
import SolutionTable from "../../components/SolutionTable";
import SolutionTableNimbus from "../../components/SolutionTableNimbus";
import { SolutionTableMultiSelect } from "../../components/SolutionTableMultiSelect";
import { Link, useNavigate } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import HBWindow from "../../components/HBWindow";

import { CardContent, FormControl, Select } from "@material-ui/core";
import defaultSurveyConfig from "../../types/survey";
import SurveyComponent from "../../components/SurveyComponent";
import SolutionTableShow from "../../components/SolutionTableShow";
interface NimbusMethodProps {
  isLoggedIn: boolean;
  loggedAs: string;
  tokens: Tokens;
  apiUrl: string;
  problemGroup: number;
  groupId: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

interface QuestionPhase2 {
  elements: any[];
  showQuestionNumbers: boolean;
  /*id: number;
    question_text: string;
    question_type: "open"| "likert";
    show_solution: number;*/
}

interface IAnswer {
  key: string[];
  value: any[];
}

const QuestionPhase2Defaults: QuestionPhase2 = {
  elements: [],
  showQuestionNumbers: true,
};

type Classification = "<" | "<=" | ">=" | "=" | "0";
type NimbusState =
  | "not started"
  | "classification"
  | "archive"
  | "classify preferred"
  | "stop with preferred"
  | "select preferred"
  | "stop";

function NimbusMethod({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  problemGroup,
  groupId,
  setCurrentPage,
}: NimbusMethodProps) {
  const [activeProblemInfo, SetActiveProblemInfo] = useState<ProblemInfo>();
  const [methodStarted, SetMethodStarted] = useState<boolean>(false);
  const [helpMessage, SetHelpMessage] = useState<string>(
    "Method not started yet."
  );
  const [preferredPoint, SetPreferredPoint] = useState<number[]>([]);
  const [fetchedInfo, SetFetchedInfo] = useState<boolean>(false);
  const [loading, SetLoading] = useState<boolean>(false);
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
  const [questions, SetQuestions] = useState<QuestionPhase2>(
    QuestionPhase2Defaults
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (groupId === 1) {
      setCurrentPage("Solution Process");
    } else {
      setCurrentPage("Solution Process - Phase 2");
    }
  }, []);
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

        if (res.status === 200) {
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
          //SetClassificationlevelsOk(true);
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

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${apiUrl}/questionnaire/phase2`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        });

        if (res.status == 200) {
          const body = await res.json();
          // set questions
          SetQuestions(body);
          console.log(body);
          //SetFetched(true);
          console.log("Questions fetched successfully!");
        } else {
          console.log(
            `Got return code ${res.status}. Could not fetch resource.`
          );
          // do nothing
        }
      } catch (e) {
        console.log("not ok");
        console.log(e);
        // do nothing
      }
    };

    fetchQuestions();
  }, []);

  const onSurveyComplete = useCallback(async (sender: any) => {
    console.log("Sender Data: ", JSON.stringify(sender.data));
    console.log("Sender PlainData: ", sender.getPlainData());
    //setTest("changed into oncomplete");
    //console.log("test", test);
    const data = JSON.parse(JSON.stringify(sender.data));

    var keys = Object.keys(data);
    var validated_keys = [];
    var validated_values = [];
    for (let i = 0; i < keys.length; i++) {
      const item = parseInt(keys[i]);
      const value = data[keys[i]];

      if (isNaN(item)) {
        console.log(value);
        var inner_keys = Object.keys(value);
        var inner_values = Object.values(value);
        for (let j = 0; j < inner_keys.length; j++) {
          validated_keys.push(inner_keys[j]);
          validated_values.push(inner_values[j]);
        }
      } else {
        validated_keys.push(keys[i]);
        validated_values.push(value);
      }
    }
    const responses: IAnswer = {
      key: validated_keys,
      value: validated_values,
    };
    console.log("responses", responses);

    const newAnswers = {
      key: responses.key.map((k) => parseInt(k)),
      value: responses.value,
    };
    console.log("newAnswers:", newAnswers);
    try {
      const res = await fetch(`${apiUrl}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access}`,
        },
        body: JSON.stringify(newAnswers),
      });

      console.log(res);

      if (res.status === 200) {
        console.log("saved");
      }
    } catch (e) {
      console.log(e);
    }
    //let methodName;
    let route: string;

    //methodName = "synchronous_nimbus";
    route = "/postquestionnaire";

    //await createMethod(apiUrl, tokens, problemGroup, methodName);

    navigate(route);
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
          SetCurrentState("classification");
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
            /*await LogInfoToDB(
              tokens,
              apiUrl,
              "Preference",
              `{"Current solution": ${JSON.stringify(
                preferredPoint
              )}, "Iteration": ${nIteration}, "Classification": ${JSON.stringify(
                classifications
              )}, "Levels": ${JSON.stringify(
                classificationLevels
              )}, "Number of new solutions": ${JSON.stringify(
                numberOfSolutions
              )}}`,
              "User provided classifications in NIMBUS."
            );*/
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

            /*await LogInfoToDB(
              tokens,
              apiUrl,
              "Info",
              `{"Solutions chosen": ${JSON.stringify(
                chosenNew
              )}, "Iteration": ${nIteration},}`,
              "Solutions chosen by the user to be saved to the archive in NIMBUS."
            );*/

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
      case "classify preferred":
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
              /*await LogInfoToDB(
                tokens,
                apiUrl,
                "Preference",
                `{"Preferred solution": ${JSON.stringify(
                  response.objective_values
                )}, "Iteration": ${nIteration},}`,
                "User chose a new preferred solution in NIMBUS."
              );*/

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
              /*await LogInfoToDB(
                tokens,
                apiUrl,
                "Final solution",
                `{"Objective values": ${JSON.stringify(
                  response.objective
                )}, "Variable values": ${JSON.stringify(response.solution)},}`,
                "User reached the final solution in NIMBUS."
              );*/
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
      }
      default: {
        console.log("Default case");
        break;
      }
    }
    SetLoading(false);
  };

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

  /*const inferClassifications = (barSelection: number[]) => {
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
  };*/
  const inferClassifications = (barData: [number, number]) => {
    // console.log(barData);
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
    console.log(currentState);
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
        levels[objIndex] = Math.min(value, activeProblemInfo?.nadir[objIndex]);
        classes[objIndex] = ">=";
      } else if (value < preferredPoint[objIndex]) {
        // selected value is less than currently preferred (better)
        // improve until
        levels[objIndex] = Math.max(value, activeProblemInfo?.ideal[objIndex]);
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
        // console.log(-value, activeProblemInfo?.ideal[objIndex]);
        levels[objIndex] = Math.max(-value, activeProblemInfo?.ideal[objIndex]);
        classes[objIndex] = "<=";
      } else if (value < -1 * preferredPoint[objIndex]) {
        // selected value is less than currently preferred (worse)
        // worsen until
        levels[objIndex] = Math.min(-value, activeProblemInfo?.nadir[objIndex]);
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
  if (activeProblemInfo === undefined) {
    return <>Please define a method first.</>;
  }
  const drawerWidth = 600;
  return (
    <Box sx={{ display: "flex", width: "-webkit-fill-available" }}>
      <Toolbar />
      {currentState !== "stop" && (
        <>
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
              }}
              variant="permanent"
              anchor="left"
              PaperProps={{ elevation: 9 }}
            >
              <Toolbar />
              {currentState === "not started" && (
                <div>Method not started yet</div>
              )}
              {currentState === "classification" && (
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
                      Classification
                    </Typography>
                    <Typography>{`Help: ${helpMessage}`}</Typography>
                    <Form style={{ marginBottom: "1.5rem" }}>
                      <Form.Group as={Row}>
                        <Form.Label column sm="12">
                          Select the maximum number of solutions you would like
                          to see
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
                      //setLevelsOK={SetClassificationlevelsOk}
                      //levelsOK={classificationlevelsOk}

                      //classifications={classifications}
                    />
                    {!loading && (
                      <Button
                        size={"large"}
                        onClick={() => {
                          iterate("classification");
                        }}
                        variant={"contained"}
                        disabled={!classificationOk}
                        color={classificationOk ? "primary" : "error"}
                      >
                        Iterate
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
              {currentState === "archive" && (
                <Box sx={{ padding: "1rem" }}>
                  <Typography
                    color={"primary"}
                    sx={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                    }}
                  >
                    Save solutions for further use
                  </Typography>
                  <Typography sx={{ marginBottom: "1rem" }}>
                    Select one or multiple solutions to save. At least one
                    solution needs to be saved. You can return to the saved
                    solutions later and use them as starting point in later
                    iterations.
                  </Typography>

                  <Button
                    size="large"
                    variant="contained"
                    onClick={() => iterate("archive")}
                    disabled={
                      solutionsArchivedAfterClassification ||
                      selectedIndices.length === 0
                    }
                  >
                    Save
                  </Button>
                </Box>
              )}
              {currentState === "select preferred" && (
                <Box sx={{ padding: "1rem" }}>
                  <Typography
                    color={"primary"}
                    sx={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                    }}
                  >
                    Select preferred solution
                  </Typography>
                  <Typography sx={{ marginBottom: "1rem" }}>
                    The solutions in the archive are shown on the right. Select
                    a preferred solution and go to the classification step or
                    stop the solution process.
                  </Typography>

                  <Button
                    size="large"
                    variant="contained"
                    sx={{ marginBottom: "1rem" }}
                    onClick={() => iterate("classify preferred")}
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

                  <Button
                    size="large"
                    variant="contained"
                    onClick={() => iterate("stop with preferred")}
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
                </Box>
              )}
            </Drawer>
          </Box>
        </>
      )}
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
          {currentState === "classification" && (
            <>
              <Card variant="outlined" sx={{ marginBottom: "1rem" }}>
                <CardContent>
                  <Typography
                    color={"primary"}
                    sx={{ fontWeight: "bold", m: 1 }}
                  >
                    Parallel coordinate plot
                  </Typography>

                  <ParallelAxes
                    objectiveData={{
                      values: [
                        {
                          selected: false,
                          value: preferredPoint.map((v, i) =>
                            activeProblemInfo.minimize[i] === 1 ? v : -v
                          ),
                        },
                      ],
                      names: activeProblemInfo?.objectiveNames,
                      directions: activeProblemInfo?.minimize,
                      ideal: activeProblemInfo?.ideal.map((v, i) =>
                        activeProblemInfo.minimize[i] === 1 ? v : -v
                      ),
                      nadir: activeProblemInfo?.nadir.map((v, i) =>
                        activeProblemInfo.minimize[i] === 1 ? v : -v
                      ),
                    }}
                    selectedIndices={selectedIndices}
                    handleSelection={(x) => {
                      console.log(x);
                    }}
                  />

                  {/* {newSolutions !== undefined && (
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
                    />
                  )} */}
                  {/* {newSolutions === undefined && nSolutionsInArchive > 0 && (
                    <ParallelAxes
                      objectiveData={{
                        values: [
                          {
                            selected: false,
                            value: preferredPoint.map((v, i) =>
                              activeProblemInfo.minimize[i] === 1 ? v : -v
                            ),
                          },
                        ],
                        names: activeProblemInfo?.objectiveNames,
                        directions: activeProblemInfo?.minimize,
                        ideal: activeProblemInfo?.ideal.map((v, i) =>
                          activeProblemInfo.minimize[i] === 1 ? v : -v
                        ),
                        nadir: activeProblemInfo?.nadir.map((v, i) =>
                          activeProblemInfo.minimize[i] === 1 ? v : -v
                        ),
                      }}
                      selectedIndices={selectedIndices}
                      handleSelection={(x) => {
                        console.log(x);
                      }}
                    />
                  )} */}
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ marginBottom: "1rem" }}>
                <CardContent>
                  <Typography
                    color={"primary"}
                    sx={{ fontWeight: "bold", m: 1 }}
                  >
                    Solutions table
                  </Typography>
                  <SolutionTableNimbus
                    objectiveData={{
                      values: [
                        {
                          selected: false,
                          value: preferredPoint,
                        },
                      ],
                      names: activeProblemInfo?.objectiveNames,
                      directions: activeProblemInfo?.minimize,
                      ideal: activeProblemInfo?.ideal,
                      nadir: activeProblemInfo?.nadir,
                    }}
                    selectedIndex={-1}
                    setIndex={(x: number) => {
                      SetSelectedIndexArchive(x);
                    }}
                    tableTitle={""}
                  />
                  {/*                   {nSolutionsInArchive > 0 && (
                    <SolutionTableNimbus
                      objectiveData={archivedSolutions!}
                      selectedIndex={selectedIndexArchive}
                      setIndex={(x: number) => {
                        SetSelectedIndexArchive(x);
                      }}
                      tableTitle={""}
                    />
                  )}
                  {newSolutions === undefined && ( */}
                  {/*                   <SolutionTableMultiSelect
                    objectiveData={{
                      values: [
                        {
                          selected: false,
                          value: preferredPoint,
                        },
                      ],
                      names: activeProblemInfo?.objectiveNames,
                      directions: activeProblemInfo?.minimize,
                      ideal: activeProblemInfo?.ideal.map((v, i) =>
                        activeProblemInfo.minimize[i] === 1 ? v : -v
                      ),
                      nadir: activeProblemInfo?.nadir.map((v, i) =>
                        activeProblemInfo.minimize[i] === 1 ? v : -v
                      ),
                    }}
                    activeIndices={selectedIndices}
                    setIndices={(x) => {
                      console.log(x);
                    }}
                    tableTitle={""}
                  /> */}
                  {/* )} */}
                </CardContent>
              </Card>
            </>
          )}
          {currentState === "archive" && (
            <>
              <Card variant="outlined" sx={{ marginBottom: "1rem" }}>
                <CardContent>
                  <Typography
                    color={"primary"}
                    sx={{ fontWeight: "bold", m: 1 }}
                  >
                    Parallel coordinate plot
                  </Typography>
                  <ParallelAxes
                    objectiveData={ToTrueValues(newSolutions!)}
                    selectedIndices={selectedIndices}
                    handleSelection={SetSelectedIndices}
                  />
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ marginBottom: "1rem" }}>
                <CardContent>
                  <Typography
                    color={"primary"}
                    sx={{ fontWeight: "bold", m: 1 }}
                  >
                    Solutions table
                  </Typography>
                  <SolutionTableMultiSelect
                    objectiveData={newSolutions!}
                    activeIndices={selectedIndices}
                    setIndices={SetSelectedIndices}
                    tableTitle={""}
                  />
                </CardContent>
              </Card>
            </>
          )}
          {currentState === "select preferred" && (
            <>
              {nSolutionsInArchive > 0 && (
                <>
                  <Card variant="outlined" sx={{ marginBottom: "1rem" }}>
                    <CardContent>
                      <Typography
                        color={"primary"}
                        sx={{ fontWeight: "bold", m: 1 }}
                      >
                        Parallel coordinate plot
                      </Typography>
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
                      />
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
                      <SolutionTableNimbus
                        objectiveData={archivedSolutions!}
                        selectedIndex={selectedIndexArchive}
                        setIndex={(x: number) => {
                          SetSelectedIndexArchive(x);
                        }}
                        tableTitle={""}
                      />
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}
          {currentState === "stop" && (
            <Container>
              <Typography
                variant="h5"
                color={"primary"}
                sx={{ marginBottom: "2rem" }}
              >
                Final solution of phase 2
              </Typography>
              {/*               <Typography
                variant="h6"
                color={"primary"}
                sx={{ marginTop: "2rem", marginBottom: "2rem" }}
              >
                Objective values:
              </Typography> */}
              <SolutionTableShow
                objectiveData={ParseSolutions(
                  [preferredPoint],
                  activeProblemInfo
                )}
                setIndex={() => console.log("nothing happens...")}
                selectedIndex={0}
                tableTitle={""}
              />
              {/* <Typography
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
              </Table> */}
              <SurveyComponent
                data={defaultSurveyConfig.defaultSurveyData}
                json={questions}
                onComplete={onSurveyComplete}
              />
              {/*               <Button
                variant="contained"
                size="large"
                onClick={toQuestionnaire}
                sx={{ marginTop: "2rem" }}
              >
                {"Continue"}
              </Button> */}
            </Container>
          )}
        </Container>
      </Box>
      <></>
    </Box>
  );
}

export default NimbusMethod;
