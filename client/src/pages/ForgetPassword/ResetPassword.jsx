import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { id: token } = useParams();
  const navigate = useNavigate()
  

  const handleSubmit = (event) => {
    event.preventDefault();    
    if(!password || !confirmPassword){
      return toast.error('Please fill in all fields')
    }
    if(password!==confirmPassword){
      return toast.error('Passwords should be matched')
    }
    // handle reset password request here
    axios.post('/reset-password', { password, token })
      .then((response) => {
        // handle successful response
        toast.success(response.data.message)
        setTimeout(() => {
          // Code to execute after the delay
          navigate('/test/signin')
        }, 3000);
      })
      .catch((error) => {
        // handle error response
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
        height: '25%',
      }}
    >
      <Typography variant="body1" gutterBottom>
        Enter your new password.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ borderRadius: '20px' }}
            onClick={handleSubmit}
            disabled={isButtonDisabled}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
      <Toaster toastOptions={{ sx: { padding: '10px', fontSize: '14px' } }} position="top-right" />
    </Box>
  );
};
