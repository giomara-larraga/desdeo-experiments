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
    <Navbar className="top_bar" expand="lg">
      <Navbar.Text>
        Experiment with interactive multiobjective optimization methods
      </Navbar.Text>
      <Navbar.Toggle />

      <Navbar.Collapse>
        <Navbar.Text style={{ color: "#fff" }}>
          Signed in as:{" "}
          <a href="#login" style={{ color: "#fff" }}>
            {loggedAs}
          </a>
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Topbar;
