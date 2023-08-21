const User = require('../models/User');
const Event = require('../models/Event');
const Address = require('../models/Address')
require('dotenv').config()

const bookTicket = async (req, res) => {
  const { eventId, ticketName, quantity } = req.body;  
  try {
    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Find the ticket
    const ticket = event.tickets.find(ticket => ticket.name === ticketName);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if the tickets are available
    if (ticket.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    // Book the tickets
    ticket.sold += quantity;
    ticket.quantity -= quantity;

    // Save the event
    await event.save();

    res.status(200).json({ message: 'Tickets booked successfully', event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
    bookTicket
  };