import { Card, Button, ListGroup } from 'react-bootstrap'
import { useEffect, useState } from 'react'

const Stations = ({ isAdmin }) => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    // TODO: get stations from DB here
    const tempFakeStations = [{
      _id: 123,
      title: "a beginner station",
      level: "beginner",
    },
    {
      _id: 456,
      title: "an advanced station",
      level: "advanced",
    },
    {
      _id: 789,
      title: "another beginner station",
      level: "beginner",
    }];
    setStations(tempFakeStations);
  }, []);


  return (
    <>
      <h1>
        Stations
        {isAdmin ? <Button variant="primary" className="edit-button" href="/stations/edit">
          Edit Order
        </Button> : null}
      </h1>

      <StationCards stations={stations} />
    </>
  )
}

const StationCards = ({ stations }) => {
  const beginnerStations = stations.filter(station => station.level === "beginner");
  const advancedStations = stations.filter(station => station.level === "advanced");

  const beginnerList = beginnerStations.map((s, index) =>
    <ListGroup.Item key={s._id} className="card-item" action href={`/stations/${s._id}`}>
      {"Station " + (index + 1) + ": " + s.title}
    </ListGroup.Item>
  );

  const advancedList = advancedStations.map((s, index) =>
    <ListGroup.Item key={s._id} className="card-item" action href={`/stations/${s._id}`}>
      {"Station " + (index + 1) + ": " + s.title}
    </ListGroup.Item>
  );

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
}

export default Stations;