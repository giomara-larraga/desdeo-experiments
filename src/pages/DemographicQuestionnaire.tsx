import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
//import { useForm, Controller } from "react-hook-form";
//import { Link } from "react-router-dom";
import SurveyComponent from "../components/SurveyComponent";
import { Tokens } from "../types/AppTypes";
import defaultSurveyConfig from "../types/survey";
import { useNavigate } from "react-router-dom";
import "../style/custom.scss";
//import ReactDOM from "react-dom";
//import { json } from "d3";

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
  groupId: number;
  //setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

interface IAnswer {
  key: string[];
  value: any[];
}

/*interface FormData {
  ids: number[];
  answer: any[];
}*/

const QuestionDemographicDefaults: QuestionDemographic = {
  elements: [],
  showQuestionNumbers: true,
};

/*const AnswersDefault: IAnswer = {
  key: Array(0),
  value: Array(0),
};*/

/*const QuestionDemographicMock: QuestionDemographic = {
  elements: [
    {
      name: "6",
      title: "I am now feeling tired.",
      type: "rating",
      isRequired: true,
      minRateDescription: "Not tired",
      maxRateDescription: "Very tired",
    },
  ],
  showQuestionNumbers: true,
};*/

const DemographicQuestionnaire = ({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  groupId,
}: DemographicQuestionnaireProps) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuestionDemographic>(
    QuestionDemographicDefaults //
  );
  //const [fetched, SetFetched] = useState(false);
  //const [saved, SetSaved] = useState(false);
  //const { register, handleSubmit, control } = useForm<FormData>();
  //const [answers, setAnswers] = useState<IAnswer>(AnswersDefault);
  //const [test, setTest] = useState("default");

  /*useEffect(() => {
    setCurrentPage("Demographic information");
  }, []);*/

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${apiUrl}/questionnaire/demographic`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        });
        if (res.status === 200) {
          const body = await res.json();
          // set questions
          setQuestions(body);
          //SetFetched(true);
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

    navigate(`/prequestionnaire`);
  }, []);

  return (
    <Container className="py-4 main-container">
      <Row className="mb-3" style={{ textAlign: "center" }}>
        <h4>Demographic Information</h4>
      </Row>
      <Row>
        <p>
          Please answer the following questions to let us learn more about you.
          The information provided will be used solely for this research
          project.
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

export default DemographicQuestionnaire;
