import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { getEvent } from '../../lib/events';
import putAttendance from '../../lib/attendance';
import { getGroupMembers } from '../../lib/groups';

const Event = ({ isAdmin }) => {
  const [event, setEvent] = useState(null);
  const [currFile, setCurrFile] = useState(null);
  const [group, setGroup] = useState(null);
  const [message, setMessage] = useState(null);
  const params = useParams();

  useEffect(() => {
    getEvent(params.id).then((res) => {
      setEvent(res);
      if (res.groupID) {
        getGroupMembers(res.groupID).then((g) => setGroup(g[0].groupName));
      } else {
        setGroup('Whole Band');
      }
    });
    // TODO: get current file for event and display name as default file
    // setCurrFile({ name: 'poopoo' });
  }, []);

  return event && (
    <>
      {isAdmin && (
        <Link to={`/events/${event.eventID}/edit`}>
          <Button variant="primary" className="edit-button">
            Edit Event
          </Button>
        </Link>
      )}

      <h1>{event.title}</h1>
      {new Date(event.startTime).toLocaleDateString()}
      <br />
      {`Start Time: ${new Date(event.startTime).toLocaleTimeString().replace(/:\d\d /, ' ')}`}
      <br />
      {`Tardy Time: ${new Date(event.tardyTime).toLocaleTimeString().replace(/:\d\d /, ' ')}`}
      <br />
      {`Group to attend: ${group}`}
      <br />
      <br />
      <hr />
      <br />
      <h1>Attendance</h1>
      <br />
      <Form onSubmit={handleSubmit(event.eventID, currFile, setMessage)}>
        <Form.Group controlId="file" onChange={(e) => setCurrFile(e.target.files[0])}>
          <Form.File id="formcheck-api-custom" custom>
            <Form.File.Input isValid={message === 'Success'} isInvalid={message !== 'Success' && message !== null} />
            <Form.File.Label>
              {currFile ? currFile.name : 'Choose a file'}
            </Form.File.Label>
            <Form.Control.Feedback type="valid">{message}</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">{message}</Form.Control.Feedback>
          </Form.File>
        </Form.Group>
        <br />
        <Button type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

const handleSubmit = (id, file, setMessage) => async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const data = new FormData();
  data.append('file', file);
  const res = await putAttendance(id, data);
  setMessage(res.message);
};

export default Event;
