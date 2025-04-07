const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const museumRoutes = require('./routes/museums');
// const bookingRoutes = require('./routes/bookings');
// const eventRoutes = require('./routes/events');
const newsRoutes = require('./routes/news');

const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/museums', museumRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/events', eventRoutes);
app.use('/api/news', newsRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;