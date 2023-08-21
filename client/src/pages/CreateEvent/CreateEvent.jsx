import React, { useState } from 'react';
import { TextField, MenuItem, Button, Box, Typography, Stack } from '@mui/material';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocationButton } from '../../components/LocationButton/LocationButton';
import validator from 'validator';
import dayjs from 'dayjs';

export const CreateEvent = ({ event }) => {
  const [name, setName] = useState(event ? event.name : '');
  const [startTime, setStartTime] = useState(event ? dayjs(event.startTime) : null);
  const [endTime, setEndTime] = useState(event ? dayjs(event.endTime) : null);
  const [category, setCategory] = useState(event ? event.category : '');
  const [location, setLocation] = useState(event ? event.address.location : '');
  const [city, setCity] = useState(event ? event.address.city : '');
  const [state, setState] = useState(event ? event.address.state : '');
  const [country, setCountry] = useState(event ? event.address.country : '');
  const [meetLink, setMeetLink] = useState(event ? event.meetLink : '');
  const [description, setDescription] = useState(event ? event.description : '');
  const navigate = useNavigate()
  
  const handleLocationChange = (location) => {
    setLocation(location);
  };
  
  const handleCityChange = (city) => {
    setCity(city);
  };
  
  const handleStateChange = (state) => {
    setState(state);
  };
  
  const handleCountryChange = (country) => {
    setCountry(country);
  };
  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    let data = { name, startTime, endTime, category, description };
    if (category === 'Venue' || category === 'Hybrid') {
      data = { ...data, location, city, state, country };
    }
    if (category === 'Online' || category === 'Hybrid') {
      data = { ...data, meetLink };
    }
    console.log(data)
    if (!name||!startTime||!endTime||!category||!description) {
      toast.error("Please fill in all the fields");
      return;
    }
    if ((category === 'Venue' || category === 'Hybrid') && (!location || !city || !state || !country)) {
      toast.error("Please fill in all the address fields");
      return;
    }
    // Check if the meetLink is a valid URL
    if ((category === 'Online' || category === 'Hybrid') && !validator.isURL(meetLink)) {
      toast.error("Please enter a valid meet link");
      return;
    }

    // Parse the startTime and endTime strings into Date objects
  const startDateTime = dayjs(startTime, 'MM/DD/YYYY hh:mm A').toDate();
  const endDateTime = dayjs(endTime, 'MM/DD/YYYY hh:mm A').toDate();
  const currentTime = dayjs().format('MM/DD/YYYY hh:mm A');

  if (startDateTime < new Date(currentTime)) {
    toast.error("Cannot select past time");
    return;
  }

  // Check if the start time and end time are the same
  if (startDateTime.getTime() === endDateTime.getTime()) {
    toast.error("Start time and end time cannot be the same");
    return;
  }

  // Check if the start time is greater than the end time
  if (startDateTime.getTime() > endDateTime.getTime()) {
    toast.error("Start time cannot be greater than end time");
    return;
  }

  if (event) {
    axiosInstance
    .put(`/edit-event/${event._id}`, data)
    .then((response) => {
      setTimeout(() => {
        // Code to execute after the delay
        navigate(`/test/edit-event-two/${event._id}`, {replace:true})        
      }, 2000);
    })
    .catch((error) => {
      // Handle the error response
    });
  } else {
    axiosInstance
    .post('/create-event', data)
    .then((response)=>{
      const eventId = response.data.event._id
      setTimeout(() => {
        // Code to execute after the delay
        navigate('/test/update-event', {replace:true})
        localStorage.setItem('eventId', JSON.stringify(eventId));
      }, 2000);
    })
    .catch((error)=> {
      // Handle the error response
      if (error.response) {
        console.log(error)
        toast.error(error.response.data.error);
      } else {
        toast.error('Something went wrong');
        console.log(error)
      }
    });
    };
  }  
    

  return (
    <Box sx={{ bgcolor: '', display: 'flex', flexWrap: 'wrap' , justifyContent:'center'}}>
      <Box backgroundColor="" sx={{width:'50%'}} mt={5}>
      <Typography variant="h3">{event ? 'Edit Your Event' : 'Publish Your Event'}</Typography>
        <Typography variant="h6" my={1}>Step 1</Typography>
        <Stack spacing={2}>
        <TextField
          label="Event Name"
          variant="outlined"
          name="name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack direction="row" spacing={2} >
            <DateTimePicker
              label="Start Time *"
              value={startTime}
              onChange={setStartTime}
              
            />
            <DateTimePicker
              label="End Time *"
              value={endTime}
              onChange={setEndTime}
            />
          </Stack>
        </LocalizationProvider>
        
        <TextField
          select
          label="Where will your event take place?"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          name="category"
          fullWidth
        >
            <MenuItem value="">
              Please Select an Option
            </MenuItem>
            <MenuItem value={"Online"}>Online</MenuItem>
            <MenuItem value={"Venue"}>Venue</MenuItem>
            <MenuItem value={"Hybrid"}>Hybrid</MenuItem>
        </TextField>

        {category === 'Venue' || category === 'Hybrid' ? (
          <>
            <LocationButton
              onLocationChange={handleLocationChange}
              onCityChange={handleCityChange}
              onStateChange={handleStateChange}
              onCountryChange={handleCountryChange}
            />
            <TextField
              label="Location"
              variant="outlined"
              name="location"
              fullWidth
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <TextField
              label="City"
              variant="outlined"
              name="city"
              fullWidth
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <TextField
              label="State"
              variant="outlined"
              name="state"
              fullWidth
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
            <TextField
              label="Country"
              variant="outlined"
              name="country"
              fullWidth
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </>
        ) : null}

        {category === 'Online' || category === 'Hybrid' ? (
          <TextField
            label="Meet Link"
            variant="outlined"
            name="meetLink"
            fullWidth
            value={meetLink}
            onChange={(e) => setMeetLink(e.target.value)}
            required
          />
        ) : null}

        <TextField
          label="Event Description"
          multiline
          rows={4}
          variant="outlined"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          fullWidth
        />
        <Button sx={{bgcolor:'green'}} type="submit" variant="contained" onClick={handleSubmit}>
            Continue
        </Button>
        </Stack>
      </Box>
      <Toaster toastOptions={{ sx: { padding: '10px', fontSize: '14px' } }} position="top-right" />
    </Box>
  );
};