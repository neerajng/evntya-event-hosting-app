import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import {Button, Box, Alert, Card, CardMedia, Typography, List, ListItem, ListItemText, Divider, CardContent } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react'; 
import { usePDF } from 'react-to-pdf';


export const BookingConfirmation = () => {
  const [bookingData, setBookingData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const bookingId = location.state?.bookingId;
  const { toPDF, targetRef } = usePDF({filename: `Ticket-${bookingId}.pdf`});

  useEffect(() => {
    (!bookingId) ? navigate(-1) :

    axiosInstance.patch('/api/confirmation', { bookingId:bookingId })
      .then(response => {
        setBookingData(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [bookingId,navigate]);

  if (!bookingData) {
    return <div>Loading...</div>;
  }

  const totalAmount = bookingData.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0);

  return (
    <Box >
    <Alert severity="success">Thanks! You Ticket(s) has been booked!!</Alert>
    <Box ref={targetRef} sx={{ display: 'flex', justifyContent: 'center' }} mt={2} mx={6}>
      <Card sx={{ flex: '2', minHeight: '300px',  }}>
        <CardMedia
          component="img"
          sx={{ height: '100%', objectFit: 'cover' }}
          image={bookingData[0].event.image} // Assuming the event has an image field
          alt="Event image"          
        />
      </Card>
      <Card sx={{ flex: '4', minHeight: '300px', fontSize:100,fontFamily:'Arial'}}>
        <CardContent>
          <Typography variant="h5">{bookingData[0].event.name}</Typography> {/* Event Name */}
          <Typography>Start Time: {new Date(bookingData[0].event.startTime).toLocaleString()}</Typography>
          <Typography>End Time: {new Date(bookingData[0].event.endTime).toLocaleString()}</Typography>
          <Typography>Category: {bookingData[0].event.category}</Typography>
          {bookingData[0].event.meetLink && (
            <Typography>
              Meet Link:{' '}
              <a href={bookingData[0].event.meetLink} target="_blank" rel="noreferrer">
                {bookingData[0].event.meetLink}
              </a>
            </Typography>
          )}
          {bookingData[0].event.address.location && (
            <Typography>Location: {bookingData[0].event.address.location}</Typography>
          )}
          
            <List disablePadding>
              {bookingData.map((ticket) => (
                <React.Fragment key={ticket._id}>
                  <ListItem sx={{ py: 1, pl: 0, pr:10  }}>
                    <ListItemText primary={`${ticket.ticketName}`} secondary={`Qty: ${ticket.quantity}`} />
                    <Typography variant="body2">{`₹${(ticket.price * ticket.quantity)}`}</Typography>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              <ListItem sx={{ py: 1, pl: 0, pr:10 }}>
                <ListItemText primary="Total Amount Paid"  />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {`₹${totalAmount}`}
                </Typography>
              </ListItem>
            </List>    

        </CardContent>
      </Card>
      <Card sx={{ flex: '2', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <QRCode value={bookingId.slice(-7)} /> {/* Generate a QR code with the last 7 digits of the bookingId */}
      <Typography variant="body1">{`Booking ID: ${bookingId.slice(-7)}`}</Typography> {/* Display the last 7 digits of the bookingId */}
    </Card>

    </Box>
    <Box sx={{ display:'flex', justifyContent: 'flex-end' ,}} mr={6}>
      <Button onClick={() => toPDF()}>Download the ticket</Button>
    </Box>
    </Box>
  );
};