import { useState } from 'react';
import { Box } from '@mui/system';
import { GoogleLogin } from '@react-oauth/google';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { setSearchResults, setLocation } from '../../redux/eventsSlice';

export const GoogleSignin = () => {
  const dispatch = useDispatch();  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleSuccess = async (credentialResponse) => {
    // Send the ID token to the backend for verification and storage
    axiosInstance
      .post('/google-signin', {
        client_id: credentialResponse.clientId,
        jwtToken: credentialResponse.credential
      })
      .then((response) => {        
        const { token, email } = response.data;
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
          
        function fetchEvents() {
          axiosInstance
            .get('/all-events')
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
              .get('/search-events', {
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
        toast.error(error.response.data.error);
      });
  };

  return (
    <Box className="App">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          console.log('Login Failed');
        }}
        shape="circle"
      />
    <Toaster toastOptions={{ sx: { padding: '10px', fontSize: '14px' } }} position="top-right" />
    </Box>
  );
};
