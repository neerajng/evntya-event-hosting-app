import React, { useState } from 'react';
import { TextField, Button, Grid, Box } from '@mui/material';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { OtpResponse } from '../../redux/otpSlice';



export const OtpForm = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate()  
  const dispatch = useDispatch();

  const signupResponse = useSelector((state) => state.signups.response && state.signups.response.user);
  

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a data object with the OTP value
    const data = {
      otp,
      signupResponse
    };

    axiosInstance
      .post('/api/otp', data)
      .then((response) => {
        // Store the response data in Redux
        dispatch(OtpResponse(response.data));        
        navigate('/signin');
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
        top: '40%',
        left: '55%',
        width: '40%',
        height: '25%'
        }}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ borderRadius: '20px' }}
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
      </form>
      <Toaster toastOptions={{ sx: { padding: '10px', fontSize: '14px' } }} position="top-right" />
    </Box>
  );
};


