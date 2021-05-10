import React from 'react';
import SignOutButton from '../components/SignOutButton';

const Profile = ({ user }) => (
  <>
    <h1>{user.name}</h1>
    {user.username}
    <br />
    <br />
    <SignOutButton />
  </>
);

export default Profile;
