import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import { amber } from "@mui/material/colors";
import { Box } from "@mui/material";
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
  //isLoggedIn,
  title,
}: {
  //isLoggedIn: boolean;
  title: string;
}) {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        justifyContent: "space-between",
      }}
    >
      <Toolbar variant="dense" sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" noWrap component="div">
          DESDEO{" "}
        </Typography>

        <Typography variant="h6" noWrap component="div">
          {title}
        </Typography>
        <Typography variant="h6" noWrap component="div">
          {""}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
