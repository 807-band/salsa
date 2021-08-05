import axios from 'axios';

/**
 * admin operations
 */

export async function putAttendance(id, file) {
  const res = await axios.put(`${process.env.REACT_APP_SERVERDOM}:3001/api/attendance/${id}`, file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}

export async function getAttendanceByEvent(id) {
  const res = await axios.get(`${process.env.REACT_APP_SERVERDOM}:3001/api/attendance/byevent/${id}`);
  return res.data;
}

export async function getAttendanceByUser(id) {
  const res = await axios.get(`${process.env.REACT_APP_SERVERDOM}:3001/api/attendance/byuser/${id}`);
  return res.data;
}
