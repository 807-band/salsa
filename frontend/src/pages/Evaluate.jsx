import { Card, ListGroup } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { getUsers } from '../lib/users';
import getSections from '../lib/sections';
import groupByProp from '../lib/util';

const Evaluate = () => {
  const [users, setUsers] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    getUsers().then((res) => {
      setUsers(res);
    });
    getSections().then((res) => {
      setSections(res);
    });
  }, []);

  return (
    <>
      <h1>
        Evaluate Member
      </h1>

      <SectionCards users={users} sections={sections} />
    </>
  );
};

const SectionCards = ({ users, sections }) => {
  // best effort at sorting by lastname, since full name is all in one attribute
  users.sort((a, b) => (a.name.split(' ').pop() > b.name.split(' ').pop() ? 1 : -1));
  const groupedUsers = groupByProp(users, 'sectionID');
  return sections.map((section) => (
    <Card key={section.sectionID}>
      <Card.Header className="card-header">{section.name}</Card.Header>
      <ListGroup>
        {groupedUsers[section.sectionID] && groupedUsers[section.sectionID].map((user) => (
          <ListGroup.Item className="card-item" action href={`/evaluate/${user.userID}`} key={user.userID}>
            {user.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  ));
};

export default Evaluate;
