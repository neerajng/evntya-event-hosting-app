import React from "react";
import {
  CardElement,
} from "@stripe/react-stripe-js";

import {
  Box,
  Typography
} from '@mui/material';

export const PaymentDetails = ({ form, handleChange, clientSecret, getHandleSubmit }) => {
  
  const paymentElementOptions = {
    layout: "tabs"
  }

  return (
    <Box>
      <Typography variant="h6"  gutterBottom>
        Payment method
      </Typography>
      <Box py={2}>
      <CardElement id="payment-element" options={paymentElementOptions} />
      </Box>
    

    </Box>
  );
};
