import React, { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
// import Pagination from "react-js-pagination";
import "./PopularEvents.css"
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCategory } from '../../redux/eventsSlice';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Grid,
  Typography,
  Stack,
  TextField, Pagination
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

  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');

  const maxDescriptionLength = 100;

  const token = localStorage.getItem("token") ? localStorage.getItem("token") : null;
  const decodedToken = (token) ? jwt_decode(token) : null ;
  const userId = decodedToken?.userId;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  // console.log(allEvents);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // console.log(value)
  };

  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCardClick = (event) => {
    const slug = slugify(event.name.toString(), { lower: true, strict: true });
    // console.log(slug);
    userId ? navigate(`/event/${slug}`, { state: { id: event._id } }) : toast.error('Please do login first');
};

  const handleCategoryClick = (category) => {
    dispatch(setSelectedCategory(category));
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate.toDate());
    dispatch(setSelectedCategory('selectedDate'));
  };

  let filteredEvents = allEvents.filter((event) =>
  event.name.toLowerCase().includes(searchTerm.toLowerCase())
);

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
  // console.log("search", searchResults)
  
  if (searchResults.length>0){
    filteredEvents = filteredEvents    
    .filter(event => 
      searchResults.some(searchResult => searchResult._id === event._id)
      );
  }else {
    filteredEvents = searchResults
  }
  // console.log( "filtered", filteredEvents)
  const pageCount = (filteredEvents.length+1)/6  
  
  useEffect(() => {
    setNumberOfPages(pageCount)     
  }, [numberOfPages, pageCount]);

  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
  
  return (
    <Box mt={2}>
      <Typography variant="h4" align="center">
        {searchResults.length > 0 ? (location === 'World Wide' ? 'Popular Events Worldwide' : `Popular Events in ${location}`) : 'Popular Events'}
      </Typography>
      <Box px={5} pb={5} >
        <Stack sx={{ display: 'flex', flexWrap: 'wrap' , justifyContent:'center'}} 
        direction='row' spacing={2} m={2} 
        useFlexGap>
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
            size="small"
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
            }} disablePast value={dayjs(selectedDate)} onChange={handleDateChange} 
            slotProps={{ textField: { size: 'small' } }}/>
          </LocalizationProvider>
            <TextField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events..."
              size="small"
            />
        </Stack>

        <Grid container spacing={8}>
  {filteredEvents.length > 0 ? (
    filteredEvents.map((event) => (
      <Grid item key={event._id} xs={12} sm={6} md={4} >
        <Card
          sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          onClick={() => handleCardClick(event)}
        >
          <CardActionArea>
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
          </CardActionArea>
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
      <Box sx={{display:'flex', justifyContent:'center'}}>  
      <Pagination count={10} color="secondary" size='large' 
      showFirstButton showLastButton
      page={currentPage}
      onChange={handlePageChange}/>    
      </Box>
      <Toaster toastOptions={{ sx: { padding: '10px', fontSize: '14px' } }} position="top-right" />
    </Box>
  );
};

/* <Pagination
  activePage={currentPage}
  itemsCountPerPage={itemsPerPage}
  totalItemsCount={filteredEvents.length}
  pageRangeDisplayed={6}
  onChange={handlePageChange}
/> */