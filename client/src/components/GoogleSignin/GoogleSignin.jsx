import { useState } from 'react';
import { Box } from '@mui/system';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

export const GoogleSignin = () => {
  const dispatch = useDispatch();  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleSuccess = async (credentialResponse) => {
    // Send the ID token to the backend for verification and storage
    axios
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
