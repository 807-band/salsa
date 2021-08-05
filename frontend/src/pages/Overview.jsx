import React, { useEffect, useState } from 'react';
import MemberOverview from '../components/MemberOverview';
import { getStations } from '../lib/stations';
import getAttempts from '../lib/evals';

const Overview = () => {
  const [stations, setStations] = useState(null);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    getStations().then((s) => setStations(s));
    getAttempts().then((a) => setAttempts(a));
  }, []);

  return stations && (
    <>
      <h1>Station Attempts Overview</h1>
      <MemberOverview stations={stations} users={attempts} />
    </>
  );
};

export default Overview;
