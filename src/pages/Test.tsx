import React from 'react';
import { Col, Container, Navbar, Row } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const Test = (children: any) => {
    return (
        <Container>
        {/* <Sidebar/> */}
        {/* <Topbar></Topbar> */}
        {/* <div id="main_container"> */}
            <Navbar bg="light">
                <Container>
                <Navbar.Brand>Brand text</Navbar.Brand>
                </Container>
            </Navbar>
            <Row>
                <Col>
                lksrjglnsgergerlkedjehklrtmöljyjlöty,jk
                </Col>
                <Col>
                    snvkjrnvjk
                </Col>
            </Row>
            <Row>
                <Col>ererererererer</Col>
                <Col>jiojijoijoijoijoijo</Col>
            </Row>
        {/* </div> */}
        </Container>
    )

}
export default Test;