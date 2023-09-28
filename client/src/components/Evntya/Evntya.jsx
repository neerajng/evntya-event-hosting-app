import React from 'react';
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const style = {
  fontWeight: 'normal',
  fontFamily: 'brandFont',
  width: "fit-content",
  fontSize: '220%',
  textTransform: 'none',
  color: 'black',
  ':hover': {
    boxShadow: 'none',
    backgroundColor: 'none',
  },
  ':active': {
    boxShadow: 'none',
    backgroundColor: 'transparent',
  },
};

const Eventya = ({isAdmin, isUser}) => { 

  const toValue = isAdmin ? '/admin' : isUser ?'/' :'/'

  return (
    <Button 
    component={Link}
    to={toValue}
    sx={style}>
    EVNTYA    
    </Button>
  );
};

export default Eventya;
