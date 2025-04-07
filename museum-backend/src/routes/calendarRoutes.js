const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const calendarController = require('../controllers/calendarController');

// @route   GET /api/calendar
// @desc    Get all calendar events
// @access  Private
router.get('/', auth, calendarController.getAllCalendarEvents);

// @route   GET /api/calendar/:year/:month
// @desc    Get calendar events by month
// @access  Private
router.get('/:year/:month', auth, calendarController.getCalendarEventsByMonth);

// @route   POST /api/calendar
// @desc    Create a personal calendar event
// @access  Private
router.post('/', auth, calendarController.createCalendarEvent);

// @route   POST /api/calendar/import-events
// @desc    Import all museum events to calendar
// @access  Private
router.post('/import-events', auth, calendarController.importAllEventsToCalendar);

module.exports = router;