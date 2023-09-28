const express = require('express');
const router = express.Router();

const { proceedCheckout, stripePay, bookingConfirmation, bookings  } = require('../controllers/ticketCtrl');   

router.post('/proceed-checkout', proceedCheckout)
router.post('/create-payment-intent', stripePay)
router.patch('/confirmation', bookingConfirmation)
router.get('/bookings', bookings)

module.exports = router;