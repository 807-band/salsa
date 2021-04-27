/* eslint-disable jsx-a11y/control-has-associated-label */
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import { postStation } from '../../lib/stations';

const CreateStation = () => {
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      await postStation(form.title.value, form.description.value, form.rank.value === 'beginner' ? 0 : 1);
      setValidated(true);
    }
  };

  return (
    <>
      <h1>
        Create Station
      </h1>
      <br />

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Station Title</Form.Label>
          <Form.Control type="text" placeholder="Title" required />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" placeholder="Description" />
        </Form.Group>

        <Form.Group controlId="rank">
          <Form.Label>Rank</Form.Label>
          <Form.Control type="text" required as="select">
            <option />
            <option>beginner</option>
            <option>advanced</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default CreateStation;
