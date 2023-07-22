import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { OtpResponse } from '../../redux/otpSlice';
import { setAuth } from '../../redux/authSlice';

export const SigninForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  
  const navigate = useNavigate()  
  const otpResponse = useSelector((state) => state.otps.response);
  const dispatch = useDispatch();  
  useEffect(() => {
    if (otpResponse) {
      // Show toast message after navigating to /signin
      toast.success('Account created successfully.Please Signin.');   
      dispatch(OtpResponse(null));   
    }
    return 
  }, [otpResponse, dispatch]);

  const handleSignin = (e) => {
    e.preventDefault();

    // Process the sign-in logic
    console.log('Email:', email);
    console.log('Password:', password);

    const data = {
      email,
      password
    };

    // Send sign-in request to the backend
    axios
      .post('/signin', data)
      .then((response) => {
        // Retrieve the JWT token from the response
        const { token } = response.data;
        
        // Store the token in local storage or state for future use
        localStorage.setItem('token', JSON.stringify(token));

        // Update the auth state
        dispatch(setAuth());

        // Navigate to the desired page after successful sign-in
        navigate('/test')
        
      })
      .catch((error) => {
        // Handle sign-in errors
        toast.error(error.response.data.error);
      });


    // Reset form fields
    setEmail('');
    setPassword('');
  };

  return (
    <Box 
    sx={{
        position: 'absolute',
        top: '25%',
        left: '55%',
        width: '40%',
        height: '25%'
        }}
    >
      <Grid container spacing={2}>
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
          <Typography variant="body2" align="left">
            <Button component={Link} to="/test/forget-password">Forgot password?</Button>
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" type="submit" fullWidth sx={{ borderRadius: '20px' }}
          onClick={handleSignin}
          >
          Sign In
          </Button>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="body2" align="center">
            New User? <Button component={Link} to = "/test/signup">Sign Up</Button>
          </Typography>
        </Grid>
      </Grid>    
    <Toaster toastOptions={{ sx: { padding: '10px', fontSize: '14px' } }} position="top-right" />
    </Box>
  );
};


