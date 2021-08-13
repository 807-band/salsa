import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Redirect } from 'react-router';
import { postEvent } from '../../lib/events';
import { getGroupNames } from '../../lib/groups';

const CreateEvent = () => {
  const [validated, setValidated] = useState(false);
  const [groups, setGroups] = useState([]);
  const [formState, setFormState] = useState(false);

  useEffect(() => {
    getGroupNames().then((res) => setGroups(res));
  }, []);

  const handleSubmit = async (event) => {
    setFormState('clicked');
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setFormState(false);
      setValidated(true);
    } else {
      const startTimeString = `${form.startDate.value} ${form.startTime.value}.00`;
      const tardyTimeString = form.tardyTime.value ? `${form.startDate.value} ${form.tardyTime.value}.00` : null;
      const group = groups.find((g) => g.groupName === form.group.value);
      await postEvent(
        form.title.value, startTimeString, tardyTimeString, group ? group.groupID : null,
      );
      setFormState('submitted');
      setValidated(true);
    }
  };

  return (
    <>
      {formState === 'submitted' ? <Redirect push to="/events" /> : null}
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

        <Form.Group controlId="group">
          <Form.Label>Group</Form.Label>
          <Form.Control type="text" required as="select">
            <option>Whole Band</option>
            {groups
              .map((g) => <option key={g.groupID}>{g.groupName}</option>)}
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={formState}>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default CreateEvent;
