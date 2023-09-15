import React from 'react';
import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

export const SummaryPage = ({ form, bookingData }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Booking summary
      </Typography>

      <List disablePadding>
  {bookingData.tickets.map((ticket, index) => (
    <ListItem key={index} sx={{ py: 1, px: 0 }}>
      <ListItemText primary={ticket.ticketName} secondary={ticket.quantity} />
      <Typography variant="body2">{`$${(ticket.price * ticket.quantity).toFixed(2)}`}</Typography>
    </ListItem>
  ))}
  <ListItem sx={{ py: 1, px: 0 }}>
    <ListItemText primary="Total" />
    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
  {`$${bookingData.tickets.reduce((total, ticket) => total + ticket.price * ticket.quantity, 0).toFixed(2)}`}
</Typography>

  </ListItem>
</List>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
            Attendee Details
          </Typography>
          <Typography gutterBottom>{form.email}</Typography>
          <Typography gutterBottom>{form.phone}</Typography>
          <Typography gutterBottom>{form.city}</Typography>
          <Typography gutterBottom>{form.state}</Typography>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
            Payment details
          </Typography>
          <Grid container>
            <React.Fragment key={form.cardName}>
              <Grid item xs={6}>
                <Typography gutterBottom>Card holder</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom>{form.cardName}</Typography>
              </Grid>
            </React.Fragment>
            <React.Fragment key={form.cardNumber}>
              <Grid item xs={6}>
                <Typography gutterBottom>Card number</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom>{form.cardNumber}</Typography>
              </Grid>
            </React.Fragment>
            <React.Fragment key={form.expDate}>
              <Grid item xs={6}>
                <Typography gutterBottom>Expiry Date</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom>{form.expDate}</Typography>
              </Grid>
            </React.Fragment>
            {/* Add more fields as needed */}
          </Grid>
        </Grid>
      </Grid>

    </Box>
  );
};
