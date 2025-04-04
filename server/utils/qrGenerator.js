const QRCode = require('qrcode');

/**
 * Generate a QR code from the booking reference
 * @param {string} bookingReference - The booking reference to encode
 * @returns {Promise<string>} - A data URL containing the QR code image
 */
exports.generateQR = async (bookingReference) => {
  try {
    // Create QR code with booking reference
    const qrDataUrl = await QRCode.toDataURL(bookingReference, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
      color: {
        dark: '#9c5700', // Heritage amber color
        light: '#FFFFFF'
      }
    });
    
    return qrDataUrl;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw err;
  }
};

const generateQRCode = async (text) => {
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(text);
        return qrCodeDataUrl;
    } catch (error) {
        throw new Error('Error generating QR code: ' + error.message);
    }
};

module.exports = {
    generateQRCode,
};