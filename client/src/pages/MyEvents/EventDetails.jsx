import React, { useState, useEffect, useMemo } from 'react';
import jwt_decode from "jwt-decode";
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import toast, { Toaster } from 'react-hot-toast';
import {  useNavigate,useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Typography,
  Stack
} from '@mui/material';
import slugify from 'slugify';

const labelStyle = { fontWeight: 'bold' };

export const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [ticketQuantities, setTicketQuantities] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const eventId = location.state.id
  console.log(eventId)
  const token = localStorage.getItem("token");

  const decodedToken = jwt_decode(token) 
  const userId = decodedToken.userId;
  console.log(userId)
  console.log(ticketQuantities)
  

  useEffect(() => {
    axiosInstance
      .get(`/api/event/${eventId}`)
      .then((response) => {
        setEvent(response.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message)
      });
  }, [eventId]);
  


  if (!event) {
    return <div>Loading...</div>;
  }

  const handleDecreaseQuantity = (ticketName) => {

    console.log("d")
    setTicketQuantities(prevQuantities => {
      const ticket = event.tickets.find(ticket => ticket.name === ticketName);
      return {
        ...prevQuantities,
        [ticketName]: {
          count: Math.max((prevQuantities[ticketName]?.count || 0) - 1, 0),
          price: ticket.price,
          total: ticket.quantity,
          sold: ticket.sold
        }
      };
    });
  };
  
  const handleIncreaseQuantity = (ticketName) => {
    console.log("i")
    setTicketQuantities(prevQuantities => {
      const currentQuantity = prevQuantities[ticketName]?.count || 0;
      const ticket = event.tickets.find(ticket => ticket.name === ticketName);
      if (ticket && currentQuantity < ticket.quantity) {
        return {
          ...prevQuantities,
          [ticketName]: {
            count: currentQuantity + 1,
            price: ticket.price,
            total: ticket.quantity,
            sold: ticket.sold
          }
        };
      } else {
        toast.error('No more tickets available');
        return prevQuantities;
      }
    });
  };
  
  
  const handleProceedCheckout = (ticketQuantities) => {
    // const slug = slugify(event.name.toString(), { lower: true, strict: true });
    // Check if at least one ticket is selected
    const totalQuantity = Object.values(ticketQuantities).reduce((a, b) => a + b, 0);
    if (totalQuantity === 0) {
      toast.error('Please select at least one ticket');
      return;
    }
    const data = {
      eventId,
      ticketQuantities,
      userId
    }
    console.log(data)
    // Send request to server to book ticket
    axiosInstance
      .post('/api/proceed-checkout', {
        data
      })
      .then((response) => {
        const data = response.data; 
        if (data.errors && data.errors.length > 0) {
          console.log('Some tickets could not be reserved:', data.errors);
        } else {
          console.log(data);
          navigate('/checkout', { state: { data: {
            ...data,
            eventName: event.name
          }  } });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    

  };

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
                    <Typography style={labelStyle} mt={2} variant="h6">Address</Typography>
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
              <Divider/>
              {event.tickets.map((ticket) => (
                <React.Fragment key={ticket._id}><Box  mt={2} display="flex" justifyContent="space-between">
                  <Box>
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

                  

                  <Stack direction="row">
                    <Button onClick={() => handleDecreaseQuantity(ticket.name)} sx={{ my: 5 }}>
                      <RemoveIcon />
                    </Button>
                    <Typography
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '2rem' }}>
                      {ticketQuantities[ticket.name]?.count || 0}
                    </Typography>
                    <Button onClick={() => handleIncreaseQuantity(ticket.name)} sx={{ my: 5 }}>
                      <AddIcon />
                    </Button>
                  </Stack>


              </Box><Divider /></React.Fragment>
              ))}

                {/* Total Quantity and Price */}
                <Box mt={2} display="flex" flexDirection='column' alignItems="flex-end">
                  <Typography>
                    <span style={labelStyle}>Total Quantity:</span> 
                    {Object.values(ticketQuantities).reduce((total, ticket) => total + ticket.count, 0)}
                  </Typography>
                  <Typography>
                    <span style={labelStyle}>Total Price:</span> 
                    {Object.values(ticketQuantities).reduce((total, ticket) => total + ticket.count * ticket.price, 0)}
                  </Typography>
                </Box>
              
                <Box display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="secondary"
                      onClick={() => handleProceedCheckout(ticketQuantities)}
                      sx={{ mt: 3 }}
                    >
                      Proceed to Checkout
                    </Button>
                </Box>

            </CardContent>
          </Card>


            {/* Add organizer information */}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h5" style={{ fontWeight: 'bold' }}>Organizer</Typography>

                {/* Add organizer name */}
                {(event.organizer.firstName || event.organizer.lastName) && (
                  <>
                    {/* Add organizer first name */}
                    {event.organizer.firstName && (
                      <>
                        {/* Add organizer last name */}
                        {event.organizer.lastName && (
                          <Typography>
                            <span style={labelStyle}>Name:</span> {event.organizer.firstName} {event.organizer.lastName}
                          </Typography>
                        )}
                      </>
                    )}
                  </>
                )}
                
                {/* Add organizer email */}
                {event.organizer.email && (
                  <Typography>
                    <span style={labelStyle}>Email:</span> {event.organizer.email}
                  </Typography>
                )}

              <Typography>
                <span style={labelStyle}>Publish Time:</span> {new Date(event.publishTime).toLocaleString()}
              </Typography>
              
              </CardContent>
            </Card>

          </Grid>
        </Grid>
      </Box>
        <Toaster toastOptions={{ sx: { padding: '10px', fontSize: '14px' } }} position="top-right" />
    </Box>
  );
};
