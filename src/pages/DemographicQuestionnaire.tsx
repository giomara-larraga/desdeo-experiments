import React from 'react';
import { useEffect, useState } from "react";
import { Col, Container, Row, Button, Card, Form, ButtonGroup } from 'react-bootstrap';
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { Tokens } from "../types/AppTypes";

  interface QuestionDemographic {
    id: number;
    question_text: string;
    question_type: "age" | "gender" | "open"| "bool"| "nationality";
    show_solution: number;
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


const DemographicQuestionnaire = ({
    isLoggedIn,
    loggedAs,
    tokens,
    apiUrl,
    setCurrentPage}: DemographicQuestionnaireProps) => {
    setCurrentPage("Demographic information")
    const [questions, SetQuestions] = useState<QuestionDemographic[]>([]);
    const [fetched, SetFetched] = useState(false);
    const { register, handleSubmit, control } = useForm<FormData>();
    const [answers, SetAnswers] = useState<FormData>({ values: [] });

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
            SetQuestions(body.questions);
            SetFetched(true);
            console.log("Questions fetched successfully!");
            console.log(questions)
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
            console.log(q.question_text)
            if (q.question_type === "age") {
              return (
                <Form.Group className='mb-3'>
                  <Row>
                    <Col>
                      <Form.Label>{`${i+1}. ${q.question_text}`}</Form.Label>
                      <Form.Control
                        type="number"
                        id="age"
                      />
                    </Col>
                  </Row>
                  
                </Form.Group>
              );
            }else if (q.question_type === "open") {
              return(
                <Form.Group className='mb-3'>
                <Form.Label>{`${i+1}. ${q.question_text}`}</Form.Label>
                <Form.Control as="textarea" rows={2} />
                </Form.Group>
              );
            }else if (q.question_type === "gender") {
              return(
                <Form.Group className='mb-3'>
                <Form.Label>{`${i+1}. ${q.question_text}`}</Form.Label>
                <Form.Select aria-label="Default select example">
                  <option>Select one option</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="NB">Non-binary</option>
                  <option value="NA">Do not wish to disclose</option>
                </Form.Select>
                </Form.Group>
              );
            }else if (q.question_type === "bool") {
              return(
                <Form.Group className='mb-3'>
                <Form.Label>{`${i+1}. ${q.question_text}`}</Form.Label>
                <Form.Control as="textarea" rows={2} />
                </Form.Group>
              );
            }else if (q.question_type === "nationality") {
              return(
                <Form.Group className='mb-3'>
                <Form.Label>{`${i+1}. ${q.question_text}`}</Form.Label>
                <Form.Control
                  type="text"
                  id="nationality"
                />
                </Form.Group>
              );
            }
            })}
             <Row className="mb-3">
            <Col style={{display:"flex", justifyContent:"flex-start"}}>
            <Link to={"/home"}>
                <Button>
                    Back
                </Button>
            </Link>
            </Col>
            <Col>
            <Link to={"/prequestionnaire"} style={{display:"flex", justifyContent:"flex-end"}}>
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
export default DemographicQuestionnaire;