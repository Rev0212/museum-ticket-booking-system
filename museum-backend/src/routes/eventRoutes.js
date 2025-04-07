const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const eventController = require('../controllers/eventController');

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', eventController.getAllEvents);

// @route   GET /api/events/upcoming
// @desc    Get upcoming events
// @access  Public
router.get('/upcoming', eventController.getUpcomingEvents);

// @route   GET /api/events/featured
// @desc    Get featured events
// @access  Public
router.get('/featured', eventController.getFeaturedEvents);

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', eventController.getEventById);

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (admin only)
router.post('/', auth, eventController.createEvent);

// @route   POST /api/events/with-calendar
// @desc    Create a new event and add to calendar
// @access  Private (admin only)
router.post('/with-calendar', auth, eventController.createEventWithCalendar);

// @route   GET /api/events/date-range
// @desc    Get events by date range (for calendar)
// @access  Public
router.get('/date-range', eventController.getEventsByDateRange);

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private (admin only)
router.put('/:id', auth, eventController.updateEvent);

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private (admin only)
router.delete('/:id', auth, eventController.deleteEvent);

module.exports = router;