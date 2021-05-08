import { Card, ListGroup } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { getUsers } from '../lib/users';
import getSections from '../lib/sections';

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

const groupByProp = (xs, prop) => {
  const grouped = {};
  for (let i = 0; i < xs.length; i += 1) {
    const p = xs[i][prop];
    if (!grouped[p]) { grouped[p] = []; }
    grouped[p].push(xs[i]);
  }
  return grouped;
};

const SectionCards = ({ users, sections }) => {
  const groupedUsers = groupByProp(users, 'sectionID');
  return sections.map((section) => (
    <Card key={section.sectionID}>
      <Card.Header className="card-header">{section.name}</Card.Header>
      <ListGroup>
        {groupedUsers[section.sectionID].map((user) => (
          <ListGroup.Item className="card-item" action href={`/evaluate/${user.userID}`} key={user.userID}>
            {user.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  ));
};

export default Evaluate;
