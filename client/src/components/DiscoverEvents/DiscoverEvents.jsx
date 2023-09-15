import React, { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import myImage from '../../assets/images/searchImage.png';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchResults, setLocation } from '../../redux/eventsSlice';

export const DiscoverEvents = () => {
  const location = useSelector((state) => state.events.location);
  const [cat, setCat] = useState('All Events');
  const dispatch = useDispatch();

  const handleLocationChange = (event, newValue) => {
    console.log(newValue)
    dispatch(setLocation(newValue));
    localStorage.setItem('location', newValue);
  };

  const handleCatChange = (event, newValue) => {
    setCat(newValue);
  };

  const handleSearchClick = () => {
    if (!location) {
      toast.error('Please enter the location');
      return;
    }
  
    axiosInstance
      .get('/api/search-events', {
        params: {
          location: location,
          category: cat,
        },
      })
      .then((response) => {
        const data = response.data;
        console.log(data)
        if (data.length===0) {
          console.log(location,cat)
          toast.error('No events happening in this city');
        } else {
          console.log(location,cat)
          dispatch(setSearchResults(data));
        }
      })
      .catch((error) => {
        console.log(error)
        toast.error(error.message);
      });
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
            <Autocomplete
              value={location}
              onChange={handleLocationChange}
              freeSolo
              autoSelect
              options={['World Wide','Trivandrum', 'Kochi', 'Bengaluru','Chennai','Hyderabad', 'Mumbai']}
              renderInput={(params) => <TextField {...params} variant="outlined" 
              label="Location"              
              sx={{ bgcolor: 'white', width: { 
                md: 150, lg: 200, xl: 250  
              } }}/>}
            />

            <Autocomplete
              value={cat}
              onChange={handleCatChange}
              options={['All Events', 'Online', 'Offline', 'Hybrid']}
              renderInput={(params) => <TextField {...params} variant="outlined" 
              
              sx={{ bgcolor: 'white', width: { 
                md: 150, lg: 200, xl: 250 
              }, }}/>}
            />

            <Button variant="contained" 
            sx={{textTransform:'none', fontSize:'1rem', bgcolor: 'green' }}
            onClick={handleSearchClick} // Add this line
            >
              Explore
            </Button>
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
      <Toaster toastOptions={{ sx: { padding: '10px', fontSize: '14px' } }} position="top-right" />
    </Box>
  );
};
