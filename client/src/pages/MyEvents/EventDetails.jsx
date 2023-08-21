import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import toast, { Toaster } from 'react-hot-toast';
import { useParams, useNavigate,useLocation } from 'react-router-dom';
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [ticketQuantities, setTicketQuantities] = useState({});
  const location = useLocation();
  const eventId = location.state.id
  console.log(eventId)
  // const { eventId } = useParams(); 
  

  useEffect(() => {
    axiosInstance
      .get(`/event/${eventId}`)
      .then((response) => {
        setEvent(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [eventId]);

  if (!event) {
    return <div>Loading...</div>;
  }

  const handleDecreaseQuantity = (ticketName) => {
    setTicketQuantities(prevQuantities => ({
      ...prevQuantities,
      [ticketName]: Math.max((prevQuantities[ticketName] || 0) - 1, 0),
    }));
  };  
  
  const handleIncreaseQuantity = (ticketName) => {
    setTicketQuantities(prevQuantities => {
      const currentQuantity = prevQuantities[ticketName] || 0;
      const ticket = event.tickets.find(ticket => ticket.name === ticketName);
      if (ticket && currentQuantity < ticket.quantity) {
        return {
          ...prevQuantities,
          [ticketName]: currentQuantity + 1,
        };
      } else {
        toast.error('No more tickets available');
        return prevQuantities;
      }
    });
  };
  
  const handleBookTicket = (ticketName) => {
    const slug = slugify(event.name.toString(), { lower: true, strict: true });
    const quantity = ticketQuantities[ticketName] || 0;
    if (quantity === 0) {
      toast.error('Please select at least one ticket');
      return;
    }
  
    setIsLoading(true); // Show loading indicator
  
    // Send request to server to book ticket
    axiosInstance
      .post('/book-ticket', {
        eventId: eventId,
        ticketName: ticketName,
        quantity: quantity
      })
      .then((response) => {
        
        setIsLoading(false); // Hide loading indicator 
        
        const toastId = toast.loading("Booking is being processed")
        setTimeout(() => {
          setEvent(response.data.event);                 
          setTicketQuantities({})

          navigate(`/test/event/${slug}`, { state: { id: event._id } });
          toast.dismiss(toastId);
          toast.success('Ticket booked successfully!');
        }, 2000);
        
      })
      .catch((error) => {
        setIsLoading(false); // Hide loading indicator
        
        console.error(error.response.data.message);
          if (error.response.status === 500) {
            toast.error('An internal server error occurred.');
          } else {
            toast.error(error.response.data.message);
          }
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
                <><Box key={ticket.name} mt={2} display="flex" justifyContent="space-between">
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
                      {ticketQuantities[ticket.name] || 0}
                    </Typography>
                    <Button onClick={() => handleIncreaseQuantity(ticket.name)} sx={{ my: 5 }}>
                      <AddIcon />
                    </Button>
                  </Stack>


                  {/* Add "Book Ticket" button for each ticket type */}
                  <Button variant="contained" color="secondary"
                    onClick={() => handleBookTicket(ticket.name, ticketQuantities[ticket.name] || 0)}
                    sx={{ my: 5 }}
                  >
                    Book Ticket
                  </Button>

              </Box><Divider /></>
              ))}
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
