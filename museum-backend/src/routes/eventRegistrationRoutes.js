const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const eventRegistrationController = require('../controllers/eventRegistrationController');

// @route   POST /api/event-registrations
// @desc    Register for an event
// @access  Private
router.post('/', auth, eventRegistrationController.registerForEvent);

// @route   GET /api/event-registrations
// @desc    Get user's event registrations
// @access  Private
router.get('/', auth, eventRegistrationController.getUserEventRegistrations);

// @route   GET /api/event-registrations/:id
// @desc    Get event registration by ID
// @access  Private
router.get('/:id', auth, eventRegistrationController.getEventRegistrationById);

// @route   PUT /api/event-registrations/:id/cancel
// @desc    Cancel event registration
// @access  Private
router.put('/:id/cancel', auth, eventRegistrationController.cancelEventRegistration);

// @route   GET /api/event-registrations/:id/download-ticket
// @desc    Download event ticket as PDF
// @access  Private
router.get('/:id/download-ticket', auth, eventRegistrationController.downloadEventTicket);

// @route   POST /api/event-registrations/:id/send-ticket/email
// @desc    Send event ticket via email
// @access  Private
router.post('/:id/send-ticket/email', auth, eventRegistrationController.sendEventTicketEmail);

module.exports = router;