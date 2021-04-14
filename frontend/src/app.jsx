import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import SideNav from './components/SideNav';
import { Container, Col, Row } from 'react-bootstrap';
import Stations from './pages/stations';
import Station from './pages/stations/station';
import CreateStation from './pages/stations/create';
import EditStation from './pages/stations/station/edit';
import EditStations from './pages/stations/edit';
import { useState, useEffect } from 'react';
import InstructorSetup from './pages/stations/station/scripts/instructorSetup';
import InstructorScript from './pages/stations/station/scripts/instructorScript';
import EvaluatorSetup from './pages/stations/station/scripts/evaluatorSetup';
import EvaluatorScript from './pages/stations/station/scripts/evaluatorScript';
import Evaluate from './pages/evaluate';
import EvaluateUser from './pages/evaluate/evaluateUser';

const App = () => {
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    // TODO: get user info here
    setAdmin(true);
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <Container fluid>
        <Row className="site">
          <Col sm={4} md={3} xl={2} className="side-nav">
            <SideNav />
          </Col>

          <Col className="site-content">
            <Switch>
              <Route exact path='/'>
                <h1>Hi 807.band!</h1>
              </Route>

              <Route exact path='/stations'>
                <Stations isAdmin={isAdmin} />
              </Route>
              <Route exact path='/stations/edit'>
                <EditStations />
              </Route>
              <Route exact path='/stations/create'>
                <CreateStation />
              </Route>
              <Route exact path='/stations/:id'>
                <Station isAdmin={isAdmin} />
              </Route>
              <Route exact path='/stations/:id/edit'>
                <EditStation />
              </Route>
              <Route exact path='/stations/:id/instructor/setup'>
                <InstructorSetup isAdmin={isAdmin} />
              </Route>
              <Route exact path='/stations/:id/instructor/script'>
                <InstructorScript isAdmin={isAdmin} />
              </Route>
              <Route exact path='/stations/:id/evaluator/setup'>
                <EvaluatorSetup isAdmin={isAdmin} />
              </Route>
              <Route exact path='/stations/:id/evaluator/script'>
                <EvaluatorScript isAdmin={isAdmin} />
              </Route>

              <Route exact path='/evaluate'>
                <Evaluate />
              </Route>
              <Route exact path='/evaluate/:uid'>
                <EvaluateUser />
              </Route>
            </Switch>
          </Col>

          <Col lg={2} className="page-nav">
            haha sidebar go brrr
          </Col>
        </Row>
      </Container>
    </BrowserRouter>
  );
}

export default App;
