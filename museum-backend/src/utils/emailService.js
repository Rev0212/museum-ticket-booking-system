const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send ticket via email
 * @param {Object} booking - The booking object
 * @param {Buffer} pdfBuffer - PDF ticket as buffer
 * @returns {Promise} - Promise that resolves when email is sent
 */
async function sendTicketEmail(booking, pdfBuffer) {
  try {
    const emailTo = booking.contactInfo?.email || booking.user?.email;
    
    if (!emailTo) {
      throw new Error('No email address provided');
    }
    
    const visitDate = new Date(booking.visitDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Setup email data
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailTo,
      subject: `Your Museum Tickets - ${booking.bookingReference}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Museum Tickets</h2>
          <p>Thank you for booking with us!</p>
          
          <div style="border: 1px solid #ddd; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
            <p><strong>Museum:</strong> ${booking.museumName}</p>
            <p><strong>Visit Date:</strong> ${visitDate}</p>
            <p><strong>Tickets:</strong></p>
            <ul>
              ${booking.tickets.map(ticket => 
                `<li>${ticket.quantity} x ${ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}: ₹${ticket.price * ticket.quantity}</li>`
              ).join('')}
            </ul>
            <p><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
          </div>
          
          <p>Please find your ticket attached to this email. Present it at the museum entrance.</p>
          <p>We hope you enjoy your visit!</p>
        </div>
      `,
      attachments: [
        {
          filename: `museum-ticket-${booking.bookingReference}.pdf`,
          content: pdfBuffer
        }
      ]
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
    
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

/**
 * Send event ticket via email
 * @param {Object} registration - The event registration object
 * @param {Buffer} pdfBuffer - PDF ticket as buffer
 * @returns {Promise} - Promise that resolves when email is sent
 */
async function sendEventTicketEmail(registration, pdfBuffer) {
  try {
    // Get all attendee emails
    const attendeeEmails = registration.attendees.map(attendee => attendee.email);
    
    if (attendeeEmails.length === 0) {
      throw new Error('No email addresses provided');
    }
    
    const startDate = new Date(registration.event.startDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const startTime = new Date(registration.event.startDate).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const endTime = new Date(registration.event.endDate).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Setup email data
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: attendeeEmails.join(', '),
      subject: `Your Tickets for ${registration.event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Event Tickets</h2>
          <p>Thank you for registering for our event!</p>
          
          <div style="border: 1px solid #ddd; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p><strong>Event:</strong> ${registration.event.title}</p>
            <p><strong>Date:</strong> ${startDate}</p>
            <p><strong>Time:</strong> ${startTime} to ${endTime}</p>
            <p><strong>Location:</strong> ${registration.event.location ? 
              `${registration.event.location.address}, ${registration.event.location.city}, ${registration.event.location.state}` : 
              'Location details not available'}</p>
            <p><strong>Registration Reference:</strong> ${registration.registrationReference}</p>
            <p><strong>Attendees:</strong></p>
            <ul>
              ${registration.attendees.map(attendee => 
                `<li>${attendee.name} (${attendee.ticketType.charAt(0).toUpperCase() + attendee.ticketType.slice(1)})</li>`
              ).join('')}
            </ul>
            <p><strong>Total Amount:</strong> ₹${registration.totalAmount}</p>
          </div>
          
          <p>Please find your ticket attached to this email. Present it at the event entrance.</p>
          <p>We look forward to seeing you!</p>
        </div>
      `,
      attachments: [
        {
          filename: `event-ticket-${registration.registrationReference}.pdf`,
          content: pdfBuffer
        }
      ]
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
    
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

module.exports = { 
  sendTicketEmail, // Keep existing function
  sendEventTicketEmail 
};