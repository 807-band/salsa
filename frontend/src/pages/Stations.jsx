import { Card, Button, ListGroup } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { getStations } from '../lib/stations';

const Stations = ({ isAdmin }) => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    getStations().then((s) => setStations(s));
  }, []);

  console.log(stations);

  return (
    <>
      <h1>
        Stations
        {isAdmin ? (
          <Button variant="primary" className="edit-button" href="/stations/edit">
            Edit Order
          </Button>
        ) : null}
      </h1>

      <StationCards stations={stations} />
    </>
  );
};

const StationCards = ({ stations }) => {
  const beginnerStations = stations.filter((station) => station.class === 0);
  const advancedStations = stations.filter((station) => station.class === 1);

  const beginnerList = beginnerStations.map((s, index) => (
    <ListGroup.Item key={s.sID} className="card-item" action href={`/stations/${s.sID}`}>
      {`Station ${index + 1}: ${s.title}`}
    </ListGroup.Item>
  ));

  const advancedList = advancedStations.map((s, index) => (
    <ListGroup.Item key={s.sID} className="card-item" action href={`/stations/${s.sID}`}>
      {`Station ${index + 1}: ${s.title}`}
    </ListGroup.Item>
  ));

  return (
    <>
      <Card>
        <Card.Header>Beginner</Card.Header>
        <ListGroup>
          {beginnerList}
        </ListGroup>
      </Card>
      <br />
      <Card>
        <Card.Header>Advanced</Card.Header>
        <ListGroup>
          {advancedList}
        </ListGroup>
      </Card>
    </>
  );
};

export default Stations;
