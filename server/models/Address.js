const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    location: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true }
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
