import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box, Tooltip, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import toast, { Toaster } from 'react-hot-toast';

import { useDispatch } from 'react-redux';
import { SignupResponse } from '../../redux/signupSlice';


export const SignupForm = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const toastStyle = {
    padding: '10px',
    fontSize: '14px',
  };

  const checkPasswordStrength = (password) => {
    // At least 8 characters long, contain at least one uppercase letter, one lowercase letter, 
    //one number, and one special character
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
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

  if (
    firstName.trim() === '' ||
    lastName.trim() === '' ||
    email.trim() === '' ||
    password.trim() === ''
  ) {
    toast.error('Please fill in all the fields');
    return;
  }

  if (!checkPasswordStrength(password)) {
    toast.error('Password is not strong enough');
    return;
  }
  
  if (password !== confirmPassword) {
    toast.error("Password and confirm password don't match");
    return;
  }

  axiosInstance.post('/signup', data)
  .then((response) => {    
    // Reset form fields
    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('');

    console.log(response.data);
    // Store the response data in Redux
    dispatch(SignupResponse(response.data));

    // Handle the successful response
    navigate('/test/otp')
  })
  .catch((error)=> {
    // Handle the error response
    if (error.response) {
      console.log(error)
      toast.error(error.response.data.error);
    } else {
      toast.error('Something went wrong');
      console.log(error)
    }
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
          <Tooltip title="At least 8 characters long, contain at least one uppercase letter, one 
          lowercase letter, one number, and one special character">
            <IconButton >
            <InfoOutlinedIcon sx={{ color: 'red', fontSize: 'large' }} />
            </IconButton>
          </Tooltip>
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


