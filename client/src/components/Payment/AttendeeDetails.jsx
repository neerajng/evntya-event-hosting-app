import React from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField
} from '@mui/material';

export const AttendeeDetails = ({ form, handleChange }) => {
  
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Attendee Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="name"
            name="name"
            label="Name"
            fullWidth
            autoComplete="shipping address-line1"
            variant="standard"
            value={form.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="phone"
            name="phone"
            label="Phone number"
            fullWidth
            autoComplete="shipping address-line2"
            variant="standard"
            value={form.phone}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="shipping address-level2"
            variant="standard"
            value={form.city}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="state"
            name="state"
            label="State"
            fullWidth
            variant="standard"
            value={form.state}
            onChange={handleChange}
          />
        </Grid>             
      </Grid>
    </Box>
  );
};
