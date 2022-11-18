import React from "react";
import { Container, Nav, Navbar, NavbarBrand, OverlayTrigger } from "react-bootstrap";
import { FaPlayCircle, FaStopCircle } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
function Topbar({
  isLoggedIn,
  loggedAs,
  currentPage,
}: {
  isLoggedIn: boolean;
  loggedAs: string;
  currentPage:string;
}){
    return (
        <Navbar className="top_bar" expand="lg">
          
          <Navbar.Text>
            {currentPage}
          </Navbar.Text>
          <Navbar.Toggle />


          <Navbar.Collapse>
            <Navbar.Text>
              Signed in as: <a href="#login">{loggedAs}</a>
            </Navbar.Text>
          </Navbar.Collapse>
      </Navbar>
    )
}

export default Topbar;