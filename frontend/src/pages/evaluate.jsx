import { Card, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react';

const Evaluate = () => {
  const [users, setUsers] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    // TODO: get users and sections from db
    setUsers([{
      userID: '0',
      sectionID: '3',
      name: 'Bryce Collard',
    },
    {
      userID: '1',
      sectionID: '4',
      name: 'Ethan Zimbelman',
    },
    {
      userID: '2',
      sectionID: '3',
      name: 'Andy Sazima',
    }]);
    setSections([{
      sectionID: '3',
      name: 'snare'
    },
    {
      sectionID: '4',
      name: 'trumpet'
    }]);
  }, []);

  return (
    <>
      <h1>
        Evaluate Member
      </h1>

      <SectionCards users={users} sections={sections} />
    </>
  );
}

const groupByProp = (xs, prop) => {
  var grouped = {};
  for (var i = 0; i < xs.length; i++) {
    var p = xs[i][prop];
    if (!grouped[p]) { grouped[p] = []; }
    grouped[p].push(xs[i]);
  }
  return grouped;
}

const SectionCards = ({users, sections}) => {
  const groupedUsers = groupByProp(users, 'sectionID');
  const sectionCards = sections.map((section, index) =>
    <Card key={section.sectionID}>
      <Card.Header className="card-header">{section.name}</Card.Header>
      <ListGroup>
        {groupedUsers[section.sectionID].map((user, index) =>
          <ListGroup.Item className="card-item" action href={`/evaluate/${user.userID}`} key={user.userID}>
            {user.name}
          </ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );

  return (
    <>{sectionCards}</>
  );
}

export default Evaluate;