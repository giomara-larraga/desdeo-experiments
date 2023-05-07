import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import { amber } from "@mui/material/colors";

import React from "react";
import {
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  OverlayTrigger,
} from "react-bootstrap";
import { FaPlayCircle, FaStopCircle } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
function Topbar({
  isLoggedIn,
  loggedAs,
}: {
  isLoggedIn: boolean;
  loggedAs: string;
}) {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          DESDEO
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
