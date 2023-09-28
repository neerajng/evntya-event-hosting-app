const User = require('../models/User');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket')
const uuid = require('uuid');
const { v4 : uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SEC_KEY)

const proceedCheckout = async (req, res) => {
  try {
    const { eventId, ticketQuantities, userId } = req.body.data;
    const bookingId = uuid.v4();
    console.log(ticketQuantities)
    console.log("proceed")
    if (!eventId || !ticketQuantities || !userId ) {
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

const stripePay =  async (req, res) => {
  const { totalPrice } = req.body;
  console.log(totalPrice)
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount:totalPrice*100,
    currency: "inr",
    metadata : {
      
    }
    // description:"Created by stripe.com/docs demo",
  });
  console.log('PaymentIntent ID:', paymentIntent.id);

  res.send({
    clientSecret: paymentIntent.client_secret,    
  });
}

const bookingConfirmation = async (req, res) => {
  try {
    const bookingId = req.body.bookingId;
    console.log("bookingId"+bookingId)
    // Fetch the booking data from the database using the bookingId
    const tickets = await Ticket.find({ bookingId });
    console.log("first:"+ tickets);
    // Update the status and sold fields of each ticket
    tickets.forEach(async (ticket) => {
      ticket.status = 'confirmed';
      await ticket.save();
    });

    console.log("second:"+ tickets);

    // Assuming all tickets belong to the same event, fetch the event associated with the first ticket
    const event = await Event.findById(tickets[0].event);
    console.log(event)    

    // Update the total and sold fields of each ticket in the event's tickets array
    event.tickets.forEach((eventTicket) => {
      const ticket = tickets.find(ticket => String(ticket.ticketName) === String(eventTicket.name));
      if (ticket) {
        console.log(ticket)
        eventTicket.quantity -= ticket.quantity;
        eventTicket.sold += ticket.quantity;
      }
    });

    // Save the updated event
    await event.save();

    // Populate the event data
    const bookingData = await Ticket.find({ bookingId }).populate({
      path: 'event',
      populate: { path: 'address' }
    });
    console.log(bookingData)
    
    // Send the updated booking data in the response
    res.json(bookingData);
  } catch (error) {
    console.error('There was an error!', error);
    
    // Send a 500 Internal Server Error response if something goes wrong
    res.status(500).send('Internal Server Error');
  }
}

const bookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);
    
    // Find all unique booking IDs for the logged-in user
    const bookingIds = await Ticket.distinct('bookingId', { user: userId });
    console.log("bookingIds" + bookingIds);
    
    // For each booking ID, find the corresponding tickets and populate the event and address data
    const bookings = await Promise.all(bookingIds.map(async (bookingId) => {
      const tickets = await Ticket.find({ bookingId }).populate({
        path: 'event',
        populate: { path: 'address' }
      });
      return { bookingId, tickets };
    }));
    console.log("bookings:" + bookings);
    
    // Send the bookings as the response
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings', error);
    res.status(500).json({ message: 'Server error' });
  }
};
 

module.exports = {
    proceedCheckout,
    stripePay,
    bookingConfirmation,
    bookings
  };