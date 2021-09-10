import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container, Col, Row } from 'react-bootstrap';
import {
  AuthenticatedTemplate, UnauthenticatedTemplate, useMsal,
} from '@azure/msal-react';
import { isMobile } from 'react-device-detect';
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
import Events from './pages/Events';
import CreateEvent from './pages/events/Create';
import Groups from './pages/events/Groups';
import Group from './pages/events/groups/Group';
import CreateGroup from './pages/events/groups/Create';
import { getUserByUsername, getPermissions } from './lib/users';

import SignInPage from './SignInPage';
import Event from './pages/events/Event';
import EditEvent from './pages/events/event/Edit';
import EditGroup from './pages/events/groups/group/Edit';
import Attendance from './pages/events/Attendance';
import UserAttendance from './pages/events/attendance/UserAttendance';

import cpmb from './images/cpmb.jpeg';

const App = () => {
  const [isAdmin, setAdmin] = useState(false);
  const [evalStatus, setEval] = useState(false);
  const { accounts } = useMsal();
  const [user, setUser] = useState(null);

  useEffect(async () => {
    if (accounts[0]) {
      // get username from email address
      getUserByUsername(accounts[0].username.split('@')[0]).then((res) => {
        setUser(res);
        getPermissions(res.userID).then((perms) => {
          setAdmin(perms.includes('admin'));
          if (perms.includes('admin') || perms.includes('eval')) {
            setEval('eval');
          } else if (perms.includes('eval-1-2')) {
            setEval('eval-1-2');
          } else if (perms.includes('eval-3-6')) { setEval('eval-3-6'); }
        });
      });
    }
  }, [accounts[0]]);

  return (
    <>
      <AuthenticatedTemplate>
        <BrowserRouter>
          <Header isEval={evalStatus} />
          <Container fluid>
            <Row className="site">
              <Col sm={4} md={3} xl={2} className="side-nav">
                <SideNav isAdmin={isAdmin} isEval={evalStatus} />
              </Col>

              <Col className="site-content">
                <Switch>
                  <Route exact path="/">
                    {isMobile ? <SideNav isAdmin={isAdmin} isEval={evalStatus} /> : <img src={cpmb} alt="Cal Poly Mustang Band" />}
                  </Route>

                  <Route exact path="/events">
                    <Events />
                  </Route>
                  <Route exact path="/events/create">
                    {isAdmin && <CreateEvent />}
                  </Route>
                  <Route exact path="/events/groups">
                    {isAdmin && <Groups />}
                  </Route>
                  <Route exact path="/events/attendance">
                    {isAdmin && <Attendance />}
                  </Route>
                  <Route exact path="/events/attendance/:id">
                    {isAdmin && <UserAttendance />}
                  </Route>
                  <Route exact path="/events/groups/create">
                    {isAdmin && <CreateGroup />}
                  </Route>
                  <Route exact path="/events/groups/:id">
                    {isAdmin && <Group />}
                  </Route>
                  <Route exact path="/events/groups/:id/edit">
                    {isAdmin && <EditGroup />}
                  </Route>
                  <Route exact path="/events/:id">
                    <Event isAdmin={isAdmin} />
                  </Route>
                  <Route exact path="/events/:id/edit">
                    {isAdmin && <EditEvent />}
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
                    {evalStatus && <Evaluate />}
                  </Route>
                  <Route exact path="/evaluate/:uid">
                    {evalStatus && <EvaluateUser evalStatus={evalStatus} />}
                  </Route>
                  <Route exact path="/evaluate/:uid/:sid">
                    {evalStatus && <EvaluateUserStation evaluator={user} evalStatus={evalStatus} />}
                  </Route>

                  <Route exact path="/overview">
                    {evalStatus && <Overview />}
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
