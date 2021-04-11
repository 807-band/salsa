import StationInfoJumbo from '../../../components/StationInfoJumbo'
import StationInfo from '../../../components/StationInfoLinks'
import ListGroup from 'react-bootstrap/ListGroup'
import { Row, Col, Button, Form, Modal, Card } from 'react-bootstrap'
import { Link, useParams, Redirect } from 'react-router-dom'
import { useState, useEffect } from 'react'

const EditStation = () => {
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

  const params = useParams();
  useEffect(() => {
    // TODO: get actual station here
    const tempFakeStation = {
      sID: params.id,
      title: "station name",
      groups: [],
    };
    setState({ ...state, stationData: tempFakeStation });
  }, [params.id]);

  if (!state.stationData)
    return <>loading...</>;

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

      <br /><br /><br />

      <Button variant="danger" className="edit-button" onClick={() => switchShowDeleteStationModal(state, setState)}>
        Delete Station
      </Button>

      <Modal show={state.showDeleteStationModal} onHide={() => switchShowDeleteStationModal(state, setState)}>
        <Modal.Header className="danger-modal-header"><Modal.Title>WARNING: Are you sure you want to delete {state.stationData.title}?</Modal.Title></Modal.Header>
        <Modal.Body>All its groupings and items will be deleted with it. THIS IS FINAL.</Modal.Body>
        <Modal.Footer>
            <Button onClick={() => switchShowDeleteStationModal(state, setState)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => deleteStation(state, setState)}>
              Yes, I'm sure
            </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

const GroupingCards = ({ state, setState }) => {
  const groupCards = state.stationData.groups.map((g) =>
    <Card key={g.groupID}>
      <Card.Header className="card-header">
        <GroupingTitle state={state} setState={setState} g={g} />
      </Card.Header>
      <ListGroup>
        <GroupList state={state} setState={setState} grouping={g} />
      </ListGroup>
      <Modal show={state.showModal == g.groupID} onHide={() => setState({ ...state, showModal: null })}>
        <Modal.Header className="card-header"><Modal.Title>Are you sure you want to delete {g.title}?</Modal.Title></Modal.Header>
        <Modal.Body>All its items will be deleted with it.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setState({ ...state, showModal: null })}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => deleteGrouping(state, setState, g)}>
            Yes, I'm sure
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );

  return <>{groupCards}</>;
}

const GroupingTitle = ({ state, setState, g }) => {
  if (state.groupingTitleChange != g.groupID)
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
  else
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
}

const GroupList = ({ state, setState, grouping }) => {
  const groupItems = grouping.items.map((i) =>
    <Item key={i.itemID} state={state} setState={setState} grouping={grouping} i={i} />
  );

  return (
    <>
      {groupItems}
      <AddItem state={state} setState={setState} grouping={grouping} />
    </>
  );
}

const Item = ({ state, setState, grouping, i }) => {
  if (state.itemChange != i.itemID)
    return (
      <ListGroup.Item key={i.itemID} className={i.required ? "required" : ""}>
        {i.item}
        <Button variant="outline-danger" className="edit-button" onClick={() => deleteItem(state, setState, grouping, i)}>
          Delete
        </Button>
        <Button variant="outline-primary" className="edit-button" onClick={() => setState({ ...state, itemChange: i.itemID, editRequiredClicked: i.required, })}>
          Edit Item
        </Button>
      </ListGroup.Item>
    );
  else
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
}

const AddItem = ({ state, setState, grouping }) => {
  if (state.addItemTo == null || state.addItemTo.groupID != grouping.groupID)
    return (
      <Button variant="light" onClick={() => setState({ ...state, requiredClicked: false, addItemTo: grouping })}>
        Add Item
      </Button>
    )
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
      <Button variant="secondary" className="edit-button" onClick={() => setState({ ...state, addItemTo: null, })}>
        Back
      </Button>
    </Form>
  );
}

const AddGrouping = ({ state, setState }) => {
  if (!state.addingGrouping)
    return (
      <Button className="edit-button" onClick={() => setState({ ...state, addingGrouping: !state.addingGrouping })}>
        Add Grouping
      </Button>
    )
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
}

// TODO: most of these below will need to interact with the DB in some way

const onSubmitGroupingTitle = (state, setState, grouping) => async (event) => {
  event.preventDefault();
  const title = event.currentTarget.title.value;
  const stationData = state.stationData;
  stationData.groups = stationData.groups.filter((g) => {
    if(g.groupID == grouping.groupID)
      g.title = title;
    return g;
  });
  setState({ ...state, groupingTitleChange: null, stationData: stationData });
}

const deleteStation = (state, setState) => {
  setState({ ...state, redirect: true });
}

const switchShowDeleteStationModal = (state, setState) => {
  setState({ ...state, showDeleteStationModal: !state.showDeleteStationModal });
}

const onSubmitGrouping = (state, setState) => async (event) => {
  event.preventDefault();
  const stationData = state.stationData;
  stationData.groups.push({
    groupID: Math.random()*10000,
    title: event.currentTarget.title.value,
    items: []
  });
  setState({ ...state, groupings: stationData.groups });
}

const onSubmitItem = (state, setState) => async (event) => {
  event.preventDefault();
  const stationData = state.stationData;
  stationData.groups.forEach((g) => {
    if(g.groupID == state.addItemTo.groupID) {
      g.items.push({
        itemID: Math.random(),
        item: event.currentTarget.title.value,
        required: state.requiredClicked,
      });
    }
  });
  setState({ ...state, groupings: stationData.groups });
}

const onUpdateItem = (state, setState, grouping, item) => async (event) => {
  event.preventDefault();
  const stationData = state.stationData;
  stationData.groups.forEach((g) => {
    if(g.groupID == grouping.groupID) {
      g.items.forEach((i) => {
        if(i.itemID == item.itemID) {
          i.item = event.currentTarget.title.value;
          i.required = state.editRequiredClicked ? 1 : 0;
        }
      });
    }
  });
  setState({ ...state, itemChange: null, editRequiredClicked: false, stationData: stationData });
}

const deleteGrouping = (state, setState, grouping) => {
  const stationData = state.stationData;
  stationData.groups = stationData.groups.filter((g) => g.groupID != grouping.groupID);
  setState({ ...state, groupings: stationData.groups, showModal: false });
}

const deleteItem = (state, setState, grouping, item) => {
  const stationData = state.stationData;
  stationData.groups.forEach((g) => {
    if(g.groupID == grouping.groupID)
      g.items = g.items.filter((i) => i.itemID != item.itemID);
  });
  setState({ ...state, stationData: stationData });
}

export default EditStation;