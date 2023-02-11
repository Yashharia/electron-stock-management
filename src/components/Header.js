import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const header = () => {
  return (
    <>
      <div className="text-center py-2 d-print-none">
        <LinkContainer to="/">
          <Navbar.Brand>
            <h4>Taka stock management</h4>
          </Navbar.Brand>
        </LinkContainer>
      </div>
      <Navbar className="px-5 justify-center d-print-none" bg="light" expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
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
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default header;
