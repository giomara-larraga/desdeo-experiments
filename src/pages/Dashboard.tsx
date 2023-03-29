import React from "react";
import { Col, Container, Row, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MdVolunteerActivism } from "react-icons/md";

const Dashboard = () => {
  return (
    <Container className="py-4 main-container">
      <Row className="mb-3" style={{ textAlign: "center" }}>
        <h4>Instructions</h4>
      </Row>
      <Row className="mb-3" style={{ textAlign: "left" }}>
        <p>
          Thank you for agreeing to participate in our experiment. In this
          study, we are interested in .....
        </p>
        <p>
          Please note that your participation is entirely voluntary, and you are
          free to withdraw at any time without penalty. Your responses will be
          kept confidential, and we will not collect any identifying information
          about you.
        </p>
        <p>The experiment consists of the following steps:</p>
      </Row>
      <Row className="mb-3">
        <Row className="mb-5">
          <Col
            md={1}
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bolder",
              fontSize: "2rem",
              color: "#0f12a9",
            }}
          >
            01
          </Col>
          <Col md={11}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </Col>
        </Row>
        <Row className="mb-5">
          <Col
            md={1}
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bolder",
              fontSize: "2rem",
              color: "#0f12a9",
            }}
          >
            02
          </Col>
          <Col md={11}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </Col>
        </Row>
        <Row className="mb-5">
          <Col
            md={1}
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bolder",
              fontSize: "2rem",
              color: "#0f12a9",
            }}
          >
            03
          </Col>
          <Col md={11}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </Col>
        </Row>
      </Row>
      <Row className="mb-3">
        <Link
          to={"/demographic"}
          style={{
            textAlign: "left",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button>Start</Button>
        </Link>
      </Row>
    </Container>
  );
};
export default Dashboard;
