import React from 'react';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';

const StationInfoLinks = ({ id }) => (
  <>
    <h3>Station Information</h3>
    <Container>
      <Row>
        <Col>
          <Link to={`/stations/${id}/instructor/setup`}>
            Instructor Setup
          </Link>
        </Col>
        <Col>
          <Link to={`/stations/${id}/instructor/script`}>
            Instructor Script
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <Link to={`/stations/${id}/evaluator/setup`}>
            Evaluator Setup
          </Link>
        </Col>
        <Col>
          <Link to={`/stations/${id}/evaluator/script`}>
            Evaluator Script
          </Link>
        </Col>
      </Row>
    </Container>
  </>
);

export default StationInfoLinks;
