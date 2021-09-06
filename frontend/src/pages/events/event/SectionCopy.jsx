import React, { useEffect, useState } from 'react';
import {
  Card, Col, ListGroup, Row,
} from 'react-bootstrap';
import { useLocation, useParams } from 'react-router';
import { getEvent } from '../../../lib/events';

const SectionAttendance = () => {
  const params = useParams();
  const location = useLocation();
  if (!location.state) {
    return null;
  }
  const { members, attendance, isSubmitted } = location.state;
  const { section } = params;
  const eventID = params.id;

  const [event, setEvent] = useState(null);

  useEffect(() => {
    getEvent(eventID).then((res) => {
      setEvent(res);
    });
  }, [eventID]);

  return event && (
    <Card>
      <Card.Header className="card-header">{section}</Card.Header>
      <ListGroup>
        {members.map((user) => {
          if (attendance) {
            const userAttendance = attendance
              .find((u) => u.userID === user.userID);
            if (userAttendance) {
              const isTardy = evalTardy(userAttendance.timeArrived, event.tardyTime);
              const textStyle = isTardy ? { color: 'orange' } : { color: 'green' };
              return (
                <ListGroup.Item className="card-item" key={user.userID} style={textStyle}>
                  <Row>
                    <Col>
                      {user.name}
                      {user.oldUserID && ` (subbing for ${user.oldName})`}
                      <br />
                      {isTardy
                        ? <small>{`TARDY -- arrived: ${userAttendance.timeArrived}`}</small>
                        : <small>{`ON TIME -- arrived: ${userAttendance.timeArrived}`}</small>}
                    </Col>
                  </Row>
                </ListGroup.Item>
              );
            }
          }
          // no record of arrival for this section or user OR no attendance at all
          const textStyle = isSubmitted ? { color: 'red' } : { color: 'black' };
          return (
            <ListGroup.Item className="card-item" key={user.userID} style={textStyle}>
              <Row>
                <Col>
                  {user.name}
                  {user.oldUserID && ` (subbing for ${user.oldName})`}
                  <br />
                  {isSubmitted && <small>ABSENT</small>}
                </Col>
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
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

export default SectionAttendance;
