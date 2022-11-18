import React from "react";
import { Container, Nav, Navbar, NavbarBrand, OverlayTrigger } from "react-bootstrap";
import { FaPlayCircle, FaStopCircle } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
function Topbar(){
    return (
        <Navbar className="top_bar" expand="lg">
          
          <Navbar.Text>
            METHOD_NAME
          </Navbar.Text>
          <Navbar.Toggle />


          <Navbar.Collapse as={Link}>
              <Navbar.Text style={{color:"green", width:"50px"}}> <FaPlayCircle/></Navbar.Text>
              <Navbar.Text style={{color:"red"}}> <FaStopCircle/></Navbar.Text>
          </Navbar.Collapse>

          <Navbar.Collapse>
            <Navbar.Text>
              Signed in as: <a href="#login">Mark Otto</a>
            </Navbar.Text>
          </Navbar.Collapse>
      </Navbar>
    )
}

export default Topbar;