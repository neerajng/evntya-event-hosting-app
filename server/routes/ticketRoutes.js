const express = require('express');
const router = express.Router();

const { proceedCheckout, confirmTicket } = require('../controllers/ticketCtrl');

router.post('/proceed-checkout', proceedCheckout)
router.post('/confirm-ticket', confirmTicket)

module.exports = router;