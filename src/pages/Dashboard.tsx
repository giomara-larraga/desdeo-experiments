import React from "react";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { Box, Typography, Toolbar, Container } from "@material-ui/core";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { createMethod } from "./nimbus/nimbusHelpers";
import { Tokens } from "../types/AppTypes";
//import "../style/custom.scss";
interface DashboardProps {
  isLoggedIn: boolean;
  loggedAs: string;
  tokens: Tokens;
  apiUrl: string;
  groupId: number;
  problemGroup: number;
  //setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const Dashboard = ({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  groupId,
  problemGroup,
}: //setCurrentPage,
DashboardProps) => {
  const navigate = useNavigate();
  return (
    <Container className="py-4 main-container">
      <CssBaseline />
      <Toolbar variant="dense" />

      <Typography
        variant="h4"
        color="primary"
        style={{ marginBottom: "2rem", textAlign: "left" }}
      >
        Welcome to the study
      </Typography>
      <Typography paragraph style={{ textAlign: "left" }}>
        During the study, you will have the opportunity to work with
        state-of-the-art interactive multiobjective optimization methods, and
        contribute to our research by providing valuable insights on their
        performance and usability. The study take XX minutes to be completed and
        involves the following steps:
      </Typography>

      <List sx={{ width: "100%" }}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>1</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Demographic Information"
            secondary="Before starting the study, you will be asked to fill out a brief survey
      regarding your demographic information. This information is strictly
      confidential and will be used solely for research purposes."
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>2</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Pre-Solution Process"
            secondary="You will be asked to answer a few questions related to your experience and
      expertise in the field before beginning the solution process. This survey
      is aimed at understanding your background and experience in
      the field."
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>3</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary=" Interactive Solution Process"
            secondary="During the solution process, you will use state-of-the-art interactive
      optimization methods to solve a given problem. You will be asked to provide
      feedback on the usability and effectiveness of these methods. Please feel
      free to ask any questions or request any clarifications throughout the
      process."
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>4</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Overall Experience"
            secondary="At the end of the study, you will be asked to provide feedback on your
      overall experience, including your satisfaction with the methods and the
      study as a whole. Your input is essential to ensure the success of
      this research."
          />
        </ListItem>
      </List>
      <Box justifyContent={"flex-end"} display={"flex"}>
        <Button
          //component={Link}
          //to="/demographic"
          size="large"
          variant="contained"
          color="primary"
          sx={{ mr: "1rem" }}
          onClick={() => {
            navigate("/demographic");
          }}
        >
          Start
        </Button>
        {/*             <Button
              //component={Link}
              //to="/nimbus"
              sx={{ mr: "1rem" }}
              variant="contained"
              color="primary"
              onClick={() => {
                createMethod(
                  apiUrl,
                  tokens,
                  problemGroup,
                  "nautilus_navigator"
                );
                navigate("/nautilus");
              }}
            >
              Nautilus
            </Button>
            <Button
              //component={Link}
              //to="/nimbus"
              variant="contained"
              color="primary"
              onClick={() => {
                createMethod(
                  apiUrl,
                  tokens,
                  problemGroup,
                  "synchronous_nimbus"
                );
                navigate("/nimbus");
              }}
            >
              Nimbus
            </Button> */}
      </Box>

      {/*       <Grid
        item
        xs={false}
        sm={false}
        md={4}
        display={"flex"}
        padding={"1rem"}
        alignContent={"center"}
        justifyContent={"center"}
        justifyItems={"center"}
      >
        <img
          src={image}
          alt="My Team"
          style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
        />
      </Grid> */}
    </Container>
  );
};
export default Dashboard;
