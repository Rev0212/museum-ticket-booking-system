const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  museum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Museum'
  },
  imageUrl: {
    type: String
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String
  },
  category: {
    type: String,
    enum: ['Exhibition', 'Workshop', 'Lecture', 'Performance'],
    required: true
  },
  ticketPrice: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Event', eventSchema);