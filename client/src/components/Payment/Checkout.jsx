import React,{ useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography
} from '@mui/material';

import toast, { Toaster } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import { AttendeeDetails } from './AttendeeDetails';
import { PaymentDetails } from './PaymentDetails'; 
import { SummaryPage } from './SummaryPage'; 


const steps = ['Attendee Details', 'Review and Confirm', 'Confirm Payment'];

function getStepContent(step, form, handleChange, bookingData, clientSecret) {
  switch (step) {
    case 0:
      return <AttendeeDetails form={form} handleChange={handleChange} />;
    case 1:
      return <SummaryPage form={form} bookingData={bookingData} />; 
    case 2:
      return <PaymentDetails form={form} handleChange={handleChange} clientSecret={clientSecret} />;
    default:
      throw new Error('Unknown step');
  }
}

export const Checkout = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.data; 
  console.log(location.key)
  useEffect(() => {
    (!bookingData) ? navigate(-1) :

    // Create PaymentIntent as soon as the page loads
    axiosInstance
      .post("/api/create-payment-intent", {totalPrice : bookingData.totalPrice})
      .then((response) => {
        setClientSecret(response.data.clientSecret);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }, [bookingData]);
  

  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    state: '',
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = (fields) => {
    const phoneRegex = /^\d{10}$/;
    // const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    // const cvvRegex = /^\d{3}$/;

    // if (!emailRegex.test(form.email)) {
    //   toast.error('Please enter a valid email');
    //   return false;
    // }

    if (!phoneRegex.test(form.phone)) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    for (let key of fields) {
      if (form[key] === '') {
        toast.error(`Please fill in the ${key}`);
        return false;
      }
    }

    // if (fields.includes('cvv') && !cvvRegex.test(form.cvv)) {
    //   toast.error('Please enter a valid CVV number');
    //   return false;
    // }

    return true;
  };

  const handleNext = () => {
    const fieldsToValidate = activeStep === 0 ? ['name', 'phone', 'city', 'state'] :
      ['cardName', 'cardNumber', 'expDate', 'cvv'];
    if (!validateForm(fieldsToValidate)) {
      return;
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleConfirm = async () => {
    try {
      console.log(form)
      const response = await axiosInstance.post('/api/confirm-ticket', { form });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>

          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>

          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box>
            {getStepContent(activeStep, form, handleChange, bookingData, clientSecret)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>

              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                  Back
                </Button>
              )}

              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                sx={{ mt: 3, ml: 1 }}
              >
                {activeStep === steps.length - 1 ? 'Confirm Ticket' : 'Next'}
              </Button>

            </Box>
          </Box>

        </Paper>
      </Container>
      <Toaster toastOptions={{ sx: { padding: '10px', fontSize: '14px' } }} position="top-center" />

    </Box>
  );
}