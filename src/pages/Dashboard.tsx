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
        Welcome to the Study
      </Typography>
      <Typography paragraph style={{ textAlign: "left" }}>
        During the study, you will have the opportunity to work with
        state-of-the-art interactive multiobjective optimization methods, and
        contribute to our research by providing valuable insights. The study
        takes about 25 minutes to be completed. All data collected in this study
        is anonymized. The data does not contain any information that could be
        utilized in identifying individuals. In addition, the data in the
        research publication based on this data is presented in such a way that
        the participants in this study cannot be identified. By participating in
        this study, consent is given for data collection, storage, and
        utilization as described above. The responsible leader of this study is
        Professor Francisco Ruiz (rua@uma.es).
      </Typography>
      <Typography paragraph style={{ textAlign: "left" }}>
        All data collected in this study is anonymized. The data does not
        contain any information that could be utilized in identifying
        individuals. In addition, the data in the research publication based on
        this data is presented in such a way that the participants in this study
        cannot be identified.
      </Typography>
      <Typography paragraph style={{ textAlign: "left" }}>
        By participating in this study, consent is given for data collection,
        storage, and utilization as described above.
      </Typography>
      <Typography paragraph style={{ textAlign: "left" }}>
        The responsible leader of this study is Professor Francisco Ruiz
        (rua@uma.es).
      </Typography>

      <Box justifyContent={"flex-end"} display={"flex"}>
        <Button
          //component={Link}
          //to="/demographic"
          size="large"
          variant="contained"
          color="primary"
          sx={{ mr: "1rem" }}
          onClick={() => {
            navigate("/prequestionnaire");
          }}
        >
          Start
        </Button>
        {/* <Button
          //component={Link}
          //to="/nautilus"
          sx={{ mr: "1rem" }}
          variant="contained"
          color="primary"
          onClick={() => {
            createMethod(apiUrl, tokens, problemGroup, "nautilus_navigator");
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
            createMethod(apiUrl, tokens, problemGroup, "synchronous_nimbus");
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
