import React from 'react';
import { Box } from '@mui/material';
import { NavbarLayout } from '../NavbarLayout/NavbarLayout';
import { FooterLayout } from '../FooterLayout/FooterLayout'; 
import { NavbarLanding } from '../NavbarLayout/NavbarLanding';
import { useSelector } from 'react-redux'

export const PageLayout = ({ children }) => {
  const authState = useSelector((state)=>{ return  state.auths.authState }) 

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {(!authState || !authState.token) ? <NavbarLanding />: <NavbarLayout />}
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
      <FooterLayout />
    </Box>
  );
};
