const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  password: String,
  picture: String,
  mailOtp: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isBlocked: {
    type: Boolean,
    default: false
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
