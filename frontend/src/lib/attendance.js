import axios from 'axios';

export async function getGroupMembers(groupID) {
  const res = await axios.get(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/attendance/group/${groupID}`);
  return res.data;
}

export async function getGroupNames() {
  const res = await axios.get(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/attendance/groupnames`);
  return res.data;
}
