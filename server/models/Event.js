const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  category: { type: String, trim: true },
  address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
  meetLink: { type: String, trim: true },
  description: { type: String, trim: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  image: { type: String, trim: true },
  tickets: [{
    name: { type: String, trim: true },
    price: Number,
    quantity: Number,
    sold: { type: Number, default: 0 }
  }],
  canceled: { type: Boolean, default: false },
  publishTime: { type: Date }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
