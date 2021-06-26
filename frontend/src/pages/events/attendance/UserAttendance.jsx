import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Card, ListGroup } from 'react-bootstrap';
import { getAttendanceByUser } from '../../../lib/attendance';
import { getUser } from '../../../lib/users';
import { getEventMembers, getEvents } from '../../../lib/events';

const UserAttendance = () => {
  const userID = useParams().id;
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [memberEvents, setMemberEvents] = useState(null);
  const now = new Date().toISOString();

  useEffect(() => {
    getUser(userID).then((res) => setUser(res));
    getAttendanceByUser(userID).then((res) => setAttendance(res));
  }, []);

  useEffect(() => {
    getEvents().then(async (evs) => {
      if (!user) return;
      computeMemberEvents(evs).then((res) => setMemberEvents(res));
    });
  }, [user]);

  const computeMemberEvents = async (evs) => {
    const temp = await Promise.all(evs.map(async (e) => {
      const eventMembers = await getEventMembers(e.eventID);
      if (eventMembers.find((m) => m.userID === parseInt(userID, 10)) !== undefined) {
        return e;
      }
      return null;
    }));
    return temp.filter((e) => e !== null);
  };

  return user && memberEvents && (
    <>
      <h1>{`Attendance: ${user.name}`}</h1>
      <EventCard title="upcoming events" events={memberEvents.filter((e) => e.startTime >= now)} attendance={attendance} userID={userID} />
      <EventCard title="past events" events={memberEvents.filter((e) => e.startTime < now)} attendance={attendance} userID={userID} />
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

const EventCard = ({
  title, events, attendance,
}) => (
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
