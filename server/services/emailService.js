const nodemailer = require('nodemailer');
const config = require('config');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

// Create reusable transporter
const transporter = nodemailer.createTransport(config.get('emailService'));

// Email templates directory
const templatesDir = path.join(__dirname, '../templates/emails');

/**
 * Send booking confirmation email
 */
exports.sendBookingConfirmation = async (booking) => {
  try {
    // Format date
    const formattedDate = new Date(booking.visitDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Render email template
    const htmlContent = await ejs.renderFile(
      path.join(templatesDir, 'booking-confirmation.ejs'),
      {
        booking,
        formattedDate,
        museumName: booking.museum.name,
        bookingReference: booking.bookingReference,
        tickets: booking.tickets,
        totalAmount: booking.totalAmount,
        userName: booking.user.name
      }
    );

    // Setup email data
    const mailOptions = {
      from: `"Indian Heritage Museums" <${config.get('emailService.auth.user')}>`,
      to: booking.user.email,
      subject: `Booking Confirmation - ${booking.bookingReference}`,
      html: htmlContent,
      attachments: [{
        filename: 'ticket-qr.png',
        content: booking.qrCode.split(';base64,').pop(),
        encoding: 'base64'
      }]
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Booking confirmation email sent to ${booking.user.email}`);
  } catch (err) {
    console.error('Error sending booking confirmation email:', err);
    throw err;
  }
};

/**
 * Send booking cancellation email
 */
exports.sendBookingCancellation = async (booking) => {
  try {
    // Render email template
    const htmlContent = await ejs.renderFile(
      path.join(templatesDir, 'booking-cancellation.ejs'),
      {
        booking,
        museumName: booking.museum.name,
        bookingReference: booking.bookingReference,
        totalAmount: booking.totalAmount,
        userName: booking.user.name
      }
    );

    // Setup email data
    const mailOptions = {
      from: `"Indian Heritage Museums" <${config.get('emailService.auth.user')}>`,
      to: booking.user.email,
      subject: `Booking Cancellation - ${booking.bookingReference}`,
      html: htmlContent
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Booking cancellation email sent to ${booking.user.email}`);
  } catch (err) {
    console.error('Error sending booking cancellation email:', err);
    throw err;
  }
};

/**
 * Send ticket via email
 */
exports.sendTicket = async (booking) => {
  try {
    // Format date
    const formattedDate = new Date(booking.visitDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Render email template
    const htmlContent = await ejs.renderFile(
      path.join(templatesDir, 'ticket.ejs'),
      {
        booking,
        formattedDate,
        museumName: booking.museum.name,
        bookingReference: booking.bookingReference,
        tickets: booking.tickets,
        totalAmount: booking.totalAmount,
        userName: booking.user.name,
        museumAddress: booking.museum.location.address
      }
    );

    // Setup email data
    const mailOptions = {
      from: `"Indian Heritage Museums" <${config.get('emailService.auth.user')}>`,
      to: booking.user.email,
      subject: `Your Tickets - ${booking.bookingReference}`,
      html: htmlContent,
      attachments: [{
        filename: 'ticket-qr.png',
        content: booking.qrCode.split(';base64,').pop(),
        encoding: 'base64'
      }]
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Ticket email sent to ${booking.user.email}`);
  } catch (err) {
    console.error('Error sending ticket email:', err);
    throw err;
  }
};