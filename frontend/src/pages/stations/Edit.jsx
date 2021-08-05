/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Button from 'react-bootstrap/Button';
import Handle from '../../components/Handle';
import { getStations, updateOrder } from '../../lib/stations';

const EditStations = () => {
  const [beginnerStations, setBeginnerStations] = useState([]);
  const [advancedStations, setAdvancedStations] = useState([]);

  useEffect(() => {
    getStations().then((allStationsData) => {
      setBeginnerStations(allStationsData.filter((station) => station.class === 0));
      setAdvancedStations(allStationsData.filter((station) => station.class === 1));
    });
  }, []);

  // map beginner and advanced lists into a lists of draggables
  const beginnerList = beginnerStations.map((s, index) => (
    <Draggable draggableId={s.sID.toString()} index={index} key={s.sID}>
      {(provided) => (
        <ListGroup.Item key={s.sID} action href={`/stations/${s.sID}`} {...provided.draggableProps} ref={provided.innerRef}>
          Station
          {' '}
          { index + 1}
          :
          {' '}
          { s.title}
          <Handle {...provided.dragHandleProps} />
        </ListGroup.Item>
      )}
    </Draggable>
  ));
  const advancedList = advancedStations.map((s, index) => (
    <Draggable draggableId={s.sID.toString()} index={index} key={s.sID}>
      {(provided) => (
        <ListGroup.Item key={s.sID} action href={`/stations/${s.sID}`} {...provided.draggableProps} ref={provided.innerRef}>
          Station
          {' '}
          { index + 1}
          :
          {' '}
          { s.title}
          <Handle {...provided.dragHandleProps} />
        </ListGroup.Item>
      )}
    </Draggable>
  ));

  return (
    <>
      <h1>
        Stations
        <Link to="/stations">
          <Button variant="primary" className="edit-button">
            Done
          </Button>
        </Link>
      </h1>

      <DragDropContext
        onDragEnd={
          onDragEnd(beginnerStations, advancedStations, setBeginnerStations, setAdvancedStations)
        }
      >
        <Card>
          <Card.Header>Beginner</Card.Header>
          <Droppable droppableId="0">
            {(provided) => (
              <ListGroup ref={provided.innerRef} {...provided.droppableProps}>
                {beginnerList}
                {provided.placeholder}
              </ListGroup>
            )}
          </Droppable>
        </Card>
      </DragDropContext>
      <br />
      <DragDropContext
        onDragEnd={
          onDragEnd(beginnerStations, advancedStations, setBeginnerStations, setAdvancedStations)
        }
      >
        <Card>
          <Card.Header>Advanced</Card.Header>
          <Droppable droppableId="1">
            {(provided) => (
              <ListGroup variant="flush" ref={provided.innerRef} {...provided.droppableProps}>
                {advancedList}
                {provided.placeholder}
              </ListGroup>
            )}
          </Droppable>
        </Card>
      </DragDropContext>
    </>
  );
};

// called after a draggable is dropped
const onDragEnd = (
  beginnerStations, advancedStations, setBeginnerStations, setAdvancedStations,
) => async (result) => {
  if (result.destination == null) return;
  const from = result.source.index;
  const to = result.destination.index;

  // droppableId 0 for beginner, 1 for advanced
  const stationList = result.source.droppableId === '0' ? beginnerStations : advancedStations;

  // update state to reflect order changes visually
  const newStationList = Array.from(stationList);
  newStationList.splice(from, 1);
  newStationList.splice(to, 0, stationList[from]);
  for (let i = 0; i < newStationList.length; i += 1) newStationList[i].order = i;
  if (result.source.droppableId === '0') { // beginner
    setBeginnerStations(newStationList);
  } else { // advanced
    setAdvancedStations(newStationList);
  }

  await updateOrder(result.draggableId, result.destination.index);
};

export default EditStations;
