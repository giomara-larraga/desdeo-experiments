import React from 'react';
import { useEffect, useState } from "react";
import { Col, Container, Row, Button, Card, Form, ButtonGroup } from 'react-bootstrap';
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { Tokens } from "../types/AppTypes";

interface Question {
    type: "likert" | "open" | "differential";
    name: string;
    question_txt: string;
    answer: string | number;
  }
  
  interface QuestionnaireProps {
    isLoggedIn: boolean;
    loggedAs: string;
    tokens: Tokens;
    apiUrl: string;
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  }
  
  interface FormData {
    values: string[];
  }


const FirstQuestionnaire = ({
    isLoggedIn,
    loggedAs,
    tokens,
    apiUrl,
    setCurrentPage}: QuestionnaireProps) => {
    setCurrentPage("Questionnaire")
    const [questions, SetQuestions] = useState<Question[]>([]);
    const [fetched, SetFetched] = useState(false);
    const { register, handleSubmit, control } = useForm<FormData>();
    const [answers, SetAnswers] = useState<FormData>({ values: [] });

    useEffect(() => {
        if (!fetched) {
          // do nothing
          return;
        } else {
          SetAnswers({
            values: questions.map((q, i) => {
              if (q.type === "likert") {
                return "4";
              }
              if (q.type === "differential") {
                return "4";
              }
              if (q.type === "open") {
                return "No answer";
              } else {
                return "None";
              }
            }),
          });
        }
      }, [fetched]);

    return (
        <Container className="py-4 main-container">
        <Row className="mb-5">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
        </Row>
        <Row className="mb-3">
            <Form className='mb-5'>
            <Form.Group className='mb-5'>
              <Row>
                <Col>
                  <Form.Label>1. I am now feeling tired.</Form.Label>
                </Col>
              </Row>
              <ButtonGroup>
                <Button variant="secondary" value="1">
                  1
                </Button>
                <Button variant="secondary" value="2">
                  2
                </Button>
                <Button variant="secondary" value="3">
                  3
                </Button>
                <Button variant="secondary" value="4">
                  4
                </Button>
                <Button variant="secondary" value="5">
                  5
                </Button>
                <Button variant="secondary" value="6">
                  6
                </Button>
                <Button variant="secondary" value="7">
                  7
                </Button>
              </ButtonGroup>
            </Form.Group>
            <Form.Group>
            <Form.Label>2. What do you think you can achieve in each objective function?</Form.Label>
            <Form.Control as="textarea" rows={3} />
            </Form.Group>
            </Form>
        </Row>
        <Row className="mb-3">
            <Col style={{display:"flex", justifyContent:"flex-start"}}>
            <Link to={"/home"}>
                <Button>
                    Back
                </Button>
            </Link>
            </Col>
            <Col>
            <Link to={"/nautilus"} style={{display:"flex", justifyContent:"flex-end"}}>
                <Button>
                    Next
                </Button>
            </Link>
            </Col>

            
        </Row>
        </Container>
    )

}
export default FirstQuestionnaire;