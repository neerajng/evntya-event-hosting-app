import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Stack } from '@mui/material';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

export const UpdateEvent = ({event}) => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(event ? event.image : null);
  const [tickets, setTickets] = useState(event ? event.tickets : []);
  const [publishTime, setPublishTime] = useState(event ? dayjs(event.publishTime) : null);

  const navigate = useNavigate();

const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const handleAddTicket = () => {
    setTickets([...tickets, { name: '', price: '', quantity: '' }]);
  };

  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...tickets];
    updatedTickets[index][field] = value;
    setTickets(updatedTickets);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const currentTime = dayjs().format('MM/DD/YYYY hh:mm A');

    if (publishTime < new Date(currentTime)) {
      toast.error("Please update the publish time to future.");
      return;
    } 

    
    console.log(image,"loko")
    
    // Upload image
    if (image) {
      const formData = new FormData();
      formData.append('image', image);
      axiosInstance
        .post('/api/upload-image', formData)
        .then((response) => {
          setImageUrl(response.data.imageUrl);
          // Submit event data with image URL and ticket information
          const data = event
          ? { eventId: event._id, image: imageUrl, tickets, publishTime: publishTime.toISOString() }
          : { eventId: JSON.parse(localStorage.getItem('eventId')), image: imageUrl, tickets, publishTime: publishTime.toISOString() };
          console.log(imageUrl);  

          if (event) {
            axiosInstance
              .put(`/api/edit-event-two/${event._id}`, data)
              .then((response) => {
                toast.success(response.data.message);
                setTimeout(() => {             
                  navigate('/my-events', { replace: true });
                }, 2000);
              })
              .catch((error) => {
                toast.error(error.response.data.error);
              });
          } else {
          axiosInstance
            .post('/api/update-event', data)
            .then((response)=>{    
              toast.success(response.data.message)
              setTimeout(() => {
                localStorage.removeItem('eventId');
                // Code to execute after delay
                navigate('/', {replace:true})
                console.log(publishTime.toISOString())
                console.log(response)
              }, 2000);
            })
            .catch((error)=> {
              // Handle error response
              toast.error(error.response.data.error);
            });
          }  
        })
        .catch((error) => {
          console.log(error)
          toast.error(error.response.data.error);
        });
    }
    else if(!image && event ){
      const data = { eventId: event._id, image: imageUrl, tickets, publishTime: publishTime.toISOString() }
      axiosInstance
        .put(`/api/edit-event-two/${event._id}`, data)
        .then((response) => {
          toast.success(response.data.message);
          setTimeout(() => {             
            navigate('/my-events', { replace: true });
          }, 2000);
        })
        .catch((error) => {
          toast.error(error.response.data.error);
        });
    }else if(!image){
      toast.error("Please upload the event image")
      return;
    }
    
  };
  

  return (
    <Box sx={{ bgcolor: '', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Box backgroundColor="" sx={{ width: '50%' }} mt={5}>
      <Typography variant="h3">{event ? 'Edit Your Event' : 'Publish Your Event'}</Typography>
        <Typography variant="h6" my={1}>
          Step 2
        </Typography>
        <Typography variant="h5" my={1}>
          Event Image
        </Typography>
        {imageUrl && <img src={imageUrl} alt="Event" style={{ width: '300px', height: '200px' }} />}
        <Stack spacing={2}>
          <Button variant="outlined" component="label">
            Upload Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>

          <Typography variant="h5">Tickets</Typography>
          {tickets.map((ticket, index) => (
            <Stack key={index} direction="row" spacing={2}>
              <TextField
                label="Ticket Name"
                variant="outlined"
                name="name"
                fullWidth
                value={ticket.name}
                onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                required
              />
              <TextField
                label="Price"
                variant="outlined"
                name="price"
                fullWidth
                value={ticket.price}
                onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                required
              />
              <TextField
                label="Quantity"
                variant="outlined"
                name="quantity"
                fullWidth
                value={ticket.quantity}
                onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                required
              />
            </Stack>
          ))}
          <Button variant="outlined" onClick={handleAddTicket}>Add Ticket</Button>

          <Typography variant="h5" my={1}>
          Schedule Publishing Time 
          </Typography>  
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            disablePast
            label="Publish Time"
            value={publishTime}
            onChange={setPublishTime}
          />
          </LocalizationProvider>


          <Button sx={{ bgcolor: 'green' }} type="submit" variant="contained" onClick={handleSubmit}>
            {event ? 'Update and Publish Event ' : 'Publish Event'}
          </Button>
        </Stack>
      </Box>
      <Toaster toastOptions={{ sx: { padding: '10px', fontSize: '14px' } }} position="top-right" />
    </Box>
  );
};
