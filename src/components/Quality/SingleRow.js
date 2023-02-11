import { Button, Container, Table, Form, Row, Col } from "react-bootstrap";
import React, { useState, useCallback } from "react";

function SingleRow({ arrayName, name, i, quantity, min, onChange }) {
  const setData = useCallback(
    (arrayName, i, key, value) => {
      onChange(arrayName, i, key, value);
    },
    [onChange]
  );

  return (
    <Row className="mt-2" key={i}>
      <Col>
        <Form.Control
          type="text"
          placeholder="NAME"
          value={name}
          onChange={(e) => {
            setData(arrayName, i, "name", e.target.value.toUpperCase());
          }}
        />
      </Col>

      <Col>
        <Form.Control
          type="number"
          value={quantity}
          placeholder="QUANTITY"
          onChange={(e) => {
            setData(arrayName, i, "quantity", parseFloat(e.target.value));
          }}
        />
      </Col>
    </Row>
  );
}
export default SingleRow;
