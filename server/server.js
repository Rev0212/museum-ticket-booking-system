const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const config = require('config');
const path = require('path');

// Initialize express app
const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.get('mongoURI'), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

connectDB();

// Initialize Middleware
app.use(express.json({ extended: false }));
app.use(cors());
app.use(morgan('dev')); // Logging

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ msg: 'Museum Booking API is working' });
});

// Define Routes - CORRECTED
app.use('/api/auth', require('./routes/api/auth'));
// Comment out the users route until it's implemented
// app.use('/api/users', require('./routes/api/users'));
app.use('/api/museums', require('./routes/api/museums'));
app.use('/api/events', require('./routes/api/events'));
app.use('/api/bookings', require('./routes/api/bookings'));
app.use('/api/news', require('./routes/api/news'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

// Define port
const PORT = process.env.PORT || config.get('port') || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));