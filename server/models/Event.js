const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  category: String,
  address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
  meetLink: String,
  description: String,
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: String,
  tickets: [{
    name: String,
    price: Number,
    quantity: Number,
    sold: { type: Number, default: 0 }
  }],
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
