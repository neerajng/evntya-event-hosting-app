const User = require('../models/User');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket')
const uuid = require('uuid');
const bookingId = uuid.v4();
const stripe = require('stripe')

const proceedCheckout = async (req, res) => {
  try {
    const { eventId, ticketQuantities, userId } = req.body.data;
    console.log(ticketQuantities)
    console.log("proceed")
    if (!eventId || !ticketQuantities || !userId) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tickets = [];
    const errors = [];

    for (let [ticketName, ticketDetails] of Object.entries(ticketQuantities)) {
      // Validate ticket availability here
    
      const ticket = new Ticket({
        bookingId: bookingId,
        event: eventId,
        user: userId,
        ticketName: ticketName,
        quantity: ticketDetails.count,
        price: ticketDetails.price,
        total: ticketDetails.total,
        sold: ticketDetails.sold,
        status: 'pending'
      });
      
      console.log(ticket)
      try {
        await ticket.save();
        tickets.push(ticket);
      } catch (err) {
        console.log(err)
        errors.push({ ticketName, error: err.message });
        // Delete the ticket
        await Ticket.deleteOne({ _id: ticket.bookingId });
      }
      
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Some tickets could not be reserved', errors });
    }

    res.status(201).json({ message: 'Ticket(s) successfully reserved', tickets });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};


const confirmTicket = async (req, res) => {
  const { form } = await req.body;

  console.log(form)
}



module.exports = {
    proceedCheckout,
    confirmTicket
  };