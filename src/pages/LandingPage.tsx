import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
//import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../images/desdeo_logo.png';
import { Link, Outlet } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useState } from "react";
//import { Redirect } from "react-router-dom";
import { Tokens } from "../types/AppTypes";
import { useEffect } from 'react';

function LandingPage(props:any) {
  return (
    <Row className="g-0">
    <Col lg={12} style={{ height: "100vh"}} className="d-flex align-items-center">
    <Container>
      <Row className="justify-content-center">
              <Row>
                <Col lg={7} className='d-none d-lg-flex my-5'>
                  <div className='flex-grow-1 p-3 bg-login-image'>
                    <div className='p-5'>
                      <div className='logo'>
                      <img
                          height="30"     
                          src={logo}
                          width="30"
                          className="d-inline-block align-top"
                          alt="DESDEO logo"
                        />
                        <strong>DESDEO</strong>
                      </div>
                      <h1 style={{color: "rgb(0,0,0)", fontSize:50, maxWidth:'70%', marginBottom:'1rem'}}>Enabling better decision making</h1>
                      <p style={{textAlign: "left", transformOrigin: "bottom", marginBottom:'1rem', maxWidth:'80%'}}>
                      DESDEO brings interactive methods closer to researchers and practitioners worldwide by providing them with implementations of interactive methods.
                      It is a free and open-source Python-based framework for developing and experimenting with interactive multiobjective optimization. 
                      We welcome you to utilize DESDEO and develop it further with us.
                      </p>                     
                    </div>
                  </div>
                </Col>
                <Col lg={5} className='p-5'>
                  <Outlet />
                </Col>
              </Row>
      </Row>
    </Container>
    </Col>
    </Row>
  );
}


export default LandingPage;

