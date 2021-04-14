import { ListGroup, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'
import { useState } from 'react'
import { useEffect } from 'react'

const EvaluateUser = () => {
  const uID = useParams().uID;
  const [stationProgress, setStationProgress] = useState(null);
  const [nextStation, setNextStation] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // TODO: get from db
    setStationProgress([{
      sID: 0,
      title: 'a passed station',
      class: 0,
      passed: 1,
    },
    {
      sID: 1,
      title: 'a station to do',
      class: 0,
      passed: 0,
    },
    {
      sID: 2,
      title: 'an advanced station',
      class: 1,
      passed: 0,
    }]);
    setNextStation({
      sID: 1,
      title: 'a station to do',
      class: 0,
      passed: 0,
      level: 1,
    });
    setUser({
      userID: uID,
      name: 'fake user',
    });
  }, [uID]);
  
  if(!stationProgress || !nextStation || !user)
    return "loading. . .";

  return (
    <>
      <h1>
        Evaluate {user.name}
      </h1>
      <StationCards data={stationProgress} nextStation={nextStation} uID={uID} />
    </>
   );
}

const StationCards = ({ data, nextStation, uID}) => {
  const beginnerStations = data.filter(station => station.class == 0);
  const advancedStations = data.filter(station => station.class == 1);

  const beginnerList = beginnerStations.map((s, index) =>
    <ListGroup.Item className={s.passed ? "card-item-passed" : s.passed == 0 ? "card-item-failed" : "card-item"} action href={`/evaluate/${uID}/${s.sID}`} key={s.ID}>
      {"Station " + (index + 1) + ": " + s.title}
      <Status station={s} nextStation={nextStation}/>
    </ListGroup.Item>
  );

  const advancedList = advancedStations.map((s, index) =>
    <ListGroup.Item className={s.passed ? "card-item-passed" : s.passed == 0 ? "card-item-failed" : "card-item"} as="button" action href={`/evaluate/${uID}/${s.sID}`} key={s.sID}>
      {"Station " + (index + 1) + ": " + s.title}
      <Status station={s} nextStation={nextStation}/>
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

const Status = ({ station, nextStation }) => {
   if(station.sID == nextStation.sID)
      return(
         <div className="status">Status: ready for evaluation</div>
      );
   else if(station.passed)
      return(
         <div className="status">Status: passed</div>
      );
   else
      return(
         <div className="status">Status: evaluate "Station {nextStation.level + 1}: {nextStation.title}" first</div>
      );
}

export default EvaluateUser;