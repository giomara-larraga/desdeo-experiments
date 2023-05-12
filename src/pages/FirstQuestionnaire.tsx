import React, { useCallback } from "react";
import { useEffect, useState } from "react";

import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { Tokens } from "../types/AppTypes";
import { useNavigate } from "react-router-dom";
import defaultSurveyConfig from "../types/survey";
import SurveyComponent from "../components/SurveyComponent";
import { prequestionnaire } from "../utils/questionnaires";
import { createMethod } from "./nimbus/nimbusHelpers";
import { Toolbar, Container } from "@mui/material";
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
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
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
  setCurrentPage,
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
    setCurrentPage("Questionnaire");
  }, []);
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
    let methodName;
    let route: string;

    if (groupId === 1) {
      methodName = "synchronous_nimbus";
      route = "/nimbus";
    } else {
      methodName = "nautilus_navigator";
      route = "/nautilus";
    }
    await createMethod(apiUrl, tokens, problemGroup, methodName);

    /* try {
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
    } */
    navigate(route);
  }, []);

  return (
    <Container className="py-4 main-container">
      <CssBaseline />
      <Toolbar variant="dense" />
      <Typography
        variant="h4"
        color="primary"
        style={{ marginBottom: "2rem", textAlign: "left" }}
      >
        Pre-Solution Process
      </Typography>
      <Typography>
        Before start using the method, we need you to answer the following
        information.
      </Typography>

      <SurveyComponent
        data={defaultSurveyConfig.defaultSurveyData}
        json={questions}
        onComplete={onSurveyComplete}
      />
    </Container>
  );
};
export default FirstQuestionnaire;
