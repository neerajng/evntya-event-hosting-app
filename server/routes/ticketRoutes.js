const express = require('express');
const router = express.Router();

const { proceedCheckout, confirmTicket, stripePay } = require('../controllers/ticketCtrl');   

router.post('/proceed-checkout', proceedCheckout)
router.post('/confirm-ticket', confirmTicket)

router.post('/create-payment-intent', stripePay)

module.exports = router;