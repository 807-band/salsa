import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Button, Card, Form, ListGroup, Col, Row,
} from 'react-bootstrap';
import {
  deleteSub, getEvent, getEventMembers, postSub,
} from '../../lib/events';
import { putAttendance, getAttendanceByEvent } from '../../lib/attendance';
import { getGroupMembers } from '../../lib/groups';
import groupByProp from '../../lib/util';
import { getUsers } from '../../lib/users';

const Event = ({ isAdmin }) => {
  const [event, setEvent] = useState(null);
  const [currFile, setCurrFile] = useState(null);
  const [group, setGroup] = useState(null);
  const [eventMembers, setEventMembers] = useState(null);
  const [message, setMessage] = useState(null);
  const [attendance, setAttendance] = useState([]);
  // id of member being subbed, null otherwise
  const [subbing, setSubbing] = useState(null);
  const [possibleSubs, setPossibleSubs] = useState(null);
  const params = useParams();

  useEffect(() => {
    getEvent(params.id).then((res) => {
      setEvent(res);
      if (res.groupID) {
        getGroupMembers(res.groupID).then((g) => {
          setGroup(g[0].groupName);
        });
      } else {
        setGroup('Whole Band');
      }
    });
    getEventMembers(params.id).then((res) => setEventMembers(res));
    getAttendanceByEvent(params.id).then((res) => setAttendance(res));
  }, []);

  return event && eventMembers && (
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
      <Attendance
        eventID={event.eventID}
        attendance={attendance}
        eventMembers={eventMembers}
        tardyTime={event.tardyTime}
        subbing={subbing}
        setSubbing={setSubbing}
        possibleSubs={possibleSubs}
        setPossibleSubs={setPossibleSubs}
        group={group}
      />
      <br />
      <hr />
      <br />
      Upload attendance (this overrides current attendance, and the email list will be notified!)
      <br />
      <Form onSubmit={submitAttendance(event.eventID, currFile, setMessage)}>
        <Form.Group controlId="file" onChange={(e) => setCurrFile(e.target.files[0])}>
          <Form.File id="formcheck-api-custom" custom>
            <Form.File.Input isValid={message === 'Success'} isInvalid={message !== 'Success' && message !== null} />
            <Form.File.Label>
              {currFile ? currFile.name : 'Choose a file'}
            </Form.File.Label>
            <Form.Control.Feedback type="valid">Success! Refresh to view changes.</Form.Control.Feedback>
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

const evalTardy = (timeArrived, tardyTime) => {
  const tardyDate = new Date(tardyTime);
  const timeArrivedParts = timeArrived.split(':');
  if (parseInt(timeArrivedParts[0], 10) > tardyDate.getHours()) return true;
  if (parseInt(timeArrivedParts[0], 10) === tardyDate.getHours()
    && parseInt(timeArrivedParts[1], 10) > tardyDate.getMinutes()) return true;
  return false;
};

const getPossibleSubs = async (eventMembers, section) => {
  // get all members
  const allMembers = await getUsers();
  // remove members that are already attending
  const possibleSubs = allMembers.filter(
    (m) => !eventMembers.some((em) => em.userID === m.userID),
  );
  // subs should be in the same section...
  return possibleSubs.filter((ps) => ps.section === section);
};

const submitSub = (eventID, oldUserID, possibleSubs) => (event) => {
  const sub = possibleSubs.find((s) => s.name === event.currentTarget.newUserID.value);
  postSub(eventID, oldUserID, sub.userID);
};

const SubForm = ({
  eventID, oldUserID, subbing, setSubbing, eventMembers, possibleSubs, setPossibleSubs, section,
}) => {
  if (subbing !== oldUserID) {
    return (
      <Button className="edit-button" onClick={() => setSubbing(oldUserID)}>
        Substitute
      </Button>
    );
  }
  if (!possibleSubs) getPossibleSubs(eventMembers, section).then((ps) => setPossibleSubs(ps));
  if (!possibleSubs || possibleSubs.length === 0) {
    return <>no available subs</>;
  }
  return (
    <Form onSubmit={submitSub(eventID, oldUserID, possibleSubs)}>
      <Form.Group controlId="newUserID">
        <Form.Control type="text" required as="select">
          {possibleSubs
            .map((s) => <option key={s.userID}>{s.name}</option>)}
        </Form.Control>
      </Form.Group>
      <Button className="edit-button" type="submit">
        Confirm
      </Button>
    </Form>
  );
};

const RemoveSubForm = ({ eventID, oldUserID }) => (
  <Form onSubmit={() => deleteSub(eventID, oldUserID)}>
    <Button className="edit-button" type="submit">
      Remove Sub
    </Button>
  </Form>
);

const Attendance = ({
  eventID, attendance, eventMembers, tardyTime, subbing,
  setSubbing, possibleSubs, setPossibleSubs, group,
}) => {
  // best effort at sorting by lastname, since full name is all in one attribute
  eventMembers.sort((a, b) => (a.name.split(' ').pop() > b.name.split(' ').pop() ? 1 : -1));
  const attendanceBySection = groupByProp(attendance, 'section');
  const eventMembersBySection = groupByProp(eventMembers, 'section');
  return Object.keys(eventMembersBySection).map((section) => (
    <Card key={section}>
      <Card.Header className="card-header">{section}</Card.Header>
      <ListGroup>
        {eventMembersBySection[section].map((user) => {
          if (attendanceBySection[section]) {
            const userAttendance = attendanceBySection[section]
              .find((u) => u.userID === user.userID);
            if (userAttendance) {
              const isTardy = evalTardy(userAttendance.timeArrived, tardyTime);
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
                    {group !== 'Whole Band'
                    && (
                      <Col sm={4} md={3} xl={2}>
                        {user.oldUserID
                          ? <RemoveSubForm eventID={eventID} oldUserID={user.oldUserID} />
                          : (
                            <SubForm
                              eventID={eventID}
                              oldUserID={user.userID}
                              subbing={subbing}
                              setSubbing={setSubbing}
                              eventMembers={eventMembers}
                              possibleSubs={possibleSubs}
                              setPossibleSubs={setPossibleSubs}
                              section={section}
                            />
                          )}
                      </Col>
                    )}
                  </Row>
                </ListGroup.Item>
              );
            }
          }
          // no record of arrival for this section or user OR no attendance at all
          const textStyle = attendance.length > 0 ? { color: 'red' } : { color: 'black' };
          return (
            <ListGroup.Item className="card-item" key={user.userID} style={textStyle}>
              <Row>
                <Col>
                  {user.name}
                  {user.oldUserID && ` (subbing for ${user.oldName})`}
                  <br />
                  {attendance.length > 0
                    && <small>ABSENT</small>}
                </Col>
                {group !== 'Whole Band'
                && (
                  <Col sm={4} md={3} xl={2}>
                    {user.oldUserID
                      ? <RemoveSubForm eventID={eventID} oldUserID={user.oldUserID} />
                      : (
                        <SubForm
                          eventID={eventID}
                          oldUserID={user.userID}
                          subbing={subbing}
                          setSubbing={setSubbing}
                          eventMembers={eventMembers}
                          possibleSubs={possibleSubs}
                          setPossibleSubs={setPossibleSubs}
                          section={section}
                        />
                      )}
                  </Col>
                )}
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  ));
};

const submitAttendance = (id, file, setMessage) => async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const data = new FormData();
  data.append('file', file);
  const res = await putAttendance(id, data);
  setMessage(res.message);
};

export default Event;
