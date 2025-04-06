const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', auth, bookingController.createBooking);

// @route   GET /api/bookings
// @desc    Get all user's bookings
// @access  Private
router.get('/', auth, bookingController.getUserBookings);

// @route   GET /api/bookings/current
// @desc    Get user's current (upcoming) bookings
// @access  Private
router.get('/current', auth, bookingController.getCurrentBookings);

// @route   GET /api/bookings/history
// @desc    Get user's booking history
// @access  Private
router.get('/history', auth, bookingController.getBookingHistory);

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth, bookingController.getBookingById);

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', auth, bookingController.cancelBooking);

// @route   GET /api/bookings/:id/download-ticket
// @desc    Download ticket as PDF
// @access  Private
router.get('/:id/download-ticket', auth, bookingController.downloadTicket);

// @route   POST /api/bookings/:id/send-ticket/email
// @desc    Send ticket via email
// @access  Private
router.post('/:id/send-ticket/email', auth, bookingController.sendTicketEmail);

// @route   POST /api/bookings/:id/send-ticket/whatsapp
// @desc    Send ticket via WhatsApp
// @access  Private
router.post('/:id/send-ticket/whatsapp', auth, bookingController.sendTicketWhatsApp);

module.exports = router;