import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Box, Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import QRCode from 'qrcode.react'; 
// import { usePDF } from 'react-to-pdf';

export const Bookings = () => {
  const [bookings, setBookings] = useState([]);
//   const { toPDF, targetRef } = usePDF({filename: `Ticket.pdf`});

  useEffect(() => {
    // Fetch the bookings when the component mounts
    axiosInstance.get('/api/bookings') // Use your actual API endpoint here
      .then((response) => {
        setBookings(response.data);
        // console.log(response.data)
      })
      .catch((error) => {
        toast.error('Error fetching bookings');
      });
  }, []);

  return (
    <Box mt={2} >
      <Typography variant="h4" align="center" sx={{ fontWeight: 500, fontFamily: 'cursive' }} >
        Booking History
      </Typography>
      {bookings.length > 0 ? (
      bookings.map((booking) => (
      <Box  p={3}>
        <Box key={booking.bookingId}  sx={{ display: 'flex', justifyContent: 'center' }} mt={2} mb={2} mx={6}>
          <Card sx={{ flex: '2', minHeight: '300px' }}>
            <img src={booking.tickets[0].event.image} alt="Event" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
          </Card>
          <Card sx={{ flex: '4', minHeight: '300px', fontSize:'12px', fontFamily:'Arial' }}>
            <CardContent>
              <Typography variant="h5">{booking.tickets[0].event.name}</Typography>
              <Typography>Start Time: {new Date(booking.tickets[0].event.startTime).toLocaleString()}</Typography>
              <Typography>End Time: {new Date(booking.tickets[0].event.endTime).toLocaleString()}</Typography>
              <Typography>Category: {booking.tickets[0].event.category}</Typography>
        {booking.tickets[0].event.meetLink && (
            <Typography>
              Meet Link:{' '}
              <a href={booking.tickets[0].event.meetLink} target="_blank" rel="noreferrer">
                {booking.tickets[0].event.meetLink}
              </a>
            </Typography>
          )}
           {booking.tickets[0].event.address.location && (
            <Typography>Location: {booking.tickets[0].event.address.location}</Typography>
            )}
              <List disablePadding>
                {booking.tickets.map((ticket) => (
                  <ListItem key={ticket._id} sx={{ py: 1, pl: 0, pr:10 }}>
                    <ListItemText primary={`${ticket.ticketName}`} secondary={`Qty: ${ticket.quantity}`} />
                    <Typography variant="body2">{`₹${(ticket.price * ticket.quantity)}`}</Typography>
                  </ListItem>
                ))}
                <ListItem sx={{ py: 1, pl: 0, pr:10 }}>
                  <ListItemText primary="Total Amount Paid" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {`₹${booking.tickets.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0)}`}
                  </Typography>
                </ListItem>
              </List>    
            </CardContent>
          </Card>
          <Card sx={{ flex: '2', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <QRCode value={booking.bookingId.slice(-7)} /> {/* Generate a QR code with the last 7 digits of the bookingId */}
            <Typography variant="body1">{`Booking ID: ${booking.bookingId.slice(-7)}`}</Typography> {/* Display the last 7 digits of the bookingId */}
          </Card>
          {/* <Box sx={{ display:'flex', justifyContent: 'flex-end' ,}} mr={6}>
            <Button onClick={() => toPDF()}>Download the ticket</Button>
          </Box> */}
        </Box>   
        <Typography
            sx={{
                fontSize: '12px', 
                fontFamily: 'arial', 
            }}
            mx={6}
            >
            BOOKING DATE & TIME: {new Date(booking.tickets[0].createdAt).toLocaleString()}
        </Typography>

        <Divider/>
        </Box>  
        ))
      ) : ( 
        <Box  p={3}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={2} mb={2} mx={6}>
            <Typography variant="h5">
              Hey, no events booked yet.              
            </Typography>
          </Box>
        </Box>
        )  
      }
      <Toaster toastOptions={{ sx: { padding: '10px', fontSize: '14px' } }} position="top-right" />
    </Box>
  );
};
