import axios from 'axios';

/*
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

/*
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
