import axios from 'axios';

/**
 * admin operations
 */

export async function postStation(title, description, rank) {
  await axios.post(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/station`, {
    title,
    description,
    rank,
  });
}

export async function updateOrder(id, order) {
  await axios.put(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/station/${id}/order`, {
    order,
  });
}

export async function putStation(id, title, description, maxFailed) {
  await axios.put(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/station/${id}`, {
    title,
    description,
    maxFailed,
  });
}

export async function deleteStation(id) {
  await axios.delete(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/station/${id}`);
}

/**
 * selectors
 */

export async function getStations() {
  const res = await axios.get(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/station`);
  return res.data;
}

export async function getStationData(id) {
  const res = await axios.get(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/station/${id}`);
  return res.data;
}

/**
 * grouping operations
 */

export async function postGrouping(id, title) {
  await axios.post(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/station/${id}`, {
    title,
  });
}

export async function putGrouping(sid, gid, title) {
  await axios.put(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/station/${sid}/${gid}`, {
    title,
  });
}

export async function deleteGrouping(sid, gid) {
  await axios.delete(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/station/${sid}/${gid}`);
}

/**
 * item operations
 */

export async function postItem(sid, gid, title, required) {
  const isRequired = required ? 1 : 0;
  await axios.post(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/station/${sid}/${gid}`, {
    title,
    isRequired,
  });
}

export async function putItem(sid, gid, iid, title, isRequired) {
  await axios.put(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/station/${sid}/${gid}/${iid}`, {
    item: title,
    required: isRequired,
  });
}

export async function deleteItem(sid, gid, iid) {
  await axios.delete(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/station/${sid}/${gid}/${iid}`);
}
