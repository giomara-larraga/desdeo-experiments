import React from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MdVolunteerActivism } from "react-icons/md";
import Grid from "@mui/material/Grid";
import { Box, Typography } from "@material-ui/core";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography
          variant="h4"
          align="center"
          style={{ marginBottom: "1rem" }}
        >
          Instructions
          <br></br>
        </Typography>
        <Typography paragraph>
          Thank you for agreeing to participate in our experiment. In this
          study, we are interested in .....
          <br></br>
          Please note that your participation is entirely voluntary, and you are
          free to withdraw at any time without penalty. Your responses will be
          kept confidential, and we will not collect any identifying information
          about you.
          <br></br>
          <br></br>
          The experiment consists of the following steps:
          <br></br>
          1.
          <br></br>
          2.
          <br></br>
          3.
        </Typography>
        <Box justifyContent={"flex-end"} display={"flex"}>
          <Button
            component={Link}
            to="/demographic"
            variant="contained"
            color="primary"
          >
            Start
          </Button>
          <Button
            component={Link}
            to="/nimbus"
            variant="contained"
            color="primary"
          >
            Skip
          </Button>
        </Box>
        {/* <Row className="mb-3">
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
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
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
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
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
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Col>
          </Row>
        </Row> */}
        {/*         <Row className="mb-3">
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
          <Link to={"/nimbus"}>
            <Button>{"Continue"}</Button>
          </Link>
        </Row> */}
      </Box>
    </Box>
  );
};
export default Dashboard;
