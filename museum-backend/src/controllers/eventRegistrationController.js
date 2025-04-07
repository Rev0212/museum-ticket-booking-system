const EventRegistration = require('../models/EventRegistration');
const Event = require('../models/Event');
const { generateQRCode } = require('../utils/qrCodeGenerator');
const { generateEventTicketPDF } = require('../utils/pdfGenerator');
const { sendEventTicketEmail } = require('../utils/emailService');

// Generate a random registration reference
const generateRegistrationReference = () => {
  return 'EVENT-' + Math.floor(100000 + Math.random() * 900000);
};

// Register for an event
exports.registerForEvent = async (req, res) => {
  try {
    const {
      eventId,
      attendees,
      totalAmount,
      paymentMethod,
      notes
    } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Create registration reference
    const registrationReference = generateRegistrationReference();

    // Create a new registration
    const newRegistration = new EventRegistration({
      event: eventId,
      user: req.user.id,
      attendees,
      totalAmount,
      paymentMethod,
      registrationReference,
      notes,
      registrationStatus: 'confirmed'
    });

    // Generate QR code
    const qrCodeDataUrl = await generateQRCode(
      newRegistration._id.toString(), 
      registrationReference
    );
    newRegistration.qrCode = qrCodeDataUrl;

    // Save registration
    await newRegistration.save();

    res.status(201).json(newRegistration);
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user's event registrations
exports.getUserEventRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration
      .find({ user: req.user.id })
      .populate('event', 'title startDate endDate location category imageUrl')
      .sort({ registrationDate: -1 });
    
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get event registration by ID
exports.getEventRegistrationById = async (req, res) => {
  try {
    const registration = await EventRegistration
      .findById(req.params.id)
      .populate('event');
    
    if (!registration) {
      return res.status(404).json({ msg: 'Event registration not found' });
    }
    
    // Check if the registration belongs to the user
    if (registration.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    res.json(registration);
  } catch (error) {
    console.error('Error fetching event registration:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Cancel event registration
exports.cancelEventRegistration = async (req, res) => {
  try {
    const registration = await EventRegistration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ msg: 'Event registration not found' });
    }
    
    // Check if the registration belongs to the user
    if (registration.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Update registration status
    registration.registrationStatus = 'cancelled';
    await registration.save();
    
    res.json(registration);
  } catch (error) {
    console.error('Error cancelling event registration:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Download event ticket
exports.downloadEventTicket = async (req, res) => {
  try {
    const registration = await EventRegistration
      .findById(req.params.id)
      .populate('event');
    
    if (!registration) {
      return res.status(404).json({ msg: 'Event registration not found' });
    }
    
    // Check if the registration belongs to the user
    if (registration.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Generate PDF
    const pdfBuffer = await generateEventTicketPDF(registration, registration.qrCode);
    
    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=event-ticket-${registration.registrationReference}.pdf`);
    
    // Send PDF
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Error downloading event ticket:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Send event ticket via email
exports.sendEventTicketEmail = async (req, res) => {
  try {
    const registration = await EventRegistration
      .findById(req.params.id)
      .populate('event');
    
    if (!registration) {
      return res.status(404).json({ msg: 'Event registration not found' });
    }
    
    // Check if the registration belongs to the user
    if (registration.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Generate PDF
    const pdfBuffer = await generateEventTicketPDF(registration, registration.qrCode);
    
    // Send email
    await sendEventTicketEmail(registration, pdfBuffer);
    
    res.json({ msg: 'Email sent successfully' });
    
  } catch (error) {
    console.error('Error sending event ticket email:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};