const express = require('express');
const router = express.Router();

// Import API routes
const authRoutes = require('./api/auth');
const bookingRoutes = require('./api/bookings');
const museumRoutes = require('./api/museums');
const newsRoutes = require('./api/news');
const eventRoutes = require('./api/events');

// Use API routes
router.use('/auth', authRoutes);
router.use('/bookings', bookingRoutes);
router.use('/museums', museumRoutes);
router.use('/news', newsRoutes);
router.use('/events', eventRoutes);

module.exports = router;