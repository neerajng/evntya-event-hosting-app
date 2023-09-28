import React from 'react';
import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

export const SummaryPage = ({ form, bookingData, setTotal }) => {
  return (
    <Box>
      <Typography variant="h5" mb={2}gutterBottom sx={{ fontWeight: 'bold' }}>
        Booking summary
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: '600' }}>
      Ticket(s) - {bookingData.eventName} 
      </Typography>

      <List disablePadding>
        {bookingData.tickets.map((ticket, index) => (
          <ListItem key={index} sx={{ py: 1, px: 0 }}>
            <ListItemText primary={ticket.ticketName} secondary={`Qty : ${ticket.quantity}`} />
            <Typography variant="body2">{`₹${(ticket.price * ticket.quantity).toFixed(2)}`}</Typography>
          </ListItem>
        ))}
        <Divider/>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {`₹${bookingData.totalPrice.toFixed(2)}`}
          </Typography>

        </ListItem>
      </List>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
            Attendee Details
          </Typography>
          <Typography gutterBottom>{form.name}</Typography>
          <Typography gutterBottom>{form.phone}</Typography>
          <Typography gutterBottom>{form.city}</Typography>
          <Typography gutterBottom>{form.state}</Typography>
        </Grid>        
      </Grid>

    </Box>
  );
};
