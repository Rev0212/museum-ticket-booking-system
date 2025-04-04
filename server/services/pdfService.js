const PDFDocument = require('pdfkit');
const fs = require('fs-extra');
const path = require('path');
const config = require('config');

/**
 * Generate a PDF ticket for a booking
 * @param {Object} booking - The booking object with all details
 * @returns {Promise<string>} - Path to the generated PDF
 */
exports.generateTicketPDF = async (booking) => {
  try {
    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, '../temp');
    await fs.ensureDir(tempDir);
    
    // PDF filename with booking reference
    const fileName = `ticket-${booking.bookingReference}.pdf`;
    const filePath = path.join(tempDir, fileName);
    
    // Format date
    const formattedDate = new Date(booking.visitDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `Museum Ticket - ${booking.bookingReference}`,
        Author: 'Indian Heritage Museums',
      }
    });
    
    // Pipe PDF to file
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    
    // Add header with logo
    doc.fontSize(24)
      .fillColor('#9c5700')
      .font('Helvetica-Bold')
      .text('INDIAN HERITAGE MUSEUMS', { align: 'center' });
    
    doc.moveDown(0.5);
    
    // Add ticket title
    doc.fontSize(18)
      .fillColor('#333')
      .text('ENTRY TICKET', { align: 'center' });
    
    doc.moveDown(0.5);
    
    // Add divider
    doc.strokeColor('#9c5700')
      .lineWidth(2)
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke();
    
    doc.moveDown(1);
    
    // Add booking reference
    doc.fontSize(12)
      .fillColor('#555')
      .text('Booking Reference:', { continued: true })
      .fillColor('#000')
      .font('Helvetica-Bold')
      .text(` ${booking.bookingReference}`, { align: 'left' });
    
    doc.moveDown(0.5);
    
    // Add visitor name
    doc.fontSize(12)
      .fillColor('#555')
      .font('Helvetica')
      .text('Visitor:', { continued: true })
      .fillColor('#000')
      .font('Helvetica-Bold')
      .text(` ${booking.contactInfo?.name || booking.user?.name}`, { align: 'left' });
    
    doc.moveDown(0.5);
    
    // Add museum name
    doc.fontSize(12)
      .fillColor('#555')
      .font('Helvetica')
      .text('Museum:', { continued: true })
      .fillColor('#000')
      .font('Helvetica-Bold')
      .text(` ${booking.museum.name}`, { align: 'left' });
    
    doc.moveDown(0.5);
    
    // Add address
    doc.fontSize(12)
      .fillColor('#555')
      .font('Helvetica')
      .text('Address:', { continued: true })
      .fillColor('#000')
      .font('Helvetica')
      .text(` ${booking.museum.location.address}`, { align: 'left' });
    
    doc.moveDown(0.5);
    
    // Add visit date
    doc.fontSize(12)
      .fillColor('#555')
      .font('Helvetica')
      .text('Visit Date:', { continued: true })
      .fillColor('#000')
      .font('Helvetica-Bold')
      .text(` ${formattedDate}`, { align: 'left' });
    
    doc.moveDown(1);
    
    // Add tickets section title
    doc.fontSize(14)
      .fillColor('#9c5700')
      .font('Helvetica-Bold')
      .text('TICKET DETAILS', { align: 'left' });
    
    doc.moveDown(0.5);
    
    // Add tickets
    booking.tickets.forEach((ticket, index) => {
      const amount = ticket.quantity * ticket.price;
      
      doc.fontSize(11)
        .fillColor('#333')
        .text(`${ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}`, { continued: true })
        .text(`: ${ticket.quantity} x ₹${ticket.price} = ₹${amount}`, { align: 'left' });
      
      doc.moveDown(0.3);
    });
    
    doc.moveDown(0.5);
    
    // Add total amount
    doc.fontSize(12)
      .fillColor('#333')
      .font('Helvetica-Bold')
      .text('Total Amount:', { continued: true })
      .fillColor('#9c5700')
      .text(` ₹${booking.totalAmount}`, { align: 'right' });
    
    doc.moveDown(1.5);
    
    // Add QR code
    if (booking.qrCode) {
      // Extract QR image data from base64
      const qrData = booking.qrCode.split(';base64,').pop();
      const qrImage = Buffer.from(qrData, 'base64');
      
      // Center the QR code
      const qrSize = 150;
      const xPos = (doc.page.width - qrSize) / 2;
      
      doc.image(qrImage, xPos, doc.y, { width: qrSize });
      
      doc.moveDown(7);
      
      // Add QR code description
      doc.fontSize(11)
        .fillColor('#555')
        .font('Helvetica')
        .text('Please scan this QR code at the entrance for entry.', { align: 'center' });
    }
    
    doc.moveDown(1);
    
    // Add footer with terms
    doc.fontSize(9)
      .fillColor('#555')
      .text('This ticket is only valid for the date mentioned above. Please carry a valid ID proof along with this ticket.', { align: 'center' });
    
    // Finalize the PDF
    doc.end();
    
    // Return a promise that resolves when the PDF is written
    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    });
  } catch (err) {
    console.error('Error generating ticket PDF:', err);
    throw err;
  }
};

/**
 * Clean up temporary PDF files
 * @param {string} filePath - Path to the PDF file to remove
 */
exports.cleanupPDF = async (filePath) => {
  try {
    await fs.remove(filePath);
  } catch (err) {
    console.error('Error cleaning up PDF file:', err);
  }
};