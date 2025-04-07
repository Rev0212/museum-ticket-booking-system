const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  source: {
    type: String
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String
  },
  url: {
    type: String
  }
});

module.exports = mongoose.model('News', newsSchema);