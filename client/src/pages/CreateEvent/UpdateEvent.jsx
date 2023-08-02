import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Stack } from '@mui/material';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const UpdateEvent = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate()

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
  
    let imageUrl;
  
    // Upload image
    if (image) {
      const formData = new FormData();
      formData.append('image', image);
  
      axios
        .post('/upload-image', formData)
        .then((response) => {
          imageUrl = response.data.imageUrl;
          // Submit event data with image URL and ticket information
          const data = { eventId: JSON.parse(localStorage.getItem('eventId')), image: imageUrl, tickets };
          console.log(imageUrl);  
          console.log(data+"lo");  
          axios
            .post('/update-event', data)
            .then((response)=>{
              toast.success(response.data.message)
              setTimeout(() => {
                localStorage.removeItem('eventId');
                // Code to execute after delay
                navigate('/test', {replace:true})
              }, 2000);
            })
            .catch((error)=> {
              // Handle error response
              toast.error(error.response.data.error);
            });
        })
        .catch((error) => {
          console.log(error)
        });
    }
  };
  

  return (
    <Box sx={{ bgcolor: '', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Box backgroundColor="" sx={{ width: '50%' }} mt={5}>
        <Typography variant="h3">Publish Your Event</Typography>
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
                onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                required
              />
              <TextField
                label="Price"
                variant="outlined"
                name="price"
                fullWidth
                onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                required
              />
              <TextField
                label="Quantity"
                variant="outlined"
                name="quantity"
                fullWidth
                onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                required
              />
            </Stack>
          ))}
          <Button onClick={handleAddTicket}>Add Ticket</Button>

          <Button sx={{ bgcolor: 'green' }} type="submit" variant="contained" onClick={handleSubmit}>
            Publish Event
          </Button>
        </Stack>
      </Box>
      <Toaster toastOptions={{ sx: { padding: '10px', fontSize: '14px' } }} position="top-right" />
    </Box>
  );
};