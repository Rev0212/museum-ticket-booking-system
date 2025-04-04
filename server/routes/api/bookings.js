const express = require('express');
const router = express.Router();
const bookingController = require('../../controllers/bookingController');
const auth = require('../../middleware/auth');
const { check } = require('express-validator');

// @route   POST /api/bookings
// @desc    Create a booking
// @access  Private
router.post('/', [
  auth,
  check('visitDate', 'Visit date is required').isISO8601().toDate(),
  check('tickets', 'Tickets are required').isArray({ min: 1 }),
  check('tickets.*.type', 'Ticket type is required').isIn(['adult', 'child', 'senior', 'student']),
  check('tickets.*.quantity', 'Ticket quantity is required').isInt({ min: 1 }),
  check('tickets.*.price', 'Ticket price is required').isNumeric(),
  check('totalAmount', 'Total amount is required').isNumeric(),
  check('paymentMethod', 'Payment method is required').isIn(['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet'])
], bookingController.createBooking);

// @route   GET /api/bookings/current
// @desc    Get current bookings for logged in user
// @access  Private
router.get('/current', auth, bookingController.getCurrentBookings);

// @route   GET /api/bookings/history
// @desc    Get booking history for logged in user
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

// @route   POST /api/bookings/:id/send-ticket/email
// @desc    Send ticket via email
// @access  Private
router.post('/:id/send-ticket/email', auth, bookingController.sendTicketEmail);

// @route   POST /api/bookings/:id/send-ticket/whatsapp
// @desc    Send ticket via WhatsApp
// @access  Private
router.post('/:id/send-ticket/whatsapp', auth, bookingController.sendTicketWhatsApp);

// @route   GET /api/bookings/:id/download-ticket
// @desc    Download ticket as PDF
// @access  Private
router.get('/:id/download-ticket', auth, bookingController.downloadTicketPDF);

module.exports = router;