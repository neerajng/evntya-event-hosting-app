import React from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import './SignOut.css';
import {  useNavigate } from 'react-router-dom';

const SignOut = () => {

  const navigate = useNavigate()

  const handleSignOut = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/signup')
    window.location.reload()
    navigate('/signin')
    window.location.reload()
  };

  return (
    <div className="signout" >
      <LogoutIcon type="submit" onClick={handleSignOut} style={{ display: '', marginLeft: '-32px',fontSize: '200%', cursor: 'pointer' }} />
    </div>
  );
};

export default SignOut;
