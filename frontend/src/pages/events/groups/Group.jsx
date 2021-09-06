import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';
import { useParams } from 'react-router';
import { getGroupMembers } from '../../../lib/groups';
import getSections from '../../../lib/sections';
import { groupByProp } from '../../../lib/util';

const Group = () => {
  const [members, setMembers] = useState(null);
  const [sections, setSections] = useState(null);
  const params = useParams();

  useEffect(() => {
    getGroupMembers(params.id).then((res) => setMembers(res));
    getSections().then((res) => setSections(res));
  }, []);

  return members && members.length > 0 && sections && (
    <>
      <h1>
        {members[0].groupName}
        <Button variant="primary" className="edit-button" href={`/events/groups/${params.id}/edit`}>
          Edit
        </Button>
      </h1>

      <SectionCards users={members} sections={sections} />
    </>
  );
};

const SectionCards = ({ users, sections }) => {
  const groupedUsers = groupByProp(users, 'sectionID');
  return sections.map((section) => (
    <Card key={section.sectionID}>
      <Card.Header className="card-header">{section.name}</Card.Header>
      <ListGroup>
        {groupedUsers[section.sectionID] && groupedUsers[section.sectionID].map((user) => (
          <ListGroup.Item className="card-item" key={user.userID}>
            {user.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  ));
};

export default Group;
