/* eslint-disable no-nested-ternary */
import { ListGroup, Card } from 'react-bootstrap';
import { useParams } from 'react-router';
import React, { useState, useEffect } from 'react';
import { getUserProgress, getUserNextStation } from '../../lib/evaluations';
import { getUser } from '../../lib/users';
import { canEval } from '../../lib/util';

const EvaluateUser = ({ evalStatus }) => {
  const uID = useParams().uid;
  const [stationProgress, setStationProgress] = useState(null);
  const [nextStation, setNextStation] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserProgress(uID).then((res) => setStationProgress(res));
    getUserNextStation(uID).then((res) => setNextStation(res));
    getUser(uID).then((res) => setUser(res));
  }, [uID]);

  if (!stationProgress || !nextStation || !user) return 'loading. . .';

  return (
    <>
      <h1>
        Evaluate
        {' '}
        {user.name}
      </h1>
      <StationCards
        data={stationProgress}
        nextStation={nextStation}
        uID={uID}
        evalStatus={evalStatus}
      />
    </>
  );
};

const StationCards = ({
  data, nextStation, uID, evalStatus,
}) => {
  const beginnerStations = data.filter((station) => station.class === 0);
  const advancedStations = data.filter((station) => station.class === 1);

  const beginnerList = beginnerStations.map((s, index) => {
    if (!canEval(s.class, s.level, evalStatus)) { return null; }
    return (
      <ListGroup.Item className={s.passed ? 'card-item-passed' : s.passed === 0 ? 'card-item-failed' : 'card-item'} action href={`/evaluate/${uID}/${s.sID}`} key={s.sID}>
        {`Station ${index + 1}: ${s.title}`}
        <Status station={s} nextStation={nextStation} />
      </ListGroup.Item>
    );
  });

  const advancedList = advancedStations.map((s, index) => {
    if (!canEval(s.class, s.level, evalStatus)) { return null; }
    return (
      <ListGroup.Item className={s.passed ? 'card-item-passed' : s.passed === 0 ? 'card-item-failed' : 'card-item'} action href={`/evaluate/${uID}/${s.sID}`} key={s.sID}>
        {`Station ${index + 1}: ${s.title}`}
        <Status station={s} nextStation={nextStation} />
      </ListGroup.Item>
    );
  });

  return (
    <>
      <Card>
        <Card.Header>Beginner</Card.Header>
        <ListGroup>
          {beginnerList}
        </ListGroup>
      </Card>
      <br />
      {evalStatus === 'eval' && (
      <Card>
        <Card.Header>Advanced</Card.Header>
        <ListGroup>
          {advancedList}
        </ListGroup>
      </Card>
      )}
    </>
  );
};

const Status = ({ station, nextStation }) => {
  if (station.sID === nextStation.sID) {
    return (
      <div className="status">Status: ready for evaluation</div>
    );
  }
  if (station.passed) {
    return (
      <div className="status">Status: passed</div>
    );
  }
  return (
    <div className="status">
      Status: evaluate &quot;Station
      {nextStation.level + 1}
      :
      {nextStation.title}
      &quot; first
    </div>
  );
};

export default EvaluateUser;
