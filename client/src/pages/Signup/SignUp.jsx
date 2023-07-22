import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import { useDispatch } from 'react-redux';
import { SignupResponse } from '../../redux/signupSlice';


export const SignupForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate()
  const dispatch = useDispatch();


  const toastStyle = {
    padding: '10px',
    fontSize: '14px',
  };

  const handleSubmit = (e) => {
  e.preventDefault();    
  // Create a data object with the form fields
  const data = {
    firstName,
    lastName,
    email,
    password,
  }; 
  
  if (password !== confirmPassword) {
    toast.error("Password and confirm password don't match");
    return;
  }

  axios.post('/signup', data)
  .then((response) => {    
    // Reset form fields
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');

    console.log(response.data);
    // Store the response data in Redux
    dispatch(SignupResponse(response.data));

    // Handle the successful response
    navigate('/test/otp')
  })
  .catch((error) => {
    // Handle the error response
    toast.error(error.response.data.error);
    });
  };

  return (
    <Box 
    sx={{
        position: 'absolute',
        top: '25%',
        left: '55%',
        width:'40%',
        height: '25%'
        }}
    >
    
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
        <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
         />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" 
          type="submit" fullWidth sx={{ borderRadius: '20px' }}
          onClick={handleSubmit}
          >
            Sign Up
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" align="center">
            Already a registered user? 
            <Button color="primary"  
            component={Link}
            to = {'/test/signin'} >
                Sign In
            </Button>
          </Typography>
        </Grid>
      </Grid>
      <Toaster
        toastOptions={{
          style: toastStyle,
        }}
        position="top-right"
      />
    </Box>
  );
};


