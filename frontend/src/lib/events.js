import axios from 'axios';

/**
 * admin operations
 */

export async function postEvent(title, startTime, tardyTime) {
  await axios.post(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/event`, {
    title,
    startTime,
    tardyTime,
  });
}

export async function putEvent(id, title, startTime, tardyTime) {
  await axios.put(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/event/${id}`, {
    title,
    startTime,
    tardyTime,
  });
}

export async function putAttendance(id, file) {
  await axios.put(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/event/${id}/attendance`, file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function deleteEvent(id) {
  await axios.delete(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/event/${id}`);
}

/**
 * selectors
 */

export default async function getEvents() {
  const res = await axios.get(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/event`);
  return res.data;
}

export async function getEvent(id) {
  const res = await axios.get(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/event/${id}`);
  return res.data;
}
