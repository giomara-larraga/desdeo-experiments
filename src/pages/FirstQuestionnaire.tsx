import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import {
  Col,
  Container,
  Row,
  Button,
  Card,
  Form,
  ButtonGroup,
} from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { Tokens } from "../types/AppTypes";
import { useNavigate } from "react-router-dom";
import defaultSurveyConfig from "../types/survey";
import SurveyComponent from "../components/SurveyComponent";
import { prequestionnaire } from "../utils/questionnaires";
import Toolbar from "@mui/material/Toolbar";
import "../style/custom.scss";
import { CssBaseline, Typography } from "@mui/material";

interface QuestionInit {
  elements: any[];
  showQuestionNumbers: boolean;
  /*id: number;
    question_text: string;
    question_type: "open"| "likert";
    show_solution: number;*/
}
const QuestionInitDefaults: QuestionInit = {
  elements: [],
  showQuestionNumbers: true,
};

interface FirstQuestionnaireProps {
  isLoggedIn: boolean;
  loggedAs: string;
  tokens: Tokens;
  apiUrl: string;
  groupId: number;
  problemGroup: number;
  //setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

interface IAnswer {
  key: string[];
  value: any[];
}

const FirstQuestionnaire = ({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  groupId,
  problemGroup,
}: //setCurrentPage,
FirstQuestionnaireProps) => {
  /*useEffect(() => {
    setCurrentPage("Questionnaire");
  }, []);*/
  const [questions, SetQuestions] =
    useState<QuestionInit>(QuestionInitDefaults);
  //const [fetched, SetFetched] = useState(false);
  //const { register, handleSubmit, control } = useForm<FormData>();
  //const [answers, SetAnswers] = useState<FormData>({ values: [] });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${apiUrl}/questionnaire/init`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        });

        if (res.status == 200) {
          const body = await res.json();
          // set questions
          SetQuestions(body);
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
    const responses: IAnswer = {
      key: Object.keys(data),
      value: Object.values(data),
    };
    console.log("responses", responses);
    //setAnswers(responses);

    // save responses to database
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
        // OK
        console.log("saved");
        //navigate(`/prequestionnaire`);
      }
    } catch (e) {
      console.log(e);
      // Do nothing
    }
    let methodName;
    let route: string;

    if (groupId === 1) {
      methodName = "synchronous_nimbus";
      route = "/nimbus";
    } else {
      methodName = "nautilus_navigator";
      route = "/nautilus";
    }

    try {
      const methodCreation = { problemGroup: problemGroup, method: methodName };
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
        // created!
      } else {
        console.log(`Got return code ${res.status}. Could not create method.`);
        // do nothing
      }
    } catch (e) {
      console.log(e);
      // Do nothing
    }
    navigate(route);
  }, []);

  return (
    <Container className="py-4 main-container">
      <CssBaseline />
      <Toolbar />
      <Typography
        variant="h4"
        color="primary"
        style={{ marginBottom: "2rem", textAlign: "left" }}
      >
        Pre-Solution Process
      </Typography>
      <Row>
        <p>
          Before start using the method, we need you to answer the following
          information.
        </p>
      </Row>
      <Row className="mb-3">
        <SurveyComponent
          data={defaultSurveyConfig.defaultSurveyData}
          json={questions}
          onComplete={onSurveyComplete}
        />
      </Row>
    </Container>
  );
};
export default FirstQuestionnaire;
