import axios from 'axios';

/**
 * admin operations
 */

export async function postEvent(title, startTime) {
  await axios.post(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/event`, {
    title,
    startTime,
  });
}

/**
 * selectors
 */

export default async function getEvents() {
  const res = await axios.get(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/event`);
  return res.data;
}
