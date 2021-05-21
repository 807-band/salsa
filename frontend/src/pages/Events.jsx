import React, { useEffect, useState } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import getEvents from '../lib/events';

const Events = () => {
  const [events, setEvents] = useState([]);
  const now = new Date().toISOString();

  useEffect(() => {
    getEvents().then((res) => setEvents(res));
  }, []);

  return (
    <>
      <h1>Events</h1>
      <EventCard title="past events" events={events.filter((e) => e.startTime < now)} />
      <EventCard title="upcoming events" events={events.filter((e) => e.startTime >= now)} />
    </>
  );
};

const EventCard = ({ title, events }) => (
  <Card>
    <Card.Header>{title}</Card.Header>
    <ListGroup>
      {events.map((e) => (
        <ListGroup.Item key={e.eventID} className="card-item" action href={`/events/${e.eventID}`}>
          {e.title}
          <br />
          <small>{new Date(e.startTime).toLocaleString()}</small>
        </ListGroup.Item>
      ))}
    </ListGroup>
  </Card>
);

export default Events;
