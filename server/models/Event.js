const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  museum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Museum',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  time: {
    type: String,
    required: true
  },
  endTime: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  category: {
    type: String,
    enum: ['Exhibition', 'Workshop', 'Lecture', 'Performance', 'Tour', 'Special Event'],
    default: 'Exhibition'
  },
  ticketPrice: {
    type: Number,
    default: 0
  },
  isFree: {
    type: Boolean,
    default: false
  },
  limitedSeats: {
    type: Boolean,
    default: false
  },
  totalSeats: {
    type: Number
  },
  bookedSeats: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  organizer: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);