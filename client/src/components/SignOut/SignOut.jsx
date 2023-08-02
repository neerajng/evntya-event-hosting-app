import React from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import {  useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearAuth } from '../../redux/authSlice';
import { Box } from '@mui/material';

export const SignOut = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch();  

  const handleSignOut = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    dispatch(clearAuth());
    navigate('/test/signin') 
  };

  return (
    <Box className="signout" >
      <LogoutIcon type="submit" onClick={handleSignOut} style={{ display: '', marginLeft: '-32px',fontSize: '200%', cursor: 'pointer' }} />
    </Box>
  );
};

