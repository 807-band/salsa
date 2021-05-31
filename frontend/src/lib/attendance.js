import axios from 'axios';

/**
 * admin operations
 */

export default async function putAttendance(id, file) {
  const res = await axios.put(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/attendance/${id}`, file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}
