import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CardActionArea,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import slugify from 'slugify';

export const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const maxDescriptionLength = 100;

  const toastStyle = {
    padding: '10px',
    fontSize: '14px',
  };
  

  const navigate = useNavigate();

  const handleCardClick = (event) => {
    const slug = slugify(event.name.toString(), { lower: true, strict: true });
    console.log(slug)
    navigate(`/event/${slug}`, { state: { id: event._id } });
  };

  const handleEditClick = (event) => {
    // Handle the edit event
    navigate(`/edit-event/${event._id}`);
    console.log(`Edit event: ${event._id}`);
  };

  const handleCancelClick = (event) => {
    setSelectedEvent(event); 
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    if (selectedEvent) {
      axiosInstance
        .post(`/api/cancel-event/${selectedEvent._id}`)
        .then((response) => {
          // Handle the successful response
          console.log(response.data);
          toast.loading('Event is being cancelled');
  
          setTimeout(() => {
            navigate(0);
            toast.success(response.data.message);
          }, 4000);
        })
        .catch((error) => {
          console.error(error);
        });
      setOpen(false);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/api/my-events');
        setEvents(response.data);
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.message)
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
            <Grid item key={event._id} xs={12} sm={6} md={4} >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: event.canceled ? 0.5 : 1,
                  pointerEvents: event.canceled ? 'none' : 'auto',
                  position:event.canceled ? 'relative' : 'none'
                }}
                
              >
              <CardActionArea>
              {event.canceled && <DoDisturbIcon sx={{ color: 'red', position: 'absolute', width: "100%", height: "100%" }} />}
            
                <CardMedia
                  component="img"
                  sx={{ height: 140 }}
                  image={event.image}
                  alt={event.name}
                  onClick={() => handleCardClick(event)}
                />
                <CardContent sx={{ flexGrow: 1 }} onClick={() => handleCardClick(event)}>

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
                
                <CardActions sx={{ justifyContent: 'space-between' , px:4,pb:2}} >
                <Button
                  size="big"
                  variant="outlined"
                  onClick={() => handleEditClick(event)}
                  startIcon={<EditIcon />}
                  sx={{ color: 'green', borderColor: 'green',borderRadius:5,mr: 1, width: 120 }}
                >
                  Edit
                </Button>
                <Button
                  size="big"
                  variant="outlined"
                  onClick={() => handleCancelClick(event)}
                  startIcon={<CancelIcon />}
                  sx={{ color: 'red', borderColor: 'red',borderRadius:5, ml: 1, width: 120 }}
                >
                  Cancel
                </Button>
              </CardActions>
              
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>Are you sure you want to cancel this event?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleConfirm}>Yes</Button>
        </DialogActions>
      </Dialog>
      
      <Toaster
        toastOptions={{
          style: toastStyle,
        }}
        position="top-right"
      />
    </Box>
  );
};
