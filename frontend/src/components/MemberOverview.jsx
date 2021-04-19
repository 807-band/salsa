import { Container, Row, Col } from 'react-bootstrap';
import styles from '../styles/modules/MemberOverview.module.scss'

const MemberOverview = ({ stations, users }) => (
  <>
    <StationHead stations={stations} />
    <MemberAttempts users={users} />
  </>
)

const StationHead = ({ stations }) => (
  <>
    <Row className={styles.stationHeaders}>
      <Col xs={3}></Col>
      <Col className={styles.headerColor+' '+styles.cellpad}>Beginner</Col>
      <Col className={styles.headerColor+' '+styles.cellpad}>Advanced</Col>
    </Row>
    <Row className={styles.stationHeaders}>
      <Col xs={3}></Col>
      <StationBoxes level='0' stationData={stations} />
      <StationBoxes level='1' stationData={stations} />
    </Row>
  </>
)

const StationBoxes = ({ level, stationData }) => {
  const stations = stationData.filter(station => station.class == level);
  const stationTag = stations.map(station => {
    return (
      <Col title={station.title} className={styles.stationColor}>
        {station.level + 1}
      </Col>
    )
  });

  return <>{stationTag}</>
}

const MemberAttempts = ({ users }) => {
  let sectionSorted = {};

  users.forEach(user => {
    let section = user.section;
    let member = user.name;

    if (sectionSorted[section] === undefined)
      sectionSorted[section] = {};
    if (sectionSorted[section][member] === undefined)
      sectionSorted[section][member] = [];

    sectionSorted[section][member].push(user);
  });

  let sectionInfo = [];

  for (let section in sectionSorted) {
    sectionInfo.push(
      <>
        <Row className={styles.sectionHead}>
          <Col className={styles.headerColor} xs={3}>{section}</Col>
        </Row>
        <Members members={sectionSorted[section]} />
      </>
    )
  }

  return <>{sectionInfo}</>;
}

const Members = ({ members }) => {
  let tempMembers = [];

  for (let name in members) {
    let member = members[name];
    tempMembers.push(
      <Row key={member.userID}>
        <Col xs={3} className={styles.nameColor}>{name}</Col>
        <Attempts attempts={member} />
      </Row>
    );
  }
  return <>{tempMembers}</>
}

const Attempts = ({ attempts }) => {
  const stations = attempts.map(attempt => {
    let statusClass = styles.attempt + " " + styles.cellpad + " ";
    let mark = null;

    if (attempt.passed === 1) {
      statusClass += styles.completed;
      mark = "\u2713"
    } else if (attempt.attempts > 0) {
      statusClass += styles.attempted;
      mark = "\u2573"
    } else {
      statusClass += styles.no_attempts;
      mark = "\u20E0"
    }

    const moreInfo = "Evaluated by: " + attempt.evaluator
      + "\nEvaluated at: " + attempt.evalTime;
    return (
      <Col className={statusClass} title={moreInfo}>
        {mark}
      </Col>
    )
  });

  return <>{stations}</>;
}

export default MemberOverview;