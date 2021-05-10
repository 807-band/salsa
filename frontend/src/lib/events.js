import axios from 'axios';

/**
 * selectors
 */

export default async function getEvents() {
  const res = await axios.get(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/event`);
  return res.data;
}
