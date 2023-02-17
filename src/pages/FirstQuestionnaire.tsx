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
import { prequestionnaire } from "../utils/questionnaires";

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
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

interface FormData {
  values: string[];
}
/*const likertOptions = {
    responses: [
      { value: 1, text: "Strongly disagree" },
      { value: 2, text: "Disagree" },
      { value: 3, text: "Somewhat disagree" },
      { value: 4, text: "Neutral" },
      { value: 5, text: "Somewhat agree" },
      { value: 6, text: "Agree" },
      { value: 7, text: "Strongly agree" }
    ],
    picked: (val: any) => {
      console.log(val);
    }
  };*/

const FirstQuestionnaire = ({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  setCurrentPage,
}: FirstQuestionnaireProps) => {
  useEffect(() => {
    setCurrentPage("Questionnaire");
  }, []);
  const [questions, SetQuestions] =
    useState<QuestionInit>(QuestionInitDefaults);
  const [fetched, SetFetched] = useState(false);
  const { register, handleSubmit, control } = useForm<FormData>();
  const [answers, SetAnswers] = useState<FormData>({ values: [] });
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
        <h1>Questionnaire 1</h1>
      </Row>
      <Row>
        <h5>
          Before start using the method, we need you to answer the following
          information.
        </h5>
      </Row>
      <Row className="mb-3">
        <SurveyComponent
          css={defaultSurveyConfig.defaulsSurveyCSS}
          data={defaultSurveyConfig.defaultSurveyData}
          json={questions}
          onComplete={(survey: any) => {
            navigate(`/postquestionnaire`);
            /** Save to a database  **/
          }}
        />
      </Row>
    </Container>
  );
};
export default FirstQuestionnaire;
