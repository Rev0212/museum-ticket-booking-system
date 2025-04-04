const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Museum = require('../models/Museum');
const User = require('../models/User');
const emailService = require('../services/emailService');
const whatsappService = require('../services/whatsappService');
const pdfService = require('../services/pdfService');
const qrGenerator = require('../utils/qrGenerator');
const path = require('path');

/**
 * Create a new booking
 */
exports.createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    museumId,
    visitDate,
    tickets,
    totalAmount,
    paymentMethod,
    contactInfo,
  } = req.body;

  try {
    // Check if museum exists
    const museum = await Museum.findById(museumId);
    if (!museum) {
      return res.status(404).json({ msg: 'Museum not found' });
    }

    // Create a booking reference number
    const bookingReference = generateBookingReference();

    // Create new booking
    const newBooking = new Booking({
      user: req.user.id,
      museum: museumId,
      bookingReference,
      visitDate,
      tickets,
      totalAmount,
      paymentMethod,
      contactInfo: contactInfo || {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone
      },
      status: 'confirmed'
    });

    // Generate QR code
    const qrCode = await qrGenerator.generateQR(bookingReference);
    newBooking.qrCode = qrCode;

    await newBooking.save();

    // Populate museum details
    const booking = await Booking.findById(newBooking._id)
      .populate('museum', 'name location images')
      .populate('user', 'name email');

    // Send confirmation email
    await emailService.sendBookingConfirmation(booking);

    res.status(201).json(booking);
  } catch (err) {
    console.error('Error in createBooking:', err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Get current bookings for logged in user
 */
exports.getCurrentBookings = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const bookings = await Booking.find({
      user: req.user.id,
      visitDate: { $gte: currentDate },
      status: { $in: ['confirmed', 'pending'] }
    })
      .populate('museum', 'name location images')
      .sort({ visitDate: 1 });

    res.json(bookings);
  } catch (err) {
    console.error('Error in getCurrentBookings:', err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Get booking history for logged in user
 */
exports.getBookingHistory = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const bookings = await Booking.find({
      user: req.user.id,
      $or: [
        { visitDate: { $lt: currentDate } },
        { status: { $in: ['cancelled', 'completed'] } }
      ]
    })
      .populate('museum', 'name location images')
      .sort({ visitDate: -1 });

    res.json(bookings);
  } catch (err) {
    console.error('Error in getBookingHistory:', err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Get booking by ID
 */
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('museum', 'name description location images operatingHours')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Check if the booking belongs to the requesting user or if admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (err) {
    console.error('Error in getBookingById:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server error');
  }
};

/**
 * Cancel booking
 */
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('museum', 'name')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Check if the booking belongs to the requesting user or if admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to cancel this booking' });
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ msg: 'Booking is already cancelled' });
    }

    // Check if booking date has passed
    if (new Date(booking.visitDate) < new Date()) {
      return res.status(400).json({ msg: 'Cannot cancel a booking with a past visit date' });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = Date.now();
    await booking.save();

    // Send cancellation email
    await emailService.sendBookingCancellation(booking);

    res.json(booking);
  } catch (err) {
    console.error('Error in cancelBooking:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server error');
  }
};

/**
 * Send ticket via email
 */
exports.sendTicketEmail = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('museum', 'name location images operatingHours')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Check if the booking belongs to the requesting user or if admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to access this booking' });
    }

    // Send email with ticket
    await emailService.sendTicket(booking);

    res.json({ msg: 'Ticket sent successfully to your email' });
  } catch (err) {
    console.error('Error in sendTicketEmail:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server error');
  }
};

/**
 * Send ticket via WhatsApp
 */
exports.sendTicketWhatsApp = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('museum', 'name location images')
      .populate('user', 'name phone');

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Check if the booking belongs to the requesting user or if admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to access this booking' });
    }

    // Check if user has phone number
    if (!booking.user.phone && !booking.contactInfo.phone) {
      return res.status(400).json({ msg: 'No phone number available to send WhatsApp message' });
    }

    // Send WhatsApp message with ticket
    const phoneNumber = booking.contactInfo.phone || booking.user.phone;
    await whatsappService.sendTicket(booking, phoneNumber);

    res.json({ msg: 'Ticket sent successfully via WhatsApp' });
  } catch (err) {
    console.error('Error in sendTicketWhatsApp:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server error');
  }
};

/**
 * Generate and download ticket as PDF
 */
exports.downloadTicketPDF = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('museum', 'name location images operatingHours')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Check if the booking belongs to the requesting user or if admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to access this booking' });
    }

    // Generate the PDF
    const pdfPath = await pdfService.generateTicketPDF(booking);
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${booking.bookingReference}.pdf`);
    
    // Send the file
    res.download(pdfPath, `ticket-${booking.bookingReference}.pdf`, (err) => {
      // Clean up the temporary file after sending
      pdfService.cleanupPDF(pdfPath);
      
      if (err) {
        console.error('Error sending PDF:', err);
      }
    });
  } catch (err) {
    console.error('Error in downloadTicketPDF:', err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Generate a unique booking reference number
 */
function generateBookingReference() {
  const prefix = 'MUSEUM';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${timestamp}-${random}`;
}