import React from "react";
import Container from "@mui/material/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
//import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../images/desdeo_logo.png";
import contributefigure from "../images/contribute.png";
import documentationfigure from "../images/learn.png";
import Nav from "react-bootstrap/Nav";
import NavBar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Carousel from "react-bootstrap/Carousel";
import Accordion from "react-bootstrap/Accordion";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Tokens } from "../types/AppTypes";

interface GeneralProps {
  isLoggedIn: boolean;
  loggedAs: string;
  tokens: Tokens;
  apiUrl: string;
  groupId: number;
  currentPage: string;
}

export default function LayoutExperiment({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  groupId,
  currentPage,
}: GeneralProps) {
  if (!isLoggedIn) {
    return <Navigate to={"/"} replace />;
  } else {
    return (
      <>
        <Container className="main_container_layout g0">
          <Topbar title={currentPage}></Topbar>

          <Outlet />
        </Container>
      </>
    );
  }
}
