import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { getStationData } from '../../lib/stations';

import StationInfoLinks from '../../components/StationInfoLinks';
import StationInfoJumbo from '../../components/StationInfoJumbo';

const Station = ({ isAdmin }) => {
  const [stationData, setStationData] = useState(null);
  const params = useParams();

  useEffect(() => {
    getStationData(params.id).then((s) => setStationData(s));
  }, [params.id]);

  if (!stationData) return null;
  return (
    <>
      {isAdmin ? (
        <Link to={`/stations/${stationData.sID}/edit`}>
          <Button variant="primary" className="edit-station-button">
            Edit
          </Button>
        </Link>
      ) : null}

      <StationInfoJumbo stationData={stationData} />
      <StationInfoLinks id={stationData.sID} />
      <GroupingCards groups={stationData.groups} />
      <br />
    </>
  );
};

const GroupingCards = ({ groups }) => {
  groups.sort((a, b) => ((a.level > b.level) ? 1 : -1));

  return (
    <>
      {
    groups.map((g) => (
      <Card key={g.groupID}>
        <Card.Header className="card-header">{g.title}</Card.Header>
        <ListGroup>
          <GroupList items={g.items} />
        </ListGroup>
      </Card>
    ))
  }
    </>
  );
};

const GroupList = ({ items }) => {
  items.sort((a, b) => ((a.level > b.level) ? 1 : -1));

  return items.map((i) => (
    <ListGroup.Item key={i.itemID} className={i.required ? 'required' : ''}>
      {i.item}
    </ListGroup.Item>
  ));
};

export default Station;
