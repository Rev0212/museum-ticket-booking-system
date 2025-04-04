const mongoose = require('mongoose');

const OperatingHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  open: {
    type: String,
    required: true
  },
  close: {
    type: String,
    required: true
  },
  closed: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const MuseumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    }
  },
  images: [{
    type: String
  }],
  ticketPrice: {
    adult: {
      type: Number,
      required: true
    },
    child: {
      type: Number,
      required: true
    },
    senior: {
      type: Number,
      required: true
    },
    student: {
      type: Number,
      required: true
    }
  },
  operatingHours: [OperatingHoursSchema],
  contactInfo: {
    email: String,
    phone: String,
    website: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  facilities: [{
    type: String,
    enum: ['Parking', 'Cafe', 'Gift Shop', 'Wheelchair Access', 'Audio Guide', 'Restrooms']
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  wikipediaUrl: {
    type: String
  },
  category: {
    type: String,
    enum: ['Art', 'History', 'Science', 'Technology', 'Cultural', 'Natural History', 'Heritage'],
    default: 'History'
  }
}, { timestamps: true });

module.exports = mongoose.model('Museum', MuseumSchema);