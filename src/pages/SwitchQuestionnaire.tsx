import React from "react";
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
import { switchquestionnaire } from "../utils/questionnaires";

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
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

interface FormData {
  values: string[];
}

const SwitchQuestionnaire = ({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  setCurrentPage,
}: LastQuestionnaireProps) => {
  useEffect(() => {
    setCurrentPage("Questionnaire");
  }, []);
  const [questions, SetQuestions] = useState<QuestionEnd>(QuestionEndDefaults);
  const [fetched, SetFetched] = useState(false);
  const { register, handleSubmit, control } = useForm<FormData>();
  const [answers, SetAnswers] = useState<FormData>({ values: [] });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${apiUrl}/questionnaire/switch`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        });

        if (res.status == 200) {
          const body = await res.json();
          // set questions
          SetQuestions(body);
          SetFetched(true);
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

  return (
    <Container className="py-4 main-container">
      <Row className="mb-3">
        <h1>Questionnaire 3</h1>
      </Row>
      <Row>
        <h5>
          Please, complete the following questionnaire related to the steps of
          the solution process.
        </h5>
      </Row>
      <Row className="mb-3">
        <SurveyComponent
          css={defaultSurveyConfig.defaulsSurveyCSS}
          data={defaultSurveyConfig.defaultSurveyData}
          json={questions}
          onComplete={(survey: any) => {
            navigate(`/nautilus`);
            /** Save to a database  **/
          }}
        />
      </Row>
    </Container>
  );
};
export default SwitchQuestionnaire;
