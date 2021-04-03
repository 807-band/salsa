import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'

const CreateStation = (props) => {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    }
    else
      // TODO: post station to DB
      // postStation(form.title.value, form.description.value, form.rank.value == "beginner" ? 0 : 1).then(setValidated(true));
      setValidated(true);
  };

  return (
    <>
      <h1>
        Create Station
      </h1>
      <br />

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Station Title</Form.Label>
          <Form.Control type="text" placeholder="Title" required />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" placeholder="Description" />
        </Form.Group>

        <Form.Group controlId="rank">
          <Form.Label>Rank</Form.Label>
          <Form.Control type="text" required as="select">
            <option></option>
            <option>beginner</option>
            <option>advanced</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  )
}

export default CreateStation;