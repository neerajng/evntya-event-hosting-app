import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCategory } from '../../redux/eventsSlice';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Stack
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import slugify from 'slugify';

const buttonStyle = {
  borderRadius: 5
};

export const PopularEvents = () => {
  const { allEvents, selectedCategory, searchResults, location } = useSelector((state) => state.events);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const maxDescriptionLength = 100;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  console.log(allEvents);

  const handleCardClick = (event) => {
    const slug = slugify(event.name.toString(), { lower: true, strict: true });
    console.log(slug)
    navigate(`/test/event/${slug}`, { state: { id: event._id } });
};

  const handleCategoryClick = (category) => {
    dispatch(setSelectedCategory(category));
    // Add your logic here to filter events by the selected category
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate.toDate());
    dispatch(setSelectedCategory('selectedDate'));
  };

  let filteredEvents = allEvents;

  if (selectedCategory !== 'all') {
    filteredEvents = filteredEvents.filter((event) => {
      const eventDate = new Date(event.startTime);
      const today = new Date();
      if (selectedCategory === 'today') {
        return eventDate.getDate() === today.getDate() &&
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getFullYear() === today.getFullYear();
      }
      if (selectedCategory === 'tomorrow') {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return eventDate.getDate() === tomorrow.getDate() &&
          eventDate.getMonth() === tomorrow.getMonth() &&
          eventDate.getFullYear() === tomorrow.getFullYear();
      }
      if (selectedCategory === 'thisWeek') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      }
      if (selectedCategory === 'selectedDate') {
        return eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear();
      }
      return false;
    });
  }

  filteredEvents = filteredEvents
    .filter((event) => new Date(event.publishTime) <= new Date())
    .filter(event => 
      searchResults.some(searchResult => searchResult._id === event._id)
    );

  
  console.log( filteredEvents, searchResults)


  return (
    <Box mt={2}>
      <Typography variant="h4" align="center">
        {searchResults.length > 0 ? (location === 'World Wide' ? 'Popular Events Worldwide' : `Popular Events in ${location}`) : 'Popular Events'}
      </Typography>
      <Box px={5} pb={5} >
        <Stack direction="row" spacing={2} m={2} justifyContent="center" >
          <Button
            sx={buttonStyle}
            variant="outlined"
            onClick={() => handleCategoryClick('all')}
          >
            All
          </Button>
          <Button
            sx={buttonStyle}
            variant="outlined"
            onClick={() => handleCategoryClick('today')}
          >
            Today
          </Button>
          <Button
            sx={buttonStyle}
            variant="outlined"
            onClick={() => handleCategoryClick('tomorrow')}
          >
            Tomorrow
          </Button>
          <Button
            sx={buttonStyle}
            variant="outlined"
            onClick={() => handleCategoryClick('thisWeek')}
          >
            This Week
          </Button>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker sx={{
              '& .MuiInputBase-root': {
                borderRadius: 10,
                textAlign: 'center'  
              },
              '& .MuiInputBase-input': {
                textAlign: 'center',
              },
            }} value={dayjs(selectedDate)} onChange={handleDateChange} />
          </LocalizationProvider>
        </Stack>

        <Grid container spacing={8}>
  {filteredEvents.length > 0 ? (
    filteredEvents.map((event) => (
      <Grid item key={event._id} xs={12} sm={6} md={4} >
        <Card
          sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          onClick={() => handleCardClick(event)}
        >
          <CardMedia
            component="img"
            sx={{ height: 140 }}
            image={event.image}
            alt={event.name}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="div">
              {event.name}
            </Typography>
            <Typography>Start Time: {new Date(event.startTime).toLocaleString()}</Typography>
            <Typography>End Time: {new Date(event.endTime).toLocaleString()}</Typography>
            <Typography>Category: {event.category}</Typography>
            <Typography>
              Description:{' '}
              {event.description.length > maxDescriptionLength
                ? event.description.slice(0, maxDescriptionLength) + '...'
                : event.description}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))
  ) : (
    <Stack direction='row' mt={10} mx={10} justifyContent='center'>
    <Typography variant="h5">
      Sorry, events are not available.
    </Typography>
  </Stack>
  )}
</Grid>

      </Box>
      <Toaster toastOptions={{ sx: { padding: '10px', fontSize: '14px' } }} position="top-right" />
    </Box>
  );
};
