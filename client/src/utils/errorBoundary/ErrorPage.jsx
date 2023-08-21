import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export const ErrorPage = (props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h4">Oops!</Typography>
      <Typography variant="body1">Something went wrong...</Typography>
      {props.resetErrorBoundary && (
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={props.resetErrorBoundary}>
            🔄 Try Again!
          </Button>
        </Box>
      )}
    </Box>
  );
};
