import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { createInfoTab, deleteInfoTab, putInformation } from '../lib/stations';

const StationInfo = ({ id, pageData, isAdmin }) => {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(pageData);

  if (!editing) {
    return (
      <>
        {isAdmin
        && (
        <>
          <Button className="edit-button" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Link to={`/stations/${id}`}>
            <Button variant="secondary" className="edit-button">
              Back
            </Button>
          </Link>
          <br />
        </>
        )}
        {content.map((c) => (
          <Card key={c.packetID}>
            <Card.Header className="card-header" />
            <Card.Body>
              <Card.Text className="multiline-text">{c.content}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </>
    );
  }

  return (
    <>
      <Button variant="secondary" className="edit-button" onClick={() => setEditing(false)}>
        Done Editing
      </Button>
      <br />
      <div id="info-cards">{content.map((c) => <EditCard key={c.packetID} numCards={content.length} c={c} content={content} setContent={setContent} id={id} />)}</div>
      <br />
      <Button onClick={() => addCard(content, setContent, id)}>Add Card</Button>
    </>
  );
};

const EditCard = ({
  c, numCards, content, setContent, id,
}) => (
  <Form onSubmit={saveInfo(content, setContent, id)} info-key={c.packetID} key={c.packetID}>
    <Card>
      <Card.Header className="card-header" />
      <Card.Body>
        <Card.Text className="multiline-text">
          <Form.Control id="text" defaultValue={c.content} as="textarea" rows="20" maxLength="4000" />
        </Card.Text>
      </Card.Body>
    </Card>
    <Button type="submit">Save Card</Button>
    {numCards > 1 && <Button variant="danger" onClick={() => deleteCard(c.packetID, content, setContent)}>Delete Card</Button>}
  </Form>
);

const addCard = async (content, setContent, id) => {
  // relies on having at least one on the page
  const { role } = content[0];
  const { info } = content[0];

  const cardInfo = await createInfoTab(id, role, info);
  setContent([...content, cardInfo]);
};

const deleteCard = (packetID, content, setContent) => {
  deleteInfoTab(packetID);
  setContent(content.filter((c) => c.packetID !== packetID));
};

const saveInfo = (content, setContent, id) => (event) => {
  event.preventDefault();
  const infoID = event.target.getAttribute('info-key');
  const newText = event.currentTarget.text.value;
  const newContent = content;
  newContent.forEach((c) => {
    if (c.packetID.toString() === infoID) {
      // eslint-disable-next-line no-param-reassign
      c.content = newText;
    }
  });
  setContent(newContent);
  putInformation(id, infoID, newText);
};

export default StationInfo;
