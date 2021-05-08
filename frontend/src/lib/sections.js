import axios from 'axios';

export default async function getSections() {
  const res = await axios.get(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/section`);
  return res.data;
}
