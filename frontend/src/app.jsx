import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import SideNav from './components/SideNav';
import { Container, Col, Row } from 'react-bootstrap';
import Stations from './pages/stations';
import Station from './pages/stations/station';
import { useState, useEffect } from 'react';

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
                edit station order here :)
              </Route>
              <Route exact path='/stations/:id'>
                <Station isAdmin={isAdmin} />
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
