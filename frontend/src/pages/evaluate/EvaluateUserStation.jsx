import {
  Form, Card, ListGroup, Button,
} from 'react-bootstrap';
import { useParams } from 'react-router';
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { getUser } from '../../lib/users';
import { getStationData } from '../../lib/stations';
import { submitEvaluation } from '../../lib/evaluations';
import { canEval } from '../../lib/util';

const EvaluateUserStation = ({ evaluator, evalStatus }) => {
  const uID = useParams().uid;
  const sID = useParams().sid;
  const [user, setUser] = useState(null);
  const [station, setStation] = useState(null);
  const [switchMap, setSwitchMap] = useState({});
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    getUser(uID).then((res) => setUser(res));
    getStationData(sID).then((res) => setStation(res));
  }, [uID, sID]);

  useEffect(() => {
    if (!station) return;
    const sm = {};
    for (let i = 0; i < station.groups.length; i += 1) {
      for (let j = 0; j < station.groups[i].items.length; j += 1) {
        sm[station.groups[i].items[j].itemID] = false;
      }
    }
    setSwitchMap(sm);
  }, [station]);

  if (!user || !station) return 'loading. . .';

  if (!canEval(station.class, station.level, evalStatus)) { return null; }

  return (
    <>
      { redirect ? (<Redirect push to={`/evaluate/${uID}`} />) : null}
      <h1>
        {user.name}
      </h1>
      <EvaluationForm
        station={station}
        switchMap={switchMap}
        setSwitchMap={setSwitchMap}
        setRedirect={setRedirect}
        uID={uID}
        sID={sID}
        evalID={evaluator.userID}
      />
    </>
  );
};

const EvaluationForm = ({
  station, switchMap, setSwitchMap, setRedirect, uID, sID, evalID,
}) => (
  <Form onSubmit={onSubmitEvaluation(uID, sID, evalID, switchMap, station.maxFailed, setRedirect)}>
    {station.groups.map((group) => (
      <Card key={group.groupID}>
        <Card.Header>{group.title}</Card.Header>
        <ListGroup>
          {group.items.map((item) => (
            <ListGroup.Item key={item.itemID}>
              <Form.Group controlId={item.itemID}>
                <Form.Switch className={item.required ? 'required' : ''} onChange={changeSwitch(item.itemID, switchMap, setSwitchMap)} id={item.itemID} label={item.item} />
              </Form.Group>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    ))}
    <br />
    <Button className="edit-button" type="submit">
      Submit Evaluation
    </Button>
  </Form>
);

const changeSwitch = (id, switchMap, setSwitchMap) => () => {
  const sm = switchMap;
  sm[id] = !sm[id];
  setSwitchMap(sm);
};

const onSubmitEvaluation = (
  uID, sID, evalID, switchMap, maxFailed, setRedirect,
) => async (event) => {
  event.preventDefault();
  await submitEvaluation(uID, sID, evalID, switchMap, maxFailed);
  setRedirect(true);
};

export default EvaluateUserStation;
