import { Form, Card, ListGroup, Button } from "react-bootstrap"
import { useParams } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
import { Redirect } from 'react-router-dom';

const EvaluateUserStation = () => {
  const uID = useParams().uid;
  const sID = useParams().sid;
  const [user, setUser] = useState(null);
  const [station, setStation] = useState(null);
  const [switchMap, setSwitchMap] = useState({});
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    setUser({
      userID: uID,
      name: 'fake user',
    });
    setStation({
      sID: 1,
      title: 'a station to do',
      class: 0,
      passed: 0,
      groups: [
        {
          groupID: 0,
          title: 'grouping1',
          items: [{
            itemID: 999,
            item: 'item1',
          },
          {
            itemID: 998,
            item: 'item2',
          }],
        },
        {
          groupID: 1,
          title: 'grouping2',
          items: [{
            itemID: 997,
            item: 'item1',
          },
          {
            itemID: 996,
            item: 'item2',
          }],
        }
      ],
    });
  }, [uID, sID]);

  useEffect(() => {
    if(!station) return;
    const sm = {};
    for (var i = 0; i < station.groups.length; i++) {
      for (var j = 0; j < station.groups[i].items.length; j++) {
        sm[station.groups[i].items[j].itemID] = false;
      }
    }
    setSwitchMap(sm);
  }, [station]);
  
  if(!user || !station)
    return "loading. . .";

  return (
    <>
      { redirect ? (<Redirect push to={`/evaluate/${uID}`} />) : null}
      <h1>
        {user.name}
      </h1>
      <EvaluationForm station={station} switchMap={switchMap} setSwitchMap={setSwitchMap} setRedirect={setRedirect} />
    </>
  );
}

const EvaluationForm = ({ station, switchMap, setSwitchMap, setRedirect }) => {
  return (
    <Form onSubmit={onSubmitEvaluation(setRedirect, switchMap)}>
      {station.groups.map((group) => (
        <Card key={group.groupID}>
          <Card.Header>{group.title}</Card.Header>
          <ListGroup>
            {group.items.map((item) => (
              <ListGroup.Item key={item.itemID}>
                <Form.Group controlId={item.itemID}>
                  <Form.Switch className={item.required ? "required" : ""} onChange={changeSwitch(item.itemID, switchMap, setSwitchMap)} id={item.itemID} label={item.item} />
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
}

const changeSwitch = (id, switchMap, setSwitchMap) => () => {
  const sm = switchMap;
  sm[id] = !sm[id];
  setSwitchMap(sm);
}

const onSubmitEvaluation = (setRedirect, switchMap) => (event) => {
  event.preventDefault();
  // TODO: once we have user auth, the second userID will be the evaluatorID
  // for now, the user evaluates themselves ;)
  
  // TODO: push to db
  // await submitEvaluation(this.props.user.userID, this.props.station.sID, this.props.currentUser.userID, this.state.switchMap, this.props.station.maxFailed);
  setRedirect(true);
}

export default EvaluateUserStation;