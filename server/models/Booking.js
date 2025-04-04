const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['adult', 'child', 'senior', 'student']
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
}, { _id: false });

const ContactInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  }
}, { _id: false });

const BookingSchema = new mongoose.Schema({
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
  bookingReference: {
    type: String,
    required: true,
    unique: true
  },
  qrCode: {
    type: String
  },
  visitDate: {
    type: Date,
    required: true
  },
  tickets: [TicketSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  contactInfo: ContactInfoSchema,
  createdAt: {
    type: Date,
    default: Date.now
  },
  cancelledAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
BookingSchema.index({ user: 1, visitDate: 1 });
BookingSchema.index({ bookingReference: 1 });
BookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', BookingSchema);