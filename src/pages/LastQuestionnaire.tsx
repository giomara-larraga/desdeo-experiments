import React from 'react';
import { useEffect, useState } from "react";
import { Col, Container, Row, Button, Card, Form, ButtonGroup } from 'react-bootstrap';
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { Tokens } from "../types/AppTypes";
// @ts-ignore
import Likert from 'react-likert-scale';

  interface QuestionEnd {
    id: number;
    question_text: string;
    question_type: "open"| "likert";
    show_solution: number;
  }
  
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


  const likertOptions = {
    //question: "What is your opinion of the President’s performance?",
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
  };

const LastQuestionnaire = ({
    isLoggedIn,
    loggedAs,
    tokens,
    apiUrl,
    setCurrentPage}: LastQuestionnaireProps) => {
    setCurrentPage("Questionnaire")
    const [questions, SetQuestions] = useState<QuestionEnd[]>([]);
    const [fetched, SetFetched] = useState(false);
    const { register, handleSubmit, control } = useForm<FormData>();
    const [answers, SetAnswers] = useState<FormData>({ values: [] });

    useEffect(() => {
      const fetchQuestions = async () => {
        try {
          const res = await fetch(`${apiUrl}/questionnaire/end`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokens.access}`,
            },
          });
  
          if (res.status == 200) {
            const body = await res.json();
            // set questions
            SetQuestions(body.questions);
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
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
      </Row>
      <Row className="mb-3">
      {fetched && (
          <Form className='mb-5'>
          {questions.map((q, i) => {
          console.log(q.show_solution)
          if (q.question_type === "open") {
            return(
              <Form.Group className='mb-3'>
              <Form.Label>{`${i+1}. ${q.question_text}`}</Form.Label>
              <Form.Control as="textarea" rows={2} />
              </Form.Group>
            );
          }else if (q.question_type === "likert" && q.show_solution==0) {
            return(
              <Form.Group className='mb-3'>
              <Form.Label>{`${i+1}. ${q.question_text}`}</Form.Label>
              <Likert {...likertOptions} />
              </Form.Group>
            );
          } else if (q.question_type === "likert" && q.show_solution==1) {
            return(
              <Form.Group className='mb-3'>
              <Form.Label>{`${i+1}. ${q.question_text}`}</Form.Label>
              <Form.Label>HEllo I am a solution</Form.Label>
              <Likert {...likertOptions} />
              </Form.Group>
            );
          }
          })}
           <Row className="mb-3">
          <Col style={{display:"flex", justifyContent:"flex-start"}}>
          <Link to={"/prequestionnaire"}>
              <Button>
                  Back
              </Button>
          </Link>
          </Col>
          <Col>
          <Link to={"/switchquestionnaire"} style={{display:"flex", justifyContent:"flex-end"}}>
              <Button>
                  Next
              </Button>
          </Link>
          </Col>

          
      </Row>
          </Form>
      )}
      </Row>
     
      </Container>
    )

}
export default LastQuestionnaire;