import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, TextField ,Typography } from '@mui/material';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export const ForgetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load isSubmitting state from local storage
  useEffect(() => {
    const storedIsSubmitting = localStorage.getItem('isSubmitting');
    if (storedIsSubmitting) {
      setIsSubmitting(JSON.parse(storedIsSubmitting));
    }
  }, []);

  // Save isSubmitting state to local storage
  useEffect(() => {
    localStorage.setItem('isSubmitting', JSON.stringify(isSubmitting));
  }, [isSubmitting]);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    axios.post('/forget-password', {email} )
    .then((response) => {    
      toast.success('A password reset link has been sent to your email.')
      setIsSubmitting(true);      
    })
    .catch((error) => {
      // Handle error response
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
        Enter the email associated with your account to receive a password reset link.
      </Typography>
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
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ borderRadius: '20px' }}
              onClick={handleSubmit}
              disabled = {isSubmitting}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
        <Toaster toastOptions={{ sx: { padding: '10px', fontSize: '14px' } }} position="top-right" />
    </Box>
  );
};


