import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { OtpResponse } from '../../redux/otpSlice';
import { setAuth } from '../../redux/authSlice';
import { GoogleSignin } from '../../components/GoogleSignin/GoogleSignin';
import { Spinner } from '../../components/Spinner/Spinner';
import { setSearchResults, setLocation } from '../../redux/eventsSlice';

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
        
    axiosInstance
      .post('/api/signin', data)
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
          email === process.env.REACT_APP_ADMIN ? navigate('/admin') : navigate('/')
        }, 5000);

        function fetchEvents() {
          axiosInstance
            .get('/api/all-events')
            .then((response) => {
              const data = response.data;          
              dispatch(setSearchResults(data))
              console.log(data)
            })
            .catch((error) => console.log(error));
        }                
        
         // Fetch location using geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            let { latitude, longitude } = position.coords;
    
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            const { city } = data;

            // Fetch events based on the city
            axiosInstance
              .get('/api/search-events', {  
                params: {
                  location: city,
                  category: 'All Events',
                },
              })
              .then((response) => {
                const data = response.data;
                if (data.length === 0) {
                  toast.error('No events happening in this city');
                } else {
                  dispatch(setSearchResults(data));
                  dispatch(setLocation(city));
                }
              })
              .catch((error) => {
                console.log(error);
                toast.error(error.message);
              });
          },
          (error) => {
            console.log(error);
            // If geolocation is denied or fails, fetch all events
            fetchEvents();
          }
        );
      } else {
        // If geolocation API is not available, fetch all events
        fetchEvents();
      }              
                  
        
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
            <Button component={Link} to="/forget-password">Forgot password?</Button>
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
            New User? <Button component={Link} to = "/signup">Sign Up</Button>
          </Typography>
        </Grid>
      </Grid>    
    <Toaster toastOptions={{ sx: { padding: '10px', fontSize: '14px' } }} position="top-right" />
    </Box>
  );
};


