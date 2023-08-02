import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { OtpResponse } from '../../redux/otpSlice';
import { setAuth } from '../../redux/authSlice';
import { GoogleSignin } from '../../components/GoogleSignin/GoogleSignin';
import '../../utils/axiosConfig';
import { Spinner } from '../../components/Spinner/Spinner';

export const SigninForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    // Process the sign-in logic
    console.log('Email:', email);
    console.log('Password:', password);
    const data = {
      email,
      password
    };
        
    axios
      .post('/signin', data)
      .then((response) => {
        
        const { token } = response.data;        
        
        // Determine the user's role based on their email
        const role = email === process.env.REACT_APP_ADMIN ? 'admin' : 'user';
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('role', JSON.stringify(role));
        
        // Update the auth state
        dispatch(setAuth());

        setTimeout(() => {
          setLoading(false);
          email === process.env.REACT_APP_ADMIN ? navigate('/admin') : navigate('/test')
        }, 5000);
        
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
      {loading && <Spinner />}
      <Grid container spacing={2} justifyContent="center">
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

        <Grid align="center" py={2} ps={2}>
          <GoogleSignin />
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


