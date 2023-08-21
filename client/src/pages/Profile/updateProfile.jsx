import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import { Box, Button, Grid, TextField } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const UpdateProfile = ({ user, setUser, setShowUpdateForm }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const toastStyle = {
    padding: '10px',
    fontSize: '14px',
  };

  const handleSubmit = (event) => {
    event.preventDefault();
   if(!firstName || !lastName || !email || !password ){
      toast.error('Please fill all the fields before submit');
      return;
    }

    if (
      firstName.trim() === '' ||
      lastName.trim() === '' ||
      email.trim() === '' ||
      password.trim() === ''
    ) {
      toast.error('Please fill in all the fields');
      return;
    }

    // Check if the entered password and confirm password match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (
      firstName === user.firstName &&
      lastName === user.lastName &&
      email === user.email
    ) {
      toast.error('No changes were made to your profile');
      return;
    }

    axiosInstance
      .put('/update-profile', { firstName, lastName, email, password })
      .then((response) => {
        setUser(response.data);
        setShowUpdateForm(false);
        toast.loading("User profile being updated")
        setTimeout(() => {
          navigate(0)
          toast.success(response.data.message)
        }, 2000);

      })
      .catch((error) => {
        toast.error(error.response.data.error);
      });
  };

  return (
    <Box
      component="form"
      id="update-profile-form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 5,
        p: 2,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          onClick={handleSubmit}
          type="submit"
          form="update-profile-form"
          variant="contained"
          startIcon={<CheckIcon />}
          sx={{ mr: 1}}
        >
          Update
        </Button>
        <Button
          onClick={() => setShowUpdateForm(false)}
          variant="contained"
          startIcon={<ClearIcon />}
          sx={{ ml: 1 }}
        >
          Cancel
        </Button>
      </Box>
      <Toaster
        toastOptions={{
          style: toastStyle,
        }}
        position="top-right"
      />
    </Box>
  );
};
