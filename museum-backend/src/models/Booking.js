const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  museum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Museum',
    required: true
  },
  museumName: {
    type: String,
    required: true
  },
  visitDate: {
    type: Date,
    required: true
  },
  tickets: [
    {
      type: {
        type: String,
        enum: ['adult', 'child', 'senior'],
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 0
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  contactInfo: {
    name: String,
    email: String,
    phone: String
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);