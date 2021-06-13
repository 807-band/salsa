import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Card, ListGroup } from 'react-bootstrap';
import { getAttendanceByUser } from '../../../lib/attendance';
import { getUser } from '../../../lib/users';
import { getEvents } from '../../../lib/events';
import { getGroupsByUser } from '../../../lib/groups';

const UserAttendance = () => {
  const userID = useParams().id;
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [events, setEvents] = useState(null);
  const now = new Date().toISOString();

  useEffect(() => {
    getUser(userID).then((res) => setUser(res));
    getAttendanceByUser(userID).then((res) => setAttendance(res));
  }, []);

  useEffect(() => {
    getEvents().then(async (res) => {
      if (!user) return;
      const userGroups = await getGroupsByUser(user.userID);
      // get only events that are required for this user
      const userEvents = res.filter((e) => e.groupID === null
        || userGroups.find((g) => g.groupID === e.groupID));
      userEvents.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      setEvents(userEvents);
    });
  }, [user]);

  return user && events && (
    <>
      <h1>{`Attendance: ${user.name}`}</h1>
      <EventCard title="upcoming events" events={events.filter((e) => e.startTime >= now)} attendance={attendance} />
      <EventCard title="past events" events={events.filter((e) => e.startTime < now)} attendance={attendance} />
    </>
  );
};

const evalTardy = (timeArrived, tardyTime) => {
  const tardyDate = new Date(tardyTime);
  const timeArrivedParts = timeArrived.split(':');
  if (parseInt(timeArrivedParts[0], 10) > tardyDate.getHours()) return true;
  if (parseInt(timeArrivedParts[0], 10) === tardyDate.getHours()
    && parseInt(timeArrivedParts[1], 10) > tardyDate.getMinutes()) return true;
  return false;
};

const EventCard = ({ title, events, attendance }) => (
  <Card>
    <Card.Header>{title}</Card.Header>
    <ListGroup>
      {events.map((e) => {
        const eventAttendance = attendance.find((a) => a.eventID === e.eventID);
        if (eventAttendance) {
          const isTardy = evalTardy(eventAttendance.timeArrived, e.tardyTime);
          const textStyle = isTardy ? { color: 'orange' } : { color: 'green' };
          return (
            <ListGroup.Item key={e.eventID} className="card-item" action href={`/events/${e.eventID}`} style={textStyle}>
              {e.title}
              <br />
              {isTardy
                ? <small>{`TARDY -- arrived: ${eventAttendance.timeArrived}`}</small>
                : <small>{`ON TIME -- arrived: ${eventAttendance.timeArrived}`}</small>}
            </ListGroup.Item>
          );
        }
        return (
          <ListGroup.Item key={e.eventID} className="card-item" action href={`/events/${e.eventID}`} style={{ color: 'red' }}>
            {e.title}
            <br />
            <small>not attended</small>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  </Card>
);

export default UserAttendance;
