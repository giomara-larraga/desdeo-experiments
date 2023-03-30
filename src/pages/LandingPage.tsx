import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
//import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../images/desdeo_logo.png";
import { Outlet } from "react-router-dom";

//import * as React from 'react';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
//import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const theme = createTheme();

function LandingPage(props: any) {
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://www.jamk.fi/sites/default/files/styles/9_16_max_1440px/public/2022-06/jyvaskyla_ilmakuva_jyvasjarvi_1920x1080.jpg?h=d1cb525d&itok=r38L9kB6)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          display={"flex"}
        >
          <Box
            sx={{
              my: 8,
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h3" className="display-4">
              Welcome to DESDEO
            </Typography>
            <Typography paragraph className="text-muted mb-4">
              Sign in to your account
            </Typography>

            <Outlet></Outlet>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
    /*     <div className="maincontainer">
      <Container fluid={true}>
        <Row className="no-gutter">
          <Col md={6} className="d-none d-md-flex bg-image"></Col>

          <Col md={6} className="col-md-6 bg-light">
            <div className="login d-flex align-items-center py-5">
              <div className="container">
                <div className="row">
                  <div className="col-lg-10 col-xl-7 mx-auto">
                    <h3 className="display-4">Welcome to DESDEO</h3>
                    <p className="text-muted mb-4">Sign in to your account .</p>
                    <Outlet></Outlet>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div> */
  );
}

export default LandingPage;
