import React,{ useState } from 'react';
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
import {useLocation } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInterceptors/axiosConfig'
import {AttendeeDetails} from './AttendeeDetails';
import {PaymentDetails} from './PaymentDetails';
import {SummaryPage} from './SummaryPage';


const steps = ['Attendee Details', 'Payment Details', 'Review and Confirm'];

function getStepContent(step, form, handleChange, bookingData) {
  switch (step) {
    case 0:
      return <AttendeeDetails form={form} handleChange={handleChange}/>;
    case 1:
      return <PaymentDetails form={form} handleChange={handleChange}/>;
    case 2:
      return <SummaryPage form={form} bookingData={bookingData}/>;
    default:
      throw new Error('Unknown step');
  }
}

export const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const location = useLocation();
  const bookingData = location.state.data;
  console.log(bookingData)

  const [form, setForm] = useState({
    email: '',
    phone: '',
    city: '',
    state: '',
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: ''
  });
  

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = (fields) => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    const phoneRegex = /^\d{10}$/; // Adjust this regex according to the phone number format you expect
    const cvvRegex = /^\d{3}$/;

    if (!emailRegex.test(form.email)) {
      toast.error('Please enter a valid email');
      return false;
    }
  
    if (!phoneRegex.test(form.phone)) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    
  
    // Continue with other field validations...
  
    for (let key of fields) {
      if (form[key] === '') {
        toast.error(`Please fill in the ${key}`);
        return false;
      }
    }

    if (fields.includes('cvv') && !cvvRegex.test(form.cvv)) {
      toast.error('Please enter a valid CVV number');
      return false;
    }
  
    return true;
  };

  const handleNext = () => {
    const fieldsToValidate = activeStep === 0 ? ['email', 'phone', 'city', 'state'] : 
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
      const response = await axiosInstance.post('/api/confirm-ticket', {form});
      // Handle response here
      console.log(response.data);
    } catch (error) {
      // Handle error here
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
              {getStepContent(activeStep, form, handleChange, bookingData)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}

              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handleConfirm : handleNext}
                sx={{ mt: 3, ml: 1 }}
              >
                {activeStep === steps.length - 1 ? 'Confirm Ticket' : 'Next'}
              </Button>


              </Box>
            </Box>

        </Paper>
      </Container>
      <Toaster toastOptions={{ sx: { padding: '10px', fontSize: '14px' } }} position="top-right" />

    </Box>
  );
}