import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container, Col, Row } from 'react-bootstrap';
import {
  AuthenticatedTemplate, UnauthenticatedTemplate, useMsal,
} from '@azure/msal-react';
import Header from './components/Header';
import SideNav from './components/SideNav';
import Stations from './pages/stations';
import Station from './pages/stations/station';
import CreateStation from './pages/stations/create';
import EditStation from './pages/stations/station/edit';
import EditStations from './pages/stations/edit';
import InstructorSetup from './pages/stations/station/scripts/instructorSetup';
import InstructorScript from './pages/stations/station/scripts/instructorScript';
import EvaluatorSetup from './pages/stations/station/scripts/evaluatorSetup';
import EvaluatorScript from './pages/stations/station/scripts/evaluatorScript';
import Evaluate from './pages/evaluate';
import EvaluateUser from './pages/evaluate/evaluateUser';
import EvaluateUserStation from './pages/evaluate/evaluateUserStation';
import Overview from './pages/overview';
import Profile from './pages/profile';
import { getUserByUsername } from './lib/users';

import SignInPage from './SignInPage';

const App = () => {
  const [isAdmin, setAdmin] = useState(false);
  const { accounts } = useMsal();
  const [user, setUser] = useState(null);

  console.log(user);

  useEffect(() => {
    if (accounts[0]) {
      // get username from email address
      getUserByUsername(accounts[0].username.split('@')[0]).then((res) => {
        setUser(res);
      });
    }
    setAdmin(true);
  }, [accounts[0]]);

  return (
    <>
      <AuthenticatedTemplate>
        <BrowserRouter>
          <Header />
          <Container fluid>
            <Row className="site">
              <Col sm={4} md={3} xl={2} className="side-nav">
                <SideNav />
              </Col>

              <Col className="site-content">
                <Switch>
                  <Route exact path="/">
                    <h1>hi 807.band!</h1>
                  </Route>

                  <Route exact path="/events">
                    <h1>Under construction 🔨</h1>
                  </Route>

                  <Route exact path="/stations">
                    <Stations isAdmin={isAdmin} />
                  </Route>
                  <Route exact path="/stations/edit">
                    <EditStations />
                  </Route>
                  <Route exact path="/stations/create">
                    <CreateStation />
                  </Route>
                  <Route exact path="/stations/progress">
                    <h1>Under construction 🔨</h1>
                  </Route>
                  <Route exact path="/stations/:id">
                    <Station isAdmin={isAdmin} />
                  </Route>
                  <Route exact path="/stations/:id/edit">
                    <EditStation />
                  </Route>
                  <Route exact path="/stations/:id/instructor/setup">
                    <InstructorSetup isAdmin={isAdmin} />
                  </Route>
                  <Route exact path="/stations/:id/instructor/script">
                    <InstructorScript isAdmin={isAdmin} />
                  </Route>
                  <Route exact path="/stations/:id/evaluator/setup">
                    <EvaluatorSetup isAdmin={isAdmin} />
                  </Route>
                  <Route exact path="/stations/:id/evaluator/script">
                    <EvaluatorScript isAdmin={isAdmin} />
                  </Route>

                  <Route exact path="/evaluate">
                    <Evaluate />
                  </Route>
                  <Route exact path="/evaluate/:uid">
                    <EvaluateUser />
                  </Route>
                  <Route exact path="/evaluate/:uid/:sid">
                    <EvaluateUserStation />
                  </Route>

                  <Route exact path="/overview">
                    <Overview />
                  </Route>

                  <Route exact path="/profile">
                    <Profile user={accounts[0]} />
                  </Route>
                </Switch>
              </Col>

              {/* <Col lg={2} className="page-nav">
                haha sidebar go brrr
              </Col> */}
            </Row>
          </Container>
        </BrowserRouter>
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <SignInPage />
      </UnauthenticatedTemplate>
    </>
  );
};

export default App;
