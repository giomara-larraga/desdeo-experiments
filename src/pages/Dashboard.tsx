import React from 'react';
import { Col, Container, Row, Button, Card } from 'react-bootstrap';
import { Link } from "react-router-dom";
import {
MdVolunteerActivism
}from "react-icons/md"

interface DashboardProps {
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const Dashboard = ({setCurrentPage}: DashboardProps) => {
    setCurrentPage("Home")
    return (
        <Container className="py-4 main-container">
        <Row className="mb-3">
            <Card className='mb-3 card-thanks'>
                <Row className='g-0'>
                    <Col md={2} style={{display:"flex", alignItems:"center"}}>
                        <div style={{width:"100%", textAlign:"center", display:"flex", justifyContent:"center", alignItems:"center"}}>
                            <MdVolunteerActivism className="ThanksIcon"/>
                        </div>
                        
                    </Col>
                    <Col md={10}>
                        <Card.Body>
                            <Card.Title>
                            Thank you for participating in this experiment
                            </Card.Title>
                            <Card.Text>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                            </Card.Text>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Row>
        <Row className="mb-3" style={{textAlign:"center"}}>
            <h3>Instructions</h3>
        </Row>
        <Row className="mb-3">
            <Row className="mb-5">
                <Col md={1} style={{display:"flex", alignItems:"center", fontWeight:"bolder", fontSize:"2rem", color:"#0f12a9"}}>
                    01
                </Col>
                <Col md={11}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                </Col>
            </Row>
            <Row className="mb-5">
                <Col md={1} style={{display:"flex", alignItems:"center", fontWeight:"bolder", fontSize:"2rem", color:"#0f12a9"}}>
                    02
                </Col>
                <Col md={11}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                </Col>
            </Row>
            <Row className="mb-5">
                <Col md={1} style={{display:"flex", alignItems:"center", fontWeight:"bolder", fontSize:"2rem", color:"#0f12a9"}}>
                    03
                </Col>
                <Col md={11}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                </Col>
            </Row>
        </Row>
        <Row className="mb-3">
            <Link to={"/prequestionnaire"} style={{textAlign:"left", display:"flex", justifyContent:"center"}}>
                <Button>
                    Start
                </Button>
            </Link>
        </Row>
        </Container>
    )

}
export default Dashboard;