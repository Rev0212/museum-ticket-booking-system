const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/eventController');
const auth = require('../../middleware/auth');
const { check } = require('express-validator');

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', eventController.getAllEvents);

// @route   GET /api/events/upcoming
// @desc    Get upcoming events
// @access  Public
router.get('/upcoming', eventController.getUpcomingEvents);

// @route   GET /api/events/search
// @desc    Search events
// @access  Public
router.get('/search', eventController.searchEvents);

// @route   GET /api/events/museum/:museumId
// @desc    Get events by museum
// @access  Public
router.get('/museum/:museumId', eventController.getEventsByMuseum);

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', eventController.getEventById);

// @route   POST /api/events
// @desc    Create an event
// @access  Private/Admin
router.post('/', [
  auth,
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('museum', 'Museum ID is required').not().isEmpty(),
  check('date', 'Date is required').isISO8601().toDate(),
  check('time', 'Time is required').not().isEmpty(),
  check('location', 'Location is required').not().isEmpty()
], eventController.createEvent);

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private/Admin
router.put('/:id', auth, eventController.updateEvent);

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private/Admin
router.delete('/:id', auth, eventController.deleteEvent);

module.exports = router;