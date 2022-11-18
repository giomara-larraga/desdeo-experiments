import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
//import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../images/desdeo_logo.png';
import contributefigure from '../images/contribute.png'
import documentationfigure from '../images/learn.png'
import Nav from 'react-bootstrap/Nav'
import NavBar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table'
import Carousel from 'react-bootstrap/Carousel'
import Accordion from 'react-bootstrap/Accordion'
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { Tokens } from '../types/AppTypes';



interface GeneralProps {
  isLoggedIn: boolean;
  loggedAs: string;
  tokens: Tokens;
  apiUrl: string;
  currentPage: string;
}

export default function Layout ({isLoggedIn,loggedAs,tokens,apiUrl,currentPage}:GeneralProps) {
  if (!isLoggedIn) {
    return <Navigate to={"/"} replace />;
  }
  else{
    return (
      <>
      <Container fluid className="main_container_layout g0">
      <Sidebar></Sidebar>
      <Container fluid className='content_container_layout g0'>
          <Row className='top_bar_container'>
          <Col>
            <Topbar isLoggedIn={isLoggedIn} loggedAs={loggedAs} currentPage={currentPage}></Topbar>
          </Col>
        </Row>
        <Row className='top_bar_container'>
          <Col>
            <Outlet />
          </Col>
        </Row>
        </Container>
      </Container>
      </>
    );
  }
}