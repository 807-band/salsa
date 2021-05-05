import axios from 'axios';

export default async function getUser() {
  const res = await axios.get(`http://${process.env.REACT_APP_SERVERDOM}:3001`);
  return res.data;
}
