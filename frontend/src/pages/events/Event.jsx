import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Button, Card, Form, ListGroup,
} from 'react-bootstrap';
import { getEvent } from '../../lib/events';
import { putAttendance, getAttendance } from '../../lib/attendance';
import { getGroupMembers } from '../../lib/groups';

const Event = ({ isAdmin }) => {
  const [event, setEvent] = useState(null);
  const [currFile, setCurrFile] = useState(null);
  const [group, setGroup] = useState(null);
  const [message, setMessage] = useState(null);
  const [attendance, setAttendance] = useState([]);
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
    getAttendance(params.id).then((res) => setAttendance(res));
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
      <Attendance users={attendance} tardyTime={event.tardyTime} />
      <br />
      <hr />
      <br />
      Upload attendance
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
        <Button type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

const groupByProp = (xs, prop) => {
  const grouped = {};
  for (let i = 0; i < xs.length; i += 1) {
    const p = xs[i][prop];
    if (!grouped[p]) { grouped[p] = []; }
    grouped[p].push(xs[i]);
  }
  return grouped;
};

const Attendance = ({ users, tardyTime }) => {
  const groupedUsers = groupByProp(users, 'section');
  return Object.keys(groupedUsers).map((section) => (
    <Card key={section}>
      <Card.Header className="card-header">{section}</Card.Header>
      <ListGroup>
        {groupedUsers[section].map((user) => (
          <ListGroup.Item className="card-item" key={user.userID}>
            {`${user.name} || ${user.timeArrived} || ${tardyTime}`}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  ));
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
