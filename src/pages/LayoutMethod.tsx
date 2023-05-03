import React from "react";
import Container from "@mui/material/Container";
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet, Navigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import { Tokens } from "../types/AppTypes";
import PreferencesBar from "../components/PreferencesBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

interface GeneralProps {
  isLoggedIn: boolean;
  loggedAs: string;
  tokens: Tokens;
  apiUrl: string;
  groupId: number;
}

export default function LayoutExperiment({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  groupId,
}: GeneralProps) {
  if (!isLoggedIn) {
    return <Navigate to={"/"} replace />;
  } else {
    return (
      <>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Topbar isLoggedIn={isLoggedIn} loggedAs={loggedAs}></Topbar>
          <Outlet></Outlet>
        </Box>
      </>
    );
  }
}
