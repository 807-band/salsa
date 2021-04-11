import { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const StationInfo = ({ id, pageData, isAdmin }) => {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(pageData);

  if (!editing) {
    return (
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
        {content.map(c =>
          <Card key={c.packetID}>
            <Card.Header className="card-header"></Card.Header>
            <Card.Body>
              <Card.Text className="multiline-text">{c.content}</Card.Text>
            </Card.Body>
          </Card>)}
      </>
    );
  }

  return (
    <>
      <Button variant="secondary" className="edit-button" onClick={() => setEditing(false)}>
        Done Editing
      </Button>
      <br />
      <div id="info-cards">{content.map(c => <EditCard key={c.packetID} c={c} content={content} setContent={setContent} id={id} />)}</div>
      <br />
      <Button onClick={() => addCard(content, setContent, id)}>Add Card</Button>
    </>
  );
}

const EditCard = ({ c, content, setContent, id }) => (
  <Form onSubmit={saveInfo(content, setContent, id)} info-key={c.packetID} key={c.packetID}>
    <Card>
      <Card.Header className="card-header"></Card.Header>
      <Card.Body>
        <Card.Text className="multiline-text">
          <Form.Control id="text" defaultValue={c.content} as="textarea" rows="20" maxLength="4000" />
        </Card.Text>
      </Card.Body>
    </Card>
    <Button type="submit">Save</Button>
  </Form>
);

const addCard = (content, setContent, id) => {
  const stationID = id;
  // relies on having at least one on the page
  const role = content[0].role;
  const info = content[0].info;

  // TODO: used to be this
  // const cardInfo = await createInfoTab(stationID, role, info);
  const cardInfo = {
    role: role,
    info: info,
    packetID: Math.random(),
  }
  setContent([...content, cardInfo]);
}

const saveInfo = (content, setContent, id) => (event) => {
  event.preventDefault();
  const infoID = event.target.getAttribute('info-key');
  const newText = event.currentTarget.text.value;
  const newContent = content;
  newContent.forEach((c) => {
    if(c.packetID == infoID) {
      c.content = newText;
    }
  });
  setContent(newContent);
}

export default StationInfo;