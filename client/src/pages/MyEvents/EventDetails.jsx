import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';

const labelStyle = { fontWeight: 'bold' };

export const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const { eventId } = useParams();

  useEffect(() => {
    axios
      .get(`/event/${eventId}`)
      .then((response) => {
        setEvent(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [eventId]);

  console.log(event)

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <Box mt={2}>
      <Typography variant="h4" align="center">
        {event.name}
      </Typography>
      <Box p={5}>
        <Grid container spacing={8}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardMedia
                component="img"
                sx={{ height: 140 }}
                image={event.image}
                alt={event.name}
                style={{ width: '300px', height: '200px' }}
              />
              <CardContent>
              <Typography>
                <span style={labelStyle}>Start Time:</span> {new Date(event.startTime).toLocaleString()}
              </Typography>
              <Typography>
                <span style={labelStyle}>End Time:</span> {new Date(event.endTime).toLocaleString()}
              </Typography>
              <Typography>
                <span style={labelStyle}>Category:</span> {event.category}
              </Typography>
              <Typography>
                <span style={labelStyle}>Description:</span> {event.description}
              </Typography>    
              {event.meetLink && (
  <Typography>
    <span style={labelStyle}>Meet Link:</span>{' '}
    <a href={event.meetLink} target="_blank" rel="noreferrer">
      {event.meetLink}
    </a>
  </Typography>
)}          
              {event.address.location && (
                  <>
                    <Typography style={labelStyle} mt={2}variant="h6">Address</Typography>
                    <Typography>
                      <span style={labelStyle}>Location:</span> {event.address.location}
                    </Typography>
                    <Typography>
                      <span style={labelStyle}>City:</span> {event.address.city}
                    </Typography>
                    <Typography>
                      <span style={labelStyle}>State:</span> {event.address.state}
                    </Typography>
                    <Typography>
                      <span style={labelStyle}>Country:</span> {event.address.country}
                    </Typography>                  
                    </>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography style={labelStyle} variant="h5">Tickets</Typography>
                {event.tickets.map((ticket) => (
                <Box key={ticket.name} mt={2}>
                  <Typography>
                    <span style={labelStyle}>Name:</span> {ticket.name}
                  </Typography>
                  <Typography>
                    <span style={labelStyle}>Price:</span> {ticket.price}
                  </Typography>
                  <Typography>
                    <span style={labelStyle}>Quantity:</span> {ticket.quantity}
                  </Typography>
                  <Typography>
                    <span style={labelStyle}>Sold:</span> {ticket.sold}
                  </Typography>
                </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
