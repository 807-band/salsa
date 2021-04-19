import MemberOverview from '../components/MemberOverview';

const Overview = () => {
  // TODO: get from db
  const tempFakeStations = [{
    _id: 123,
    title: "a beginner station",
    level: "beginner",
  },
  {
    _id: 456,
    title: "an advanced station",
    level: "advanced",
  },
  {
    _id: 789,
    title: "another beginner station",
    level: "beginner",
  }];
  const tempFakeUserAttempts = [{
    userID: '0',
    sectionID: '3',
    name: 'Bryce Collard',
    attempts: 1,
    passed: 1,
  },
  {
    userID: '0',
    sectionID: '3',
    name: 'Bryce Collard',
    attempts: 1,
    passed: 0,
  },
  {
    userID: '0',
    sectionID: '3',
    name: 'Bryce Collard',
    attempts: 0,
    passed: 0,
  }];

  return (
    <>
      <h1>Station Attempts Overview</h1>
      <MemberOverview stations={tempFakeStations} users={tempFakeUserAttempts} />
    </>
  );
}

export default Overview;