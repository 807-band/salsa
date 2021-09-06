import React, { useEffect, useState } from 'react';
import {
  Button,
  Card, Col, Form, ListGroup, Row,
} from 'react-bootstrap';
import { useLocation, useParams } from 'react-router';
import { Link } from 'react-router-dom';
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
  <>
    <Form onSubmit={submitSectionAttendance}>
      <Card>
        <Card.Header className="card-header">{section}</Card.Header>
        <ListGroup>
          {members.map((user) => {
            let status = null;
            if (attendance) {
              const userAttendance = attendance.find((u) => u.userID === user.userID);
              if (userAttendance) {
                const isTardy = evalTardy(userAttendance.timeArrived, event.tardyTime);
                status = isTardy ? 'tardy' : 'ontime';
              }
            }
            // no record of arrival for this section or user OR no attendance at all
            if (!status) {
              status = isSubmitted ? 'absent' : null;
            }
            return (
              <ListGroup.Item className="card-item" key={user.userID}>
                <Row>
                  <Col>
                    {user.name}
                    {user.oldUserID && ` (subbing for ${user.oldName})`}
                  </Col>
                  <Col>
                    <Form.Check inline type="radio" label="on time" name={user.userID} id={`${user.userID}-ontime`} defaultChecked={status === 'ontime'} />
                    <Form.Check inline type="radio" label="tardy" name={user.userID} id={`${user.userID}-tardy`} defaultChecked={status === 'tardy'} />
                    <Form.Check inline type="radio" label="absent" name={user.userID} id={`${user.userID}-absent`} defaultChecked={status === 'absent'} />
                  </Col>
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Card>
      <Button type="submit" className="edit-button">
        Submit
      </Button>
    </Form>
    <Link to={`/events/${eventID}`}>
      <Button variant="secondary" className="edit-button">Back</Button>
    </Link>
  </>
  );
};

const submitSectionAttendance = (event) => {
  const form = event.currentTarget;
  event.preventDefault();
  console.log(form);
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
