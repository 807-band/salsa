import React from 'react';
import { useMsal } from '@azure/msal-react';
import {
  Button, Col, Container, Row,
} from 'react-bootstrap';
import { loginRequest } from './authConfig';

/**
 * Renders a drop down button with child buttons for logging in with a popup or redirect
 */
export default () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      console.log(e);
    });
  };

  return (
    <Container fluid>
      <Row>
        <Col className="login">
          <h1>Welcome to 807.band!</h1>
          Please sign in with your Cal Poly email address
          <br />
          <br />
          <Button onClick={() => handleLogin()}>
            Sign In
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
