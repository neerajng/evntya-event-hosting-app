import React from 'react';
import { Box, Typography } from '@mui/material';

export const FooterLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        backgroundColor: 'brandYellow.main',
        color: 'black',
        mt: 2,
      }}
    >
      <Typography variant="body1">
        © 2023 by Evntya. Proudly created with love.
      </Typography>
    </Box>
  );
};
