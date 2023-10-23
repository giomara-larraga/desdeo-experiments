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
import { postquestionnaire } from "../utils/questionnaires";
import "../style/custom.scss";
import Toolbar from "@mui/material/Toolbar";
import { CssBaseline, Typography } from "@mui/material";
interface QuestionEnd {
  pages: any[];
  /*id: number;
    question_text: string;
    question_type: "open"| "likert";
    show_solution: number;*/
}

const QuestionEndDefaults: QuestionEnd = {
  pages: [],
};

interface LastQuestionnaireProps {
  isLoggedIn: boolean;
  loggedAs: string;
  tokens: Tokens;
  apiUrl: string;
  groupId: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

interface IAnswer {
  key: string[];
  value: any[];
}

const LastQuestionnaire = ({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  groupId,
  setCurrentPage,
}: //setCurrentPage,
LastQuestionnaireProps) => {
  const [questions, SetQuestions] = useState<QuestionEnd>(QuestionEndDefaults);
  //const [fetched, SetFetched] = useState(false);
  //const { register, handleSubmit, control } = useForm<FormData>();
  //const [answers, SetAnswers] = useState<FormData>({ values: [] });
  const navigate = useNavigate();
  useEffect(() => {
    setCurrentPage("Questionnaire");
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

        if (res.status === 200) {
          const body = await res.json();
          // set questions
          SetQuestions(body);
          //SetFetched(true);
          console.log(body);
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

    const data = JSON.parse(JSON.stringify(sender.data));

    var keys = Object.keys(data);
    var validated_keys = [];
    var validated_values = [];

    for (let i = 0; i < keys.length; i++) {
      const item = parseInt(keys[i]);
      const value = data[keys[i]];

      if (isNaN(item)) {
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
    console.log("validated keys", validated_keys);
    console.log("validated values", validated_values);

    const responses: IAnswer = {
      key: validated_keys,
      value: validated_values,
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
    if (groupId === 1) {
      navigate(`/thanks`);
    } else {
      navigate(`/switchquestionnaire`);
    }
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
        Overall Experience
      </Typography>
      <Row>
        <p>Please, complete the following questionnaire.</p>
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
export default LastQuestionnaire;
