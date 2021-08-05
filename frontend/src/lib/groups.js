import axios from 'axios';

export async function getGroupMembers(groupID) {
  const res = await axios.get(`${process.env.REACT_APP_SERVERDOM}:3001/api/groups/${groupID}`);
  return res.data;
}

export async function getGroupNames() {
  const res = await axios.get(`${process.env.REACT_APP_SERVERDOM}:3001/api/groups/names`);
  return res.data;
}

export async function getGroupsByUser(userID) {
  const res = await axios.get(`${process.env.REACT_APP_SERVERDOM}:3001/api/groups/byuser/${userID}`);
  return res.data;
}

export async function createGroup(name, members) {
  const res = await axios.post(`${process.env.REACT_APP_SERVERDOM}:3001/api/groups`, {
    name,
    members,
  });
  return res.data;
}

export async function editGroup(groupID, name, members) {
  const res = await axios.put(`${process.env.REACT_APP_SERVERDOM}:3001/api/groups/${groupID}`, {
    name,
    members,
  });
  return res.data;
}

export async function deleteGroup(groupID) {
  const res = await axios.delete(`${process.env.REACT_APP_SERVERDOM}:3001/api/groups/${groupID}`);
  return res.data;
}
