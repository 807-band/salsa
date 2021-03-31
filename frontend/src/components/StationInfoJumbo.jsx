import { useState } from 'react'
import { Button, Jumbotron, Form } from 'react-bootstrap'

const StationInfoJumbo = ({ editMode, stationData }) => {
   const [station, setStation] = useState(stationData);

   return (
      <>
         <Jumbotron className="station-jumbo">
            <h1>
               <title>{station.title} - 807.band</title>
            </h1>
            <StationInfo editMode={editMode} station={station} setStation={setStation}/>
         </Jumbotron>
      </>
   );
}

const StationInfo = ({editMode, station, setStation}) => {
   const [isEditing, setEditing] = useState(false);

   const submitChanges = async (event) => {
      event.preventDefault();
      const newStation = station;
      newStation.title = event.currentTarget.title.value;
      newStation.description = event.currentTarget.description.value;
      newStation.maxFailed = event.currentTarget.maxFailed.value;      
      // TODO: save newStation to DB here
      setEditing(false);
      setStation(newStation);
   }

   if (editMode) {
      if (!isEditing)
         return (
            <>
               <Button className="edit-station-data" onClick={() => setEditing(true)}>
                  Edit Station Data
               </Button>
               <h1 className="station-title">
                  {station.title}
               </h1>
               <br />
               <div className="description">{station.description}</div>
               <br />
               <div className="maxMissed">Maximum failed: {station.maxFailed}</div>
            </>
         );
      else
         return (
            <>
               <Button variant="secondary" className="edit-station-data" onClick={() => setEditing(false)}>
                  Back
               </Button>
               <br />
               <Form onSubmit={submitChanges}>
                  <Form.Group>
                     <Form.Label>Station Title</Form.Label>
                     <Form.Control type="text" defaultValue={station.title} id="title" />
                  </Form.Group>
                  <br />
                  <Form.Group>
                     <Form.Label>Description</Form.Label>
                     <Form.Control type="text" defaultValue={station.description} id="description" />
                  </Form.Group>
                  <br />
                  <Form.Group>
                     <Form.Label>Maximum Failed</Form.Label>
                     <Form.Control type="number" defaultValue={station.maxFailed} id="maxFailed" />
                  </Form.Group>
                  <br />
                  <Button type="submit" className="edit-button">
                     Save
                  </Button>
               </Form>
            </>
         )
   }
   return (
      <>
         <h1 className="station-title">
            {station.title}
         </h1>
         <br />
         <div className="description">{station.description}</div>
         <br />
         <div className="maxMissed">Maximum failed: {station.maxFailed}</div>
      </>
   );
}

export default StationInfoJumbo;