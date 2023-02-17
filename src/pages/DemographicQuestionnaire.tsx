import React from "react";
import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import SurveyComponent from "../components/SurveyComponent";
import { Tokens } from "../types/AppTypes";
import defaultSurveyConfig from "../types/survey";
import { useNavigate } from "react-router-dom";
import "../style/custom.scss";
import ReactDOM from "react-dom";

interface QuestionDemographic {
  elements: any[];
  showQuestionNumbers: boolean;
  //question_type: "age" | "gender" | "open"| "bool"| "nationality";
  //show_solution: number;
}

interface DemographicQuestionnaireProps {
  isLoggedIn: boolean;
  loggedAs: string;
  tokens: Tokens;
  apiUrl: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

interface FormData {
  values: string[];
}

const QuestionDemographicDefaults: QuestionDemographic = {
  elements: [],
  showQuestionNumbers: true,
};

const DemographicQuestionnaire = ({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  setCurrentPage,
}: DemographicQuestionnaireProps) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuestionDemographic>(
    QuestionDemographicDefaults
  );
  const [fetched, SetFetched] = useState(false);
  const { register, handleSubmit, control } = useForm<FormData>();
  const [answers, SetAnswers] = useState<FormData>({ values: [] });

  useEffect(() => {
    setCurrentPage("Demographic information");
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${apiUrl}/questionnaire/demographic`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        });
        if (res.status == 200) {
          const body = await res.json();
          // set questions
          setQuestions(body);
          SetFetched(true);
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
        <h1>Demographic Information</h1>
      </Row>
      <Row>
        <h5>
          Please answer the following questions to let us learn more about you.
          The information provided will be used solely for this research
          project.
        </h5>
      </Row>
      <Row className="mb-3">
        <SurveyComponent
          css={defaultSurveyConfig.defaulsSurveyCSS}
          data={defaultSurveyConfig.defaultSurveyData}
          json={questions}
          onComplete={(survey: any) => {
            console.log(questions);
            navigate(`/prequestionnaire`);
          }}
        />
      </Row>
    </Container>
  );
};

export default DemographicQuestionnaire;
