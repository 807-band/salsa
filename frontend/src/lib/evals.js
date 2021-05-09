import axios from 'axios';

export default async function getAttempts() {
  const res = await axios.get(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/evaluations/admin`);
  return res.data;
}
