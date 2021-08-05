import axios from 'axios';

axios.defaults.withCredentials = true;

export async function getUsers() {
  const res = await axios.get(`${process.env.REACT_APP_SERVERDOM}:3001/api/user`);
  return res.data;
}

export async function getUser(uID) {
  const res = await axios.get(`${process.env.REACT_APP_SERVERDOM}:3001/api/user/${uID}`);
  return res.data;
}

export async function getUserByUsername(username) {
  const res = await axios.get(`${process.env.REACT_APP_SERVERDOM}:3001/api/user/byname/${username}`);
  return res.data;
}

export async function getPermissions(uID) {
  const res = await axios.get(`${process.env.REACT_APP_SERVERDOM}:3001/api/user/${uID}/permissions`);
  return res.data;
}
