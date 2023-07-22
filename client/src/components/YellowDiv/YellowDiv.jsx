import React from 'react';
import { Box } from '@mui/material';

const style = {
    bgcolor: 'brandYellow.main',
    width: '50vw',
    height: '100vh',
}

const YellowDiv = ({children}) => {
  return (
    <Box sx={style}>
      {children}
    </Box>
  );
};

export default YellowDiv;
