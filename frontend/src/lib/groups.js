import axios from 'axios';

export async function getGroupMembers(groupID) {
  const res = await axios.get(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/groups/${groupID}`);
  return res.data;
}

export async function getGroupNames() {
  const res = await axios.get(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/groups/names`);
  return res.data;
}

export async function createGroup(name, members) {
  const res = await axios.post(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/groups`, {
    name,
    members,
  });
  return res.data;
}

export async function editGroup(groupID, name, members) {
  const res = await axios.put(`http://${process.env.REACT_APP_SERVERDOM}:3001/api/groups/${groupID}`, {
    name,
    members,
  });
  return res.data;
}
