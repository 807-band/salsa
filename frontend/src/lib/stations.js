import axios from 'axios';

export async function getStations() {
  const res = await axios.get(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/station`);
  return res.data;
}

export async function getStationData(id) {
  const res = await axios.get(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/station/${id}`);
  return res.data;
}
