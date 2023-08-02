import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';

export const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const maxDescriptionLength = 100;

  const navigate = useNavigate();

  const handleCardClick = (event) => {
    navigate(`/test/event/${event._id}`);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/my-events');
        setEvents(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <Box mt={2}>
      <Typography variant="h4" align="center">
        My Events
      </Typography>
      <Box p={5}>
        <Grid container spacing={8}>
          {events.map((event) => (
            <Grid item key={event._id} xs={12} sm={6} md={4}>
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
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
