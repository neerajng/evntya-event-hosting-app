import React from 'react';
import { Box } from '@mui/material';
import { NavbarLayout } from '../NavbarLayout/NavbarLayout';
import { FooterLayout } from '../FooterLayout/FooterLayout'; 

export const PageLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <NavbarLayout />
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
      <FooterLayout />
    </Box>
  );
};
