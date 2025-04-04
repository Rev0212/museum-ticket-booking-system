const axios = require('axios');
const twilio = require('twilio');
const config = require('config');

// Create twilio client with error handling
let client = null;
try {
  if (config.has('whatsappService.accountSid') && config.has('whatsappService.authToken')) {
    client = twilio(
      config.get('whatsappService.accountSid'),
      config.get('whatsappService.authToken')
    );
  } else {
    console.warn('WhatsApp service configuration is missing');
  }
} catch (error) {
  console.warn('Failed to initialize Twilio client:', error.message);
}

/**
 * Send a WhatsApp message
 * @param {string} phoneNumber - Recipient's phone number
 * @param {string} message - Message content
 */
const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    // For development mode, just log the message
    console.log('WHATSAPP MESSAGE WOULD BE SENT TO:', phoneNumber);
    console.log('MESSAGE CONTENT:', message);
    
    // Only try to send via Twilio if client exists
    if (client) {
      await client.messages.create({
        body: message,
        from: `whatsapp:${config.get('whatsappService.fromNumber')}`,
        to: `whatsapp:${phoneNumber}`
      });
      console.log('WhatsApp message sent successfully');
    } else {
      console.log('Twilio client not initialized - message not sent');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send ticket information via WhatsApp
 * @param {Object} booking - The booking object
 * @param {string} phoneNumber - Recipient's phone number
 */
exports.sendTicket = async (booking, phoneNumber) => {
  try {
    // Format date
    const formattedDate = new Date(booking.visitDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Format ticket details
    const ticketsDetail = booking.tickets
      .map(ticket => `${ticket.quantity} x ${ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)} (₹${ticket.price} each)`)
      .join('\n');

    // Compose message
    const message = `
🎫 *YOUR MUSEUM TICKET* 🎫

Hello ${booking.contactInfo?.name || booking.user?.name || 'Visitor'}!

Your booking for *${booking.museum.name}* is confirmed.

*Booking Reference:* ${booking.bookingReference}
*Visit Date:* ${formattedDate}

*Ticket Details:*
${ticketsDetail}

*Total Amount:* ₹${booking.totalAmount}

Please show this message or your email confirmation at the entrance.

Thank you for booking with Indian Heritage Museums!
    `;

    // Send the message
    return await sendWhatsAppMessage(phoneNumber, message);
  } catch (err) {
    console.error('Error sending ticket via WhatsApp:', err);
    return { success: false, error: err.message };
  }
};

// Note: No additional exports at the end of the file

