import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField } from '@mui/material';

export const UpdateProfile = ({ user, setUser }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .put('/profile', { firstName, lastName, email })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="First Name"
        value={firstName}
        onChange={(event) => setFirstName(event.target.value)}
      />
      <TextField
        label="Last Name"
        value={lastName}
        onChange={(event) => setLastName(event.target.value)}
      />
      <TextField
        label="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Button type="submit">Update Profile</Button>
    </form>
  );
};
