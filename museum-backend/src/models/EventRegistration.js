const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: String,
    ticketType: {
      type: String,
      enum: ['standard', 'vip', 'student', 'senior'],
      default: 'standard'
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  registrationStatus: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled'],
    default: 'confirmed'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking'],
    required: true
  },
  registrationReference: {
    type: String,
    unique: true
  },
  qrCode: {
    type: String
  },
  notes: String
});

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);