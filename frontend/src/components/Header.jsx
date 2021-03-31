import React from 'react';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from 'react-router-dom';
import "../styles/modules/Header.module.css"

class Header extends React.Component {
   render() {
      return (
         <Navbar className="header mustang-green" variant="dark" expand="sm" fixed="top">
            <Navbar.Brand href="/">807.band</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
               <Nav className="mr-auto">
                  <Link to="/" className="nav-link">
                     Home
                  </Link>
                  <Link to="/events" className="nav-link">
                     Events
                  </Link>
                  <Link to="/stations" className="nav-link">
                     Stations
                  </Link>
                  <Link to="/evaluate" className="nav-link">
                     Evaluate
                  </Link>
                  <Link to="/overview" className="nav-link">
                     Overview
                  </Link>
               </Nav>
               <Nav className="ml-auto">
                  <Link to="/profile" className="nav-link">
                     Profile
                  </Link>
               </Nav>
            </Navbar.Collapse>
         </Navbar>
      )
   }
}

export default Header;
