import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';
import { getGroupNames } from '../../lib/groups';

const Groups = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    getGroupNames().then((res) => setGroups(res));
  }, []);

  return (
    <>
      <Button variant="primary" className="edit-button" href="/events/groups/create">
        New Group
      </Button>
      <br />
      <Card>
        <Card.Header>Groups</Card.Header>
        <ListGroup>
          {groups.map((g) => (
            <ListGroup.Item key={g.groupID} className="card-item" action href={`/events/groups/${g.groupID}`}>
              {g.groupName}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </>
  );
};

export default Groups;
