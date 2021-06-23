import axios from 'axios';

/**
 * admin operations
 */

export async function postEvent(title, startTime, tardyTime, groupID) {
  await axios.post(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/event`, {
    title,
    startTime,
    tardyTime,
    groupID,
  });
}

export async function putEvent(id, title, startTime, tardyTime, groupID) {
  await axios.put(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/event/${id}`, {
    title,
    startTime,
    tardyTime,
    groupID,
  });
}

export async function deleteEvent(id) {
  await axios.delete(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/event/${id}`);
}

export async function postSub(id, oldUserID, newUserID) {
  await axios.post(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/event/${id}/sub`, {
    oldUserID,
    newUserID,
  });
}

export async function putSub(id, oldUserID, newUserID) {
  await axios.put(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/event/${id}/sub`, {
    oldUserID,
    newUserID,
  });
}

export async function deleteSub(id, oldUserID) {
  await axios.delete(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/event/${id}/sub/${oldUserID}`);
}

/**
 * selectors
 */

export async function getEvents() {
  const res = await axios.get(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/event`);
  return res.data;
}

export async function getEvent(id) {
  const res = await axios.get(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/event/${id}`);
  return res.data;
}

export async function getEventMembers(id) {
  const res = await axios.get(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/event/${id}/members`);
  return res.data;
}
