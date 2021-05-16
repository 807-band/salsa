import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { getEvent, putAttendance } from '../../lib/events';

const Event = ({ isAdmin }) => {
  const [event, setEvent] = useState(null);
  const [currFile, setCurrFile] = useState(null);
  const params = useParams();

  useEffect(() => {
    getEvent(params.id).then((res) => setEvent(res));
    // TODO: get current file for event and display name as default file
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
      <br />
      <hr />
      <br />
      <br />
      <Form onSubmit={handleSubmit(event.eventID, currFile)}>
        <Form.Group controlId="file" onChange={(e) => setCurrFile(e.target.files[0])}>
          <Form.File>
            <Form.File.Label>
              <h1>Upload Attendance</h1>
            </Form.File.Label>
            <Form.File.Input />
          </Form.File>
        </Form.Group>
        <Button type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

const handleSubmit = (id, file) => async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const data = new FormData();
  data.append('file', file);
  await putAttendance(id, data);
  // TODO: error checking ... signal successful upload somehow
};

export default Event;
