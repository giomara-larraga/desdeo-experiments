import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
//import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../images/desdeo_logo.png";
import { Outlet } from "react-router-dom";

function LandingPage(props: any) {
  return (
    <div className="maincontainer">
      <Container fluid={true}>
        <Row className="no-gutter">
          <Col md={6} className="d-none d-md-flex bg-image"></Col>

          <Col md={6} className="col-md-6 bg-light">
            <div className="login d-flex align-items-center py-5">
              <div className="container">
                <div className="row">
                  <div className="col-lg-10 col-xl-7 mx-auto">
                    <h3 className="display-4">Welcome to DESDEO</h3>
                    <p className="text-muted mb-4">Sign in to your account .</p>
                    <Outlet></Outlet>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LandingPage;
