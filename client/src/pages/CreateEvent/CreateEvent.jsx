import React, { useState } from 'react';
import { TextField, MenuItem, Button, Box, Typography, Stack } from '@mui/material';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export const CreateEvent = () => {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('')
  const [location, setLocation] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')
  const [meetLink, setMeetLink] = useState('')
  const [description, setDescription] = useState('');
  const navigate = useNavigate()

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
    if ((category === 'Online' || category === 'Hybrid') && !meetLink) {
      toast.error("Please enter a meet link");
      return;
    }
    axios
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

  return (
    <Box sx={{ bgcolor: '', display: 'flex', flexWrap: 'wrap' , justifyContent:'center'}}>
      <Box backgroundColor="" sx={{width:'50%'}} mt={5}>
        <Typography variant="h3">Publish Your Event</Typography>
        <Typography variant="h6" my={1}>Step 1</Typography>
        <Stack spacing={2}>
        <TextField
          label="Event Name"
          variant="outlined"
          name="name"
          fullWidth
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
            <TextField
              label="Location"
              variant="outlined"
              name="location"
              fullWidth
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <TextField
              label="City"
              variant="outlined"
              name="city"
              fullWidth
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <TextField
              label="State"
              variant="outlined"
              name="state"
              fullWidth
              onChange={(e) => setState(e.target.value)}
              required
            />
            <TextField
              label="Country"
              variant="outlined"
              name="country"
              fullWidth
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