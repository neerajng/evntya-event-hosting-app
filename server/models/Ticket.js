const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ticketSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    bookingId: { type: String, required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ticketName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // Added price field
    total: { type: Number, required: true }, // Added total field
    sold: { type: Number, default: false }, // Added sold field
    status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
