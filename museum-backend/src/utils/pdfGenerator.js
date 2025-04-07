const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate PDF ticket for a booking
 * @param {Object} booking - The booking object
 * @param {String} qrCodeDataUrl - QR code data URL
 * @returns {Promise<Buffer>} - PDF as buffer
 */
async function generateTicketPDF(booking, qrCodeDataUrl) {
  return new Promise((resolve, reject) => {
    try {
      // Create a document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });
      
      // Create a buffer to store PDF
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      
      // Add content to PDF
      // Header
      doc.fontSize(25)
         .text('Museum Ticket', { align: 'center' });
      
      doc.moveDown();
      doc.fontSize(15)
         .text(`Booking Reference: ${booking.bookingReference}`, { align: 'center' });
      
      doc.moveDown();
      
      // Museum and Visit Info
      doc.fontSize(12)
         .text(`Museum: ${booking.museumName}`, { align: 'left' });
      
      doc.moveDown(0.5);
      const visitDate = new Date(booking.visitDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.text(`Visit Date: ${visitDate}`, { align: 'left' });
      
      doc.moveDown();
      
      // Tickets
      doc.text('Tickets:', { align: 'left' });
      booking.tickets.forEach(ticket => {
        doc.moveDown(0.5);
        doc.text(`${ticket.quantity} x ${ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}: ₹${ticket.price * ticket.quantity}`);
      });
      
      doc.moveDown();
      // Total
      doc.fontSize(14)
         .text(`Total Amount: ₹${booking.totalAmount}`, { align: 'left' });
      
      doc.moveDown();
      
      // QR Code
      if (qrCodeDataUrl) {
        doc.image(qrCodeDataUrl, {
          fit: [150, 150],
          align: 'center'
        });
      }
      
      // Footer
      doc.moveDown();
      doc.fontSize(10)
         .text('Please present this ticket at the museum entrance.', { align: 'center' });
      
      // Finalize PDF
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate PDF ticket for an event registration
 * @param {Object} registration - The event registration object
 * @param {String} qrCodeDataUrl - QR code data URL
 * @returns {Promise<Buffer>} - PDF as buffer
 */
async function generateEventTicketPDF(registration, qrCodeDataUrl) {
  return new Promise((resolve, reject) => {
    try {
      // Create a document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });
      
      // Create a buffer to store PDF
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      
      // Add content to PDF
      // Header
      doc.fontSize(25)
         .text('Event Ticket', { align: 'center' });
      
      doc.moveDown();
      doc.fontSize(15)
         .text(`Registration Reference: ${registration.registrationReference}`, { align: 'center' });
      
      doc.moveDown();
      
      // Event Info
      doc.fontSize(16)
         .text(`Event: ${registration.event.title}`, { align: 'left' });
      
      doc.moveDown(0.5);
      
      // Format dates
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
      
      doc.fontSize(12)
         .text(`Date: ${startDate}`, { align: 'left' });
      
      doc.moveDown(0.5);
      doc.text(`Time: ${startTime} to ${endTime}`, { align: 'left' });
      
      doc.moveDown(0.5);
      if (registration.event.location) {
        const location = registration.event.location;
        const locationText = location.address ? 
          `${location.address}, ${location.city}, ${location.state}` : 
          'Location details not available';
        
        doc.text(`Location: ${locationText}`, { align: 'left' });
      }
      
      doc.moveDown();
      
      // Attendees
      doc.fontSize(14)
         .text('Attendees:', { align: 'left' });
      
      registration.attendees.forEach((attendee, index) => {
        doc.moveDown(0.5);
        doc.text(`${index + 1}. ${attendee.name} (${attendee.ticketType.charAt(0).toUpperCase() + attendee.ticketType.slice(1)})`, { align: 'left' });
      });
      
      doc.moveDown();
      // Total
      doc.fontSize(14)
         .text(`Total Amount: ₹${registration.totalAmount}`, { align: 'left' });
      
      doc.moveDown();
      
      // QR Code
      if (qrCodeDataUrl) {
        doc.image(qrCodeDataUrl, {
          fit: [150, 150],
          align: 'center'
        });
      }
      
      // Footer
      doc.moveDown();
      doc.fontSize(10)
         .text('Please present this ticket at the event entrance.', { align: 'center' });
      
      // Event Category Badge
      doc.moveDown();
      const categoryColor = 
        registration.event.category === 'Exhibition' ? '#1976d2' : 
        registration.event.category === 'Workshop' ? '#9c27b0' : 
        registration.event.category === 'Lecture' ? '#0288d1' : 
        '#f57c00'; // Performance
      
      doc.fillColor(categoryColor)
         .fontSize(12)
         .text(registration.event.category, {
           align: 'center',
           width: 100,
           height: 25,
           link: null,
           underline: false,
           strike: false,
           oblique: false,
         });
      
      // Finalize PDF
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { 
  generateTicketPDF: generateTicketPDF, // Keep existing function
  generateEventTicketPDF 
};