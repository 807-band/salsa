import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { postEvent } from '../../lib/events';

const CreateEvent = () => {
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      const startTimeString = `${form.startDate.value} ${form.startTime.value}.00`;
      const tardyTimeString = form.tardyTime.value ? `${form.startDate.value} ${form.tardyTime.value}.00` : null;
      await postEvent(form.title.value, startTimeString, tardyTimeString);
      setValidated(true);
    }
  };

  return (
    <>
      <h1>
        Create Event
      </h1>
      <br />

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Event Title</Form.Label>
          <Form.Control type="text" placeholder="Title" required />
        </Form.Group>

        <Form.Group controlId="startDate">
          <Form.Label>Start Date</Form.Label>
          <Form.Control type="date" required />
        </Form.Group>

        <Form.Group controlId="startTime">
          <Form.Label>Start Time</Form.Label>
          <Form.Control type="time" required />
        </Form.Group>

        <Form.Group controlId="tardyTime">
          <Form.Label>Tardy Time</Form.Label>
          <Form.Text>
            Starting at this time, member will be considered tardy
            (defaults to 10 minutes after start time)
          </Form.Text>
          <Form.Control type="time" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default CreateEvent;
