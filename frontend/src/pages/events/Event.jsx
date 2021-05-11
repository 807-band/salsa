import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { getEvent } from '../../lib/events';

const Event = ({ isAdmin }) => {
  const [event, setEvent] = useState(null);
  const params = useParams();

  useEffect(() => {
    getEvent(params.id).then((res) => setEvent(res));
  }, []);

  return event && (
    <>
      {isAdmin && (
        <Link to={`/events/${event.eventID}/edit`}>
          <Button variant="primary" className="edit-button">
            Edit
          </Button>
        </Link>
      )}

      <h1>{event.title}</h1>
      {new Date(event.startTime).toLocaleString()}
      <br />
      <br />
      <br />
      <br />
      [upload csv here]
    </>
  );
};

export default Event;
