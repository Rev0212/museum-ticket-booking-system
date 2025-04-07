const QRCode = require('qrcode');

/**
 * Generate QR code for a booking
 * @param {String} bookingId - The booking ID
 * @param {String} bookingReference - Booking reference number
 * @returns {Promise<String>} - Data URL of QR code
 */
async function generateQRCode(bookingId, bookingReference) {
  try {
    // Create data for QR code
    const data = JSON.stringify({
      id: bookingId,
      ref: bookingReference,
      timestamp: new Date().toISOString()
    });
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(data);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

module.exports = { generateQRCode };