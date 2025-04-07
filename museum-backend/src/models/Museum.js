const mongoose = require('mongoose');

const museumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  images: [{
    url: String,
    caption: String
  }],
  ticketPrices: {
    adult: {
      type: Number,
      default: 50
    },
    child: {
      type: Number,
      default: 0
    },
    senior: {
      type: Number,
      default: 20
    }
  },
  openingHours: {
    open: String,
    close: String
  },
  contactInfo: {
    phone: String,
    email: String,
    website: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Museum', museumSchema);