import React from "react";
import { Col, Container, Nav, Navbar, NavbarBrand, OverlayTrigger, Row } from "react-bootstrap";
import {
    MdHome,
    MdAutoFixHigh,
    MdExtension,
    MdCatchingPokemon,
    MdArchive,
    MdHelp
}from "react-icons/md"
import Tooltip from 'react-bootstrap/Tooltip';
import { Link } from "react-router-dom";
function Sidebar(){
    const menuItem = [
    {
        path:"/home",
        name:"Home",
        id:"dashboardTip",
        icon:<MdHome size={24}/>
    },
    {
        path:"/solve",
        name:"Solve",
        id:"aboutTip",
        icon:<MdAutoFixHigh size={24}/>
    },
    {
        path:"/analytics",
        name:"Problem",
        id:"analyticsTip",
        icon:<MdExtension size={24}/>
    },
    {
        path:"/comment",
        name:"Method",
        id:"nameTip",
        icon:<MdCatchingPokemon size={24}/>
    },
    {
        path:"/product",
        name:"Archive",
        id:"productTip",
        icon:<MdArchive size={24}/>
    },
    {
        path:"/productlist",
        name:"Help",
        id:"productListTip",
        icon:<MdHelp size={24}/>
    },
    ]
    return (
        <Navbar bg="dark" id="main_sidebar" className="flex-column">     
            <NavbarBrand href="/home">Logo</NavbarBrand> 
            <Nav className="flex-column">      
            {
                menuItem.map((item,index)=>(
                    <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip id={item.id}>{item.name}</Tooltip>}
                    >
                    <Nav.Link as={Link} to={item.path} key={index}>
                        <div className="icon">{item.icon}</div>
                        <div className="text-icon">{item.name}</div>
                    </Nav.Link>
                    </OverlayTrigger>
                ))   
            }
            </Nav>
        </Navbar>
    )
}

export default Sidebar;