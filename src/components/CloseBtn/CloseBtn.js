import React from "react";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function CloseBtn() {
  return (
      <LinkContainer to="/">
        <Button variant="danger" type="button" className="mx-2">
          Close
        </Button>
      </LinkContainer>
  );
}
