import React, { useState } from 'react';
import { Box, Button, MenuItem, Select, Stack, Typography } from '@mui/material';
import myImage from '../../assets/images/searchImage.png';

export const DiscoverEvents = () => {
  const [location, setLocation] = useState('Trivandrum');
  const [event, setEvent] = useState('All Events');

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };
  const handleEventChange = (event) => {
    setEvent(event.target.value);
  };
  return (
    <Box sx={{ height: '50vh', bgcolor: 'brandYellow.main' }}>
      <Stack direction="row">
        <Box
          sx={{
            width: { xs: '100%', sm: '50%' },
            height: '48vh',
            bgcolor: '',
            m: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: {xs:0,sm:15},
          }}
        >
          <Typography variant="h4">
            Discover Events <br />
            Happening in<br />
            Your City
          </Typography>
          <Stack direction="row" spacing={2}>
            <Select value={location} onChange={handleLocationChange} sx={{ bgcolor: 'white' }}>
              <MenuItem value="Trivandrum">Trivandrum</MenuItem>
              <MenuItem value="Explore">Explore</MenuItem>
            </Select>
            <Select value={event} onChange={handleEventChange} sx={{ bgcolor: 'white' }}>
              <MenuItem value="All Events">All Events</MenuItem>
              <MenuItem value="Nearby">Nearby</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
            </Select>
            <Button variant="contained" 
            sx={{textTransform:'none', fontSize:'1rem', bgcolor: 'green' }}>Explore</Button>
          </Stack>
        </Box>
        <Box component="img"
        sx={{ 
            width: { xs: 0, sm: '35%' },
            height: { xs: 0, sm: '35%' },
            bgcolor: '',
            m: 1,
            display: { xs: 'none', sm: 'block' },
        }}
        src={myImage} alt="search" 
        > 
        </Box>       
      </Stack>
    </Box>
  );
};
