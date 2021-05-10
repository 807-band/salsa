import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container, Col, Row } from 'react-bootstrap';
import {
  AuthenticatedTemplate, UnauthenticatedTemplate, useMsal,
} from '@azure/msal-react';
import Header from './components/Header';
import SideNav from './components/SideNav';
import Stations from './pages/Stations';
import Station from './pages/stations/Station';
import CreateStation from './pages/stations/Create';
import EditStation from './pages/stations/station/Edit';
import EditStations from './pages/stations/Edit';
import InstructorSetup from './pages/stations/station/scripts/InstructorSetup';
import InstructorScript from './pages/stations/station/scripts/InstructorScript';
import EvaluatorSetup from './pages/stations/station/scripts/EvaluatorSetup';
import EvaluatorScript from './pages/stations/station/scripts/EvaluatorScript';
import Evaluate from './pages/Evaluate';
import EvaluateUser from './pages/evaluate/EvaluateUser';
import EvaluateUserStation from './pages/evaluate/EvaluateUserStation';
import Overview from './pages/Overview';
import Profile from './pages/Profile';
import { getUserByUsername, getPermissions } from './lib/users';

import SignInPage from './SignInPage';

const App = () => {
  const [isAdmin, setAdmin] = useState(false);
  const [isEval, setEval] = useState(false);
  const { accounts } = useMsal();
  const [user, setUser] = useState(null);

  useEffect(async () => {
    if (accounts[0]) {
      // get username from email address
      getUserByUsername(accounts[0].username.split('@')[0]).then((res) => {
        setUser(res);
        getPermissions(res.userID).then((perms) => {
          setAdmin(perms.includes('admin'));
          setEval(perms.includes('admin') || perms.includes('eval'));
        });
      });
    }
  }, [accounts[0]]);

  return (
    <>
      <AuthenticatedTemplate>
        <BrowserRouter>
          <Header isEval={isEval} />
          <Container fluid>
            <Row className="site">
              <Col sm={4} md={3} xl={2} className="side-nav">
                <SideNav isAdmin={isAdmin} isEval={isEval} />
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
                    {isAdmin && <EditStations />}
                  </Route>
                  <Route exact path="/stations/create">
                    {isAdmin && <CreateStation />}
                  </Route>
                  <Route exact path="/stations/:id/edit">
                    {isAdmin && <EditStation />}
                  </Route>

                  <Route exact path="/stations/progress">
                    <h1>Under construction 🔨</h1>
                  </Route>
                  <Route exact path="/stations/:id">
                    <Station isAdmin={isAdmin} />
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
                    {isEval && <Evaluate />}
                  </Route>
                  <Route exact path="/evaluate/:uid">
                    {isEval && <EvaluateUser />}
                  </Route>
                  <Route exact path="/evaluate/:uid/:sid">
                    {isEval && <EvaluateUserStation evaluator={user} />}
                  </Route>

                  <Route exact path="/overview">
                    {isEval && <Overview />}
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
