import { Button, Form, Modal } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router';
import { deleteEvent, getEvent, putEvent } from '../../../lib/events';
import { getGroupMembers, getGroupNames } from '../../../lib/groups';

const EditEvent = () => {
  const [event, setEvent] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const params = useParams();
  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(async () => {
    getEvent(params.id).then((e) => {
      setEvent(e);
      if (e.groupID) {
        getGroupMembers(e.groupID).then((g) => setSelectedGroup(g[0].groupName));
      } else {
        setSelectedGroup('Whole Band');
      }
    });
    getGroupNames().then((res) => setGroups(res));
  }, []);

  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);
    if (form.checkValidity()) {
      const startTimeString = `${form.startDate.value} ${form.startTime.value}.00`;
      const tardyTimeString = form.tardyTime.value ? `${form.startDate.value} ${form.tardyTime.value}.00` : 'DEFAULT';
      const group = groups.find((g) => g.groupName === form.group.value);
      await putEvent(
        event.eventID, form.title.value, startTimeString,
        tardyTimeString, group ? group.groupID : null,
      );
      setRedirect(`/events/${event.eventID}`);
    }
  };

  return event && selectedGroup && (
    <>
      { redirect && (<Redirect push to={redirect} />)}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header className="danger-modal-header">
          <Modal.Title>
            {`WARNING: Are you sure you want to delete event '${event.title}'?`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Any uploaded csv data will be deleted with it. THIS IS FINAL.</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => doDeleteEvent(event, setRedirect)}>
            Yes, I&apos;m sure
          </Button>
        </Modal.Footer>
      </Modal>

      <Button variant="danger" className="edit-button" onClick={() => setShowModal(true)}>
        Delete Event
      </Button>
      <br />

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Event Title</Form.Label>
          <Form.Control type="text" defaultValue={event.title} required />
        </Form.Group>

        <Form.Group controlId="startDate">
          <Form.Label>Start Date</Form.Label>
          <Form.Control type="date" defaultValue={event.startTime.split('T')[0]} required />
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
          <Form.Control value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} type="text" required as="select">
            <option>Whole Band</option>
            {groups
              .map((g) => <option key={g.groupID}>{g.groupName}</option>)}
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" className="edit-button">
          Done
        </Button>
      </Form>
      <Button variant="secondary" className="edit-button" onClick={() => setRedirect(`/events/${event.eventID}`)}>
        Back
      </Button>
    </>
  );
};

const doDeleteEvent = async (event, setRedirect) => {
  await deleteEvent(event.eventID);
  setRedirect('/events');
};

export default EditEvent;
