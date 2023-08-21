const express = require('express');
const router = express.Router();
const {checkBlocked} = require('../middlewares/checkBlocked')

const { bookTicket } = require('../controllers/ticketCtrl');

router.post('/book-ticket', checkBlocked, bookTicket)


module.exports = router;