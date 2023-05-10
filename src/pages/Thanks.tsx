import React from "react";
import { useEffect, useState, useCallback } from "react";
import { Tokens } from "../types/AppTypes";
import { Row, Col, Form, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {
  Container,
  CssBaseline,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
interface ThanksProps {
  isLoggedIn: boolean;
  loggedAs: string;
  tokens: Tokens;
  apiUrl: string;
  groupId: number;
}
function Thanks({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  groupId,
}: //activeProblemId,
ThanksProps) {
  return (
    <Grid container component="main" sx={{ height: "calc(80vh)" }}>
      <Toolbar />
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
        <Card sx={{ padding: "2rem", alignContent: "center" }}>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant="h2" sx={{ textAlign: "center" }}>
              Thank you for participating in this study.
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "3rem",
              }}
            >
              <Link to="/">
                <Button variant="contained" size="large">
                  Go back to index
                </Button>
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Grid>
  );
}

export default Thanks;
