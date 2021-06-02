import axios from 'axios';

/**
 * admin operations
 */

export async function putAttendance(id, file) {
  const res = await axios.put(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/attendance/${id}`, file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}

export async function getAttendance(id) {
  const res = await axios.get(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/attendance/${id}`);
  return res.data;
}
