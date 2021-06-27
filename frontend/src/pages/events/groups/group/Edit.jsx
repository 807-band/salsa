import React, { useEffect, useState } from 'react';
import {
  Button, Card, Form, ListGroup, Modal,
} from 'react-bootstrap';
import { useParams } from 'react-router';
import { Redirect } from 'react-router-dom';
import { deleteGroup, editGroup, getGroupMembers } from '../../../../lib/groups';
import getSections from '../../../../lib/sections';
import { getUsers } from '../../../../lib/users';
import groupByProp from '../../../../lib/util';

const CreateGroup = () => {
  const [users, setUsers] = useState(null);
  const [sections, setSections] = useState(null);
  const [newGroupMembers, setNewGroupMembers] = useState(new Set());
  const [currGroupMembers, setCurrGroupMembers] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const params = useParams();

  useEffect(() => {
    getUsers().then((res) => setUsers(res));
    getSections().then((res) => setSections(res));
    getGroupMembers(params.id).then((res) => {
      setCurrGroupMembers(res.map((u) => u.userID));
      setGroupName(res[0].groupName);
      const temp = new Set(res.map((u) => u.userID));
      temp.delete(null);
      setNewGroupMembers(temp);
    });
  }, []);

  return currGroupMembers && currGroupMembers.length > 0 && users && sections && (
    <>
      {redirect && <Redirect push to={redirect} />}
      <h1>{`Edit Group: ${groupName}`}</h1>
      <Button variant="danger" className="edit-button" onClick={() => setShowDeleteModal(true)}>
        Delete Group
      </Button>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      >
        <Modal.Header className="danger-modal-header">
          <Modal.Title>
            {`WARNING: Are you sure you want to delete ${groupName}?`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{`Any "${groupName}" events will default to "Whole Band" events.`}</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => doDeleteGroup(params.id, setRedirect)}>
            Yes, I&apos;m sure
          </Button>
        </Modal.Footer>
      </Modal>

      <br />
      <Form onSubmit={handleSubmit(params.id, newGroupMembers, setRedirect)}>
        <Form.Group controlId="name">
          <Form.Label>Group Name</Form.Label>
          <Form.Control type="text" defaultValue={groupName} required />
        </Form.Group>

        <SectionCards
          users={users}
          sections={sections}
          newGroupMembers={newGroupMembers}
          setNewGroupMembers={setNewGroupMembers}
          currGroupMembers={currGroupMembers}
        />

        <br />

        <Button variant="primary" type="submit">
          Done
        </Button>
      </Form>
    </>
  );
};

const doDeleteGroup = async (groupID, setRedirect) => {
  await deleteGroup(groupID);
  setRedirect('/events/groups');
};

const handleSubmit = (groupID, newGroupMembers, setRedirect) => async (event) => {
  const form = event.currentTarget;
  event.preventDefault();
  await editGroup(groupID, form.name.value, Array.from(newGroupMembers));
  setRedirect(`/events/groups/${groupID}`);
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
  users, sections, newGroupMembers, setNewGroupMembers, currGroupMembers,
}) => {
  const groupedUsers = groupByProp(users, 'sectionID');
  return sections.map((section) => (
    <Card key={section.sectionID}>
      <Card.Header className="card-header">{section.name}</Card.Header>
      <ListGroup>
        {groupedUsers[section.sectionID] && groupedUsers[section.sectionID].map((user) => (
          <ListGroup.Item className="card-item" key={user.userID}>
            <Form.Check defaultChecked={currGroupMembers.includes(user.userID)} key={user.userID} type="checkbox" label={user.name} onClick={() => doCheckUser(user.userID, newGroupMembers, setNewGroupMembers)} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  ));
};

export default CreateGroup;
