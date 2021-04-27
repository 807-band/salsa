/* eslint-disable no-param-reassign */
import ListGroup from 'react-bootstrap/ListGroup';
import {
  Row, Col, Button, Form, Modal, Card,
} from 'react-bootstrap';
import { Link, useParams, Redirect } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import StationInfo from '../../../components/StationInfoLinks';
import StationInfoJumbo from '../../../components/StationInfoJumbo';
import {
  getStationData,
  postGrouping, putGrouping, deleteGrouping,
  postItem, putItem, deleteItem,
} from '../../../lib/stations';

const EditStation = () => {
  const params = useParams();

  const [state, setState] = useState({
    stationData: null,
    addingGrouping: false,
    addItemTo: null,
    showModal: null,
    showDeleteStationModal: false,
    requiredClicked: false,
    editRequiredClicked: false,
    groupingTitleChange: null,
    itemChange: null,
    redirect: false,
  });

  useEffect(() => {
    getStationData(params.id)
      .then((stationData) => setState({ ...state, stationData }));
  }, [params.id]);

  if (!state.stationData) return <>loading...</>;

  return (
    <>
      { state.redirect ? (<Redirect push to="/stations" />) : null}
      <Link to={`/stations/${state.stationData.sID}`}>
        <Button variant="primary" type="submit" className="edit-station-button">
          Done
        </Button>
      </Link>
      <StationInfoJumbo stationData={state.stationData} edit="true" />
      <StationInfo id={state.stationData.id} />
      <GroupingCards state={state} setState={setState} />

      <br />

      <AddGrouping state={state} setState={setState} />

      <br />
      <br />
      <br />

      <Button variant="danger" className="edit-button" onClick={() => switchShowDeleteStationModal(state, setState)}>
        Delete Station
      </Button>

      <Modal
        show={state.showDeleteStationModal}
        onHide={() => switchShowDeleteStationModal(state, setState)}
      >
        <Modal.Header className="danger-modal-header">
          <Modal.Title>
            WARNING: Are you sure you want to delete
            {state.stationData.title}
            ?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>All its groupings and items will be deleted with it. THIS IS FINAL.</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => switchShowDeleteStationModal(state, setState)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => deleteStation(state, setState)}>
            Yes, I&apos;m sure
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const GroupingCards = ({ state, setState }) => {
  const groupCards = state.stationData.groups.map((g) => (
    <Card key={g.groupID}>
      <Card.Header className="card-header">
        <GroupingTitle state={state} setState={setState} g={g} />
      </Card.Header>
      <ListGroup>
        <GroupList state={state} setState={setState} grouping={g} />
      </ListGroup>
      <Modal
        show={state.showModal === g.groupID}
        onHide={() => setState({ ...state, showModal: null })}
      >
        <Modal.Header className="card-header">
          <Modal.Title>
            Are you sure you want to delete
            {g.title}
            ?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>All its items will be deleted with it.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setState({ ...state, showModal: null })}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => doDeleteGrouping(state, setState, g)}>
            Yes, I&apos;m sure
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  ));

  return <>{groupCards}</>;
};

const GroupingTitle = ({ state, setState, g }) => {
  if (state.groupingTitleChange !== g.groupID) {
    return (
      <>
        {g.title}
        <Button variant="danger" className="edit-button" onClick={() => setState({ ...state, showModal: g.groupID })}>
          Delete
        </Button>
        <Button className="edit-button" onClick={() => setState({ ...state, groupingTitleChange: g.groupID })}>
          Edit Title
        </Button>
      </>
    );
  }
  return (
    <Form onSubmit={onSubmitGroupingTitle(state, setState, g)}>
      <Form.Control type="text" defaultValue={g.title} id="title" />
      <Button variant="primary" type="submit" className="edit-button">
        Save
      </Button>
      <Button variant="secondary" className="edit-button" onClick={() => setState({ ...state, groupingTitleChange: null })}>
        Back
      </Button>
    </Form>
  );
};

const GroupList = ({ state, setState, grouping }) => {
  const groupItems = grouping.items.map(
    (i) => <Item key={i.itemID} state={state} setState={setState} grouping={grouping} i={i} />,
  );

  return (
    <>
      {groupItems}
      <AddItem state={state} setState={setState} grouping={grouping} />
    </>
  );
};

const Item = ({
  state, setState, grouping, i,
}) => {
  if (state.itemChange !== i.itemID) {
    return (
      <ListGroup.Item key={i.itemID} className={i.required ? 'required' : ''}>
        {i.item}
        <Button variant="outline-danger" className="edit-button" onClick={() => doDeleteItem(state, setState, grouping, i)}>
          Delete
        </Button>
        <Button variant="outline-primary" className="edit-button" onClick={() => setState({ ...state, itemChange: i.itemID, editRequiredClicked: i.required })}>
          Edit Item
        </Button>
      </ListGroup.Item>
    );
  }
  return (
    <Form onSubmit={onUpdateItem(state, setState, grouping, i)}>
      <ListGroup.Item>
        <Row>
          <Col xs={10}><Form.Control type="text" defaultValue={i.item} id="title" /></Col>
          <Col><Form.Check label="required" defaultChecked={i.required} onClick={() => setState({ ...state, editRequiredClicked: !state.editRequiredClicked })} /></Col>
        </Row>
      </ListGroup.Item>
      <Button variant="primary" type="submit" className="edit-button">
        Save
      </Button>
      <Button variant="secondary" className="edit-button" onClick={() => setState({ ...state, itemChange: null, editRequiredClicked: false })}>
        Back
      </Button>
    </Form>
  );
};

const AddItem = ({ state, setState, grouping }) => {
  if (state.addItemTo === null || state.addItemTo.groupID !== grouping.groupID) {
    return (
      <Button variant="light" onClick={() => setState({ ...state, requiredClicked: false, addItemTo: grouping })}>
        Add Item
      </Button>
    );
  }
  return (
    <Form onSubmit={onSubmitItem(state, setState)}>
      <ListGroup.Item>
        <Row>
          <Col xs={10}><Form.Control type="text" placeholder="Item Name" id="title" /></Col>
          <Col><Form.Check label="required" onClick={() => setState({ ...state, requiredClicked: !state.requiredClicked })} /></Col>
        </Row>
      </ListGroup.Item>
      <Button variant="primary" type="submit" className="edit-button">
        Add
      </Button>
      <Button variant="secondary" className="edit-button" onClick={() => setState({ ...state, addItemTo: null })}>
        Back
      </Button>
    </Form>
  );
};

const AddGrouping = ({ state, setState }) => {
  if (!state.addingGrouping) {
    return (
      <Button className="edit-button" onClick={() => setState({ ...state, addingGrouping: !state.addingGrouping })}>
        Add Grouping
      </Button>
    );
  }
  return (
    <Form onSubmit={onSubmitGrouping(state, setState)}>
      <Form.Group controlId="title">
        <Card>
          <Card.Header className="card-header">
            <Form.Control type="text" placeholder="Grouping Name" />
          </Card.Header>
        </Card>
      </Form.Group>
      <Button variant="primary" type="submit" className="edit-button">
        Add
      </Button>
      <Button variant="secondary" className="edit-button" onClick={() => setState({ ...state, addingGrouping: !state.addingGrouping })}>
        Back
      </Button>
    </Form>
  );
};

const onSubmitGroupingTitle = (state, setState, grouping) => async (event) => {
  event.preventDefault();
  const title = event.currentTarget.title.value;
  const { stationData } = state;
  stationData.groups = stationData.groups.filter((g) => {
    if (g.groupID === grouping.groupID) g.title = title;
    return g;
  });
  setState({ ...state, groupingTitleChange: null, stationData });
  putGrouping(stationData.sID, grouping.groupID, title);
};

const deleteStation = (state, setState) => {
  setState({ ...state, redirect: true });
};

const switchShowDeleteStationModal = (state, setState) => {
  setState({ ...state, showDeleteStationModal: !state.showDeleteStationModal });
};

const onSubmitGrouping = (state, setState) => async (event) => {
  event.preventDefault();
  const { stationData } = state;
  await postGrouping(stationData.sID, event.currentTarget.title.value);
  await getStationData(stationData.sID)
    .then((s) => setState({ ...state, stationData: s }));
};

const onSubmitItem = (state, setState) => async (event) => {
  event.preventDefault();
  const { stationData } = state;
  await postItem(stationData.sID, state.addItemTo.groupID,
    event.currentTarget.title.value, state.requiredClicked);
  await getStationData(stationData.sID)
    .then((s) => setState({ ...state, stationData: s }));
};

const onUpdateItem = (state, setState, grouping, item) => async (event) => {
  event.preventDefault();
  const { stationData } = state;
  stationData.groups.forEach((g) => {
    if (g.groupID === grouping.groupID) {
      g.items.forEach((i) => {
        if (i.itemID === item.itemID) {
          i.item = event.currentTarget.title.value;
          i.required = state.editRequiredClicked ? 1 : 0;
        }
      });
    }
  });
  await putItem(stationData.sID, grouping.groupID, item.itemID,
    event.currentTarget.title.value, state.editRequiredClicked ? 1 : 0);
  setState({
    ...state, itemChange: null, editRequiredClicked: false, stationData,
  });
};

const doDeleteGrouping = (state, setState, grouping) => {
  const { stationData } = state;
  stationData.groups = stationData.groups.filter((g) => g.groupID !== grouping.groupID);
  setState({ ...state, groupings: stationData.groups, showModal: false });
  deleteGrouping(stationData.sID, grouping.groupID);
};

const doDeleteItem = (state, setState, grouping, item) => {
  const { stationData } = state;
  stationData.groups.forEach((g) => {
    if (g.groupID === grouping.groupID) g.items = g.items.filter((i) => i.itemID !== item.itemID);
  });
  setState({ ...state, stationData });
  deleteItem(stationData.sID, grouping.groupID, item.itemID);
};

export default EditStation;
