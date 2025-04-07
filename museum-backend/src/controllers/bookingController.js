const Booking = require('../models/Booking');
const Museum = require('../models/Musem'); // Changed from '../models/Museum'
const User = require('../models/User');
const { generateQRCode } = require('../utils/qrCodeGenerator');
const { generateTicketPDF } = require('../utils/pdfGenerator');
const { sendTicketEmail } = require('../utils/emailService');

// Generate a random booking reference
const generateBookingReference = () => {
  return 'MUSEUM-' + Math.floor(100000 + Math.random() * 900000);
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      museum,
      visitDate,
      tickets,
      totalAmount,
      paymentMethod,
      contactInfo
    } = req.body;

    // Check if museum exists
    const museumData = await Museum.findById(museum);
    if (!museumData) {
      return res.status(404).json({ msg: 'Museum not found' });
    }

    // Create booking reference
    const bookingReference = generateBookingReference();

    // Create a new booking
    const newBooking = new Booking({
      user: req.user.id,
      museum,
      museumName: museumData.name,
      visitDate,
      tickets,
      totalAmount,
      paymentMethod,
      contactInfo,
      bookingReference,
      status: 'confirmed'
    });

    // Generate QR code
    const qrCodeDataUrl = await generateQRCode(newBooking._id.toString(), bookingReference);
    newBooking.qrCode = qrCodeDataUrl;

    // Save booking
    await newBooking.save();

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .sort({ visitDate: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user's current (upcoming) bookings
exports.getCurrentBookings = async (req, res) => {
  try {
    const now = new Date();
    const bookings = await Booking.find({
      user: req.user.id,
      visitDate: { $gte: now },
      status: { $ne: 'cancelled' }
    }).sort({ visitDate: 1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching current bookings:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user's booking history
exports.getBookingHistory = async (req, res) => {
  try {
    const now = new Date();
    const bookings = await Booking.find({
      user: req.user.id,
      $or: [
        { visitDate: { $lt: now } },
        { status: 'cancelled' }
      ]
    }).sort({ visitDate: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching booking history:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    // Check if the booking belongs to the user
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    // Check if the booking belongs to the user
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Update booking status
    booking.status = 'cancelled';
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Download ticket
exports.downloadTicket = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    // Check if the booking belongs to the user
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Generate PDF
    const pdfBuffer = await generateTicketPDF(booking, booking.qrCode);
    
    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${booking.bookingReference}.pdf`);
    
    // Send PDF
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Error downloading ticket:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Send ticket via email
exports.sendTicketEmail = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    // Check if the booking belongs to the user
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Generate PDF
    const pdfBuffer = await generateTicketPDF(booking, booking.qrCode);
    
    // Send email
    await sendTicketEmail(booking, pdfBuffer);
    
    res.json({ msg: 'Email sent successfully' });
    
  } catch (error) {
    console.error('Error sending ticket email:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Send ticket via WhatsApp (mock implementation)
exports.sendTicketWhatsApp = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    // Check if the booking belongs to the user
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // In a real implementation, you would integrate with WhatsApp API
    // For this example, we'll just return a success message
    
    res.json({ msg: 'WhatsApp message sent successfully' });
    
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};