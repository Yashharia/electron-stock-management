import React, { useState } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const header = () => {
  var currentURL = window.location.origin;

  return (
    <>
      <div className="text-center py-2 d-print-none">
        <LinkContainer to="/">
          <Navbar.Brand>
            <h4>Taka stock management</h4>
          </Navbar.Brand>
        </LinkContainer>
      </div>
      <Navbar className="px-5 justify-center d-print-none" bg="light" expand="lg" collapseOnSelect >
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">

          {(currentURL !== "https://yashharia.github.io" )? 
            <>
              <NavDropdown title="Master" id="basic-nav-dropdown">
                <LinkContainer to="/master/add/dying">
                  <NavDropdown.Item>Job Worker</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/master/quality">
                  <NavDropdown.Item>Quality</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <NavDropdown title="Transaction" id="basic-nav-dropdown">
                <LinkContainer to="/receipt">
                  <NavDropdown.Item>Receipt</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/dispatch">
                  <NavDropdown.Item>Dispatch</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
        
              <NavDropdown title="Reports" id="basic-nav-dropdown">
                <LinkContainer to="/dispact-report/">
                  <NavDropdown.Item>Dispatch reports</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/report">
                  <NavDropdown.Item>Receipt reports</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/quality-report">
                  <NavDropdown.Item>Taka Balance</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/quality-wise-report">
                  <NavDropdown.Item>Quality wise stock report</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            </>
          : 
          <>
           <LinkContainer to="/dispact-report/"><Nav.Link >Dispatch reports</Nav.Link></LinkContainer>
           <LinkContainer to="/report"><Nav.Link>Receipt reports</Nav.Link></LinkContainer>
           <LinkContainer to="/quality-report"><Nav.Link>Taka Balance</Nav.Link></LinkContainer>
           <LinkContainer to="/quality-wise-report"><Nav.Link>Quality wise stock report</Nav.Link></LinkContainer>
          </>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default header;
