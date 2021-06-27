import React, { useEffect, useState } from 'react';
import {
  Button, Card, Form, ListGroup,
} from 'react-bootstrap';
import { createGroup } from '../../../lib/groups';
import getSections from '../../../lib/sections';
import { getUsers } from '../../../lib/users';
import groupByProp from '../../../lib/util';

const CreateGroup = () => {
  const [users, setUsers] = useState(null);
  const [sections, setSections] = useState(null);
  const [newGroupMembers, setNewGroupMembers] = useState(new Set());

  useEffect(() => {
    getUsers().then((res) => setUsers(res));
    getSections().then((res) => setSections(res));
  }, []);

  return users && sections && (
    <>
      <h1>Create Group</h1>
      <br />
      <Form onSubmit={handleSubmit(newGroupMembers)}>
        <Form.Group controlId="name">
          <Form.Label>Group Name</Form.Label>
          <Form.Control type="text" placeholder="Name" required />
        </Form.Group>

        <SectionCards
          users={users}
          sections={sections}
          newGroupMembers={newGroupMembers}
          setNewGroupMembers={setNewGroupMembers}
        />

        <br />

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

const handleSubmit = (newGroupMembers) => async (event) => {
  const form = event.currentTarget;
  await createGroup(form.name.value, Array.from(newGroupMembers));
};

const doCheckUser = (userID, newGroupMembers, setNewGroupMembers) => {
  if (newGroupMembers.has(userID)) {
    newGroupMembers.delete(userID);
  } else {
    newGroupMembers.add(userID);
  }
  setNewGroupMembers(newGroupMembers);
};

const SectionCards = ({
  users, sections, newGroupMembers, setNewGroupMembers,
}) => {
  const groupedUsers = groupByProp(users, 'sectionID');
  return sections.map((section) => (
    <Card key={section.sectionID}>
      <Card.Header className="card-header">{section.name}</Card.Header>
      <ListGroup>
        {groupedUsers[section.sectionID] && groupedUsers[section.sectionID].map((user) => (
          <ListGroup.Item className="card-item" key={user.userID}>
            <Form.Check key={user.userID} type="checkbox" label={user.name} onClick={() => doCheckUser(user.userID, newGroupMembers, setNewGroupMembers)} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  ));
};

export default CreateGroup;
