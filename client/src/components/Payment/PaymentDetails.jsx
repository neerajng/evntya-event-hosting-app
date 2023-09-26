import React, { useState } from "react";
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Typography
} from '@mui/material';
import { toast } from "react-hot-toast";

export const PaymentDetails = ({ form, handleChange, clientSecret, handleSubmit }) => {
  // const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  
  
  // useEffect(() => {
  //   if (!stripe) {
  //     return;
  //   }
  //   // const clientSecret = new URLSearchParams(window.location.search).get(
  //   //   "payment_intent_client_secret"
  //   // );
  //   console.log(clientSecret)

  //   if (!clientSecret) {
  //     return;
  //   }
    
  //   stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      
  //     switch (paymentIntent.status) {
  //       case "succeeded":
  //         setMessage("Payment succeeded!");
  //         break;
  //       case "processing":
  //         setMessage("Your payment is processing.");
  //         break;
  //       case "requires_payment_method":
  //         setMessage("Your payment was not successful, please try again.");
  //         break;
  //       default:
  //         setMessage("Something went wrong.");
  //         break;
  //     }
  //   });
  // }, [stripe]);

  

  const paymentElementOptions = {
    layout: "tabs"
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      
      {/* <LinkAuthenticationElement
          id="link-authentication-element"
          onChange={(event) => setEmail(event.value)}
      /> */}
      <CardElement id="payment-element" options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
    

    </Box>
  );
};
