import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useHistory } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Divider, 
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  IconButton,
  TextField,
  Tooltip
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CancelIcon from '@mui/icons-material/Cancel';
import { QRCodeSVG } from 'qrcode.react';
import { 
  getBookingById, 
  sendTicketEmailById, 
  sendTicketWhatsAppById,
  downloadTicketPDF,
  cancelBooking
} from '../../utils/api';

// Add this helper function
const formatVisitDate = (dateString) => {
  try {
    if (!dateString) return 'Date not available';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (err) {
    console.error('Error formatting visit date:', err);
    return 'Date format error';
  }
};

const TicketConfirmation = ({ bookingData, onPrevious, directData }) => {
  const { id } = useParams();
  const history = useHistory();
  const [booking, setBooking] = useState(directData ? bookingData : null);
  const [loading, setLoading] = useState(!directData);
  const [error, setError] = useState('');
  
  // Action states
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  
  // Success states
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [whatsAppSuccess, setWhatsAppSuccess] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  
  // Dialog states
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Custom email
  const [customEmail, setCustomEmail] = useState('');
  const [customEmailError, setCustomEmailError] = useState('');

  // Generated booking reference
  const [bookingReference, setBookingReference] = useState('');
  
  useEffect(() => {
    // Only fetch if we're viewing by ID (not in booking flow)
    if (!directData && id) {
      const fetchBooking = async () => {
        try {
          setLoading(true);
          setError('');
          const data = await getBookingById(id);
          
          if (!data) {
            setError('Booking not found');
            return;
          }
          
          setBooking(data);
          
          // Generate booking reference if not provided
          if (!data.bookingReference) {
            generateBookingReference(data);
          }
        } catch (err) {
          console.error('Error fetching booking:', err);
          setError('Failed to load booking details');
        } finally {
          setLoading(false);
        }
      };
      
      fetchBooking();
    } else if (directData && bookingData) {
      // Generate booking reference for direct data
      generateBookingReference(bookingData);
    }
  }, [id, directData, bookingData]);
  
  const generateBookingReference = (bookingData) => {
    // Extract museum code (first 3 letters)
    const museumCode = bookingData.museum?.name?.slice(0, 3).toUpperCase() || 'MUS';
    
    // Extract date code (DDMM)
    const visitDate = bookingData.visitDate ? new Date(bookingData.visitDate) : new Date();
    const dateCode = `${visitDate.getDate().toString().padStart(2, '0')}${(visitDate.getMonth() + 1).toString().padStart(2, '0')}`;
    
    // Generate random number (4 digits)
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    
    // Combine to create reference
    const reference = `${museumCode}-${dateCode}-${randomCode}`;
    setBookingReference(reference);
  };
  
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  const handleSendEmail = async (email = null) => {
    try {
      setSendingEmail(true);
      setError('');
      
      const targetEmail = email || booking?.contactInfo?.email;
      
      if (!targetEmail) {
        throw new Error('No email address provided');
      }
      
      if (directData) {
        // Mock email sending for demo
        await new Promise(resolve => setTimeout(resolve, 1500));
        showSnackbar(`Ticket sent to ${targetEmail}`);
      } else {
        await sendTicketEmailById(booking._id, targetEmail);
        showSnackbar(`Ticket sent to ${targetEmail}`);
      }
      
      setEmailSuccess(true);
      setShareDialogOpen(false);
    } catch (err) {
      setError('Failed to send ticket via email: ' + (err.message || 'Unknown error'));
      showSnackbar('Failed to send email', 'error');
      console.error('Error sending ticket via email:', err);
    } finally {
      setSendingEmail(false);
    }
  };
  
  const validateCustomEmail = () => {
    if (!customEmail) {
      setCustomEmailError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customEmail)) {
      setCustomEmailError('Invalid email format');
      return false;
    }
    
    setCustomEmailError('');
    return true;
  };
  
  const handleSendCustomEmail = () => {
    if (validateCustomEmail()) {
      handleSendEmail(customEmail);
    }
  };
  
  const handleSendWhatsApp = async () => {
    try {
      setSendingWhatsApp(true);
      setError('');
      
      const phoneNumber = booking?.contactInfo?.phone;
      
      if (!phoneNumber) {
        throw new Error('No phone number provided');
      }
      
      if (directData) {
        // Mock WhatsApp sending for demo
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Create WhatsApp share link
        const text = `Your museum ticket confirmation: ${bookingReference}\n` +
                    `Museum: ${booking.museum.name}\n` +
                    `Date: ${new Date(booking.visitDate).toLocaleDateString()}\n` +
                    `Tickets: ${booking.tickets.reduce((acc, ticket) => acc + ticket.quantity, 0)}`;
        
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
      } else {
        await sendTicketWhatsAppById(booking._id);
      }
      
      setWhatsAppSuccess(true);
      showSnackbar('Ticket shared via WhatsApp');
    } catch (err) {
      setError('Failed to send ticket via WhatsApp: ' + (err.message || 'Unknown error'));
      showSnackbar('Failed to share via WhatsApp', 'error');
      console.error('Error sending ticket via WhatsApp:', err);
    } finally {
      setSendingWhatsApp(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloadingPDF(true);
      setError('');
      
      if (directData) {
        // Mock PDF download for demo
        await new Promise(resolve => setTimeout(resolve, 2000));
        showSnackbar('Ticket PDF downloaded successfully');
      } else {
        await downloadTicketPDF(booking._id);
        showSnackbar('Ticket PDF downloaded successfully');
      }
      
      setPdfSuccess(true);
    } catch (err) {
      setError('Failed to download ticket PDF: ' + (err.message || 'Unknown error'));
      showSnackbar('Failed to download PDF', 'error');
      console.error('Error downloading ticket PDF:', err);
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      setCancelling(true);
      setError('');
      
      if (directData) {
        // Mock cancellation for demo
        await new Promise(resolve => setTimeout(resolve, 1500));
        showSnackbar('Booking cancelled successfully');
        history.push('/dashboard');
      } else {
        await cancelBooking(booking._id);
        showSnackbar('Booking cancelled successfully');
        history.push('/dashboard');
      }
    } catch (err) {
      setError('Failed to cancel booking: ' + (err.message || 'Unknown error'));
      showSnackbar('Failed to cancel booking', 'error');
      console.error('Error cancelling booking:', err);
    } finally {
      setCancelling(false);
      setCancelDialogOpen(false);
    }
  };

  const handleViewBookings = () => {
    history.push('/dashboard');
  };
  
  const handleCopyReference = () => {
    navigator.clipboard.writeText(bookingReference);
    showSnackbar('Booking reference copied to clipboard');
  };
  
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading ticket details...</Typography>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        <Button 
          component={RouterLink}
          to="/dashboard"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Go to Dashboard
        </Button>
      </Box>
    );
  }
  
  if (!booking) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="warning">Booking not found</Alert>
        <Button 
          component={RouterLink}
          to="/dashboard"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Go to Dashboard
        </Button>
      </Box>
    );
  }

  if (!booking || !booking.tickets) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="warning">Booking information is incomplete or still loading</Alert>
        <Button 
          component={RouterLink}
          to="/dashboard"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Go to Dashboard
        </Button>
      </Box>
    );
  }
  
  const visitDate = booking?.visitDate ? new Date(booking.visitDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';
  
  return (
    <Box sx={{ py: 4 }}>
      <Paper 
        elevation={3}
        sx={{ 
          p: 4,
          maxWidth: 800,
          mx: 'auto',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'primary.main',
            color: 'white',
            py: 1,
            px: 3,
            transform: 'rotate(45deg) translateX(30%) translateY(-100%)',
            transformOrigin: 'top right',
            zIndex: 1,
            boxShadow: '0 0 10px rgba(0,0,0,0.3)'
          }}
        >
          <Typography variant="body2" fontWeight="bold">Confirmed</Typography>
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} textAlign="center">
            <ConfirmationNumberIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Booking Confirmed!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Your tickets have been booked successfully
            </Typography>
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid item>
                <Chip 
                  label={`Booking Reference: ${bookingReference}`}
                  color="primary"
                  onDelete={handleCopyReference}
                  deleteIcon={
                    <Tooltip title="Copy reference">
                      <ContentCopyIcon />
                    </Tooltip>
                  }
                  sx={{ px: 1 }}
                />
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12}>
            <Divider />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Museum Details
            </Typography>
            
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              {booking?.museum?.name || 'Museum'}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                {booking?.museum?.location?.address}, 
                {booking?.museum?.location?.city}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                {formatVisitDate(booking?.visitDate)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                {booking?.contactInfo?.name || 'Name not available'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                {booking?.contactInfo?.email || 'Email not available'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                {booking.contactInfo?.phone || 'Phone not available'}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Box 
              sx={{ 
                p: 2, 
                border: '1px dashed', 
                borderColor: 'divider',
                borderRadius: 2,
                textAlign: 'center'
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                E-Ticket QR Code
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <QRCodeSVG 
                  value={`BOOKING:${bookingReference}`}
                  size={150}
                  level="H"
                  includeMargin={true}
                />
              </Box>
              
              <Typography variant="caption" color="text.secondary">
                Scan this QR code at the museum entrance
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Divider />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Ticket Details
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {booking.tickets.map((ticket, index) => (
                <Grid item xs={12} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ textTransform: 'capitalize' }}
                          >
                            {ticket.type} Ticket
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body2" color="text.secondary">
                            {ticket.quantity} × ₹{ticket.price}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="subtitle1" fontWeight="bold">
                            ₹{ticket.quantity * ticket.price}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 3,
                p: 2,
                bgcolor: 'primary.light',
                color: 'white',
                borderRadius: 1
              }}
            >
              <Typography variant="h6">Total Amount</Typography>
              <Typography variant="h6" fontWeight="bold">
                ₹{booking.totalAmount}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Divider />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Share Your Ticket
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<EmailIcon />}
                  onClick={() => setShareDialogOpen(true)}
                  disabled={sendingEmail || emailSuccess}
                >
                  {sendingEmail ? <CircularProgress size={24} /> : 
                   emailSuccess ? "Email Sent" : "Send to Email"}
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Button
                  variant="outlined"
                  color="success"
                  fullWidth
                  startIcon={<WhatsAppIcon />}
                  onClick={handleSendWhatsApp}
                  disabled={sendingWhatsApp || whatsAppSuccess}
                >
                  {sendingWhatsApp ? <CircularProgress size={24} /> : 
                   whatsAppSuccess ? "WhatsApp Sent" : "Send to WhatsApp"}
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  startIcon={<PictureAsPdfIcon />}
                  onClick={handleDownloadPDF}
                  disabled={downloadingPDF}
                >
                  {downloadingPDF ? <CircularProgress size={24} /> : "Download PDF"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} textAlign="center" sx={{ mt: 2 }}>
            <Button
              component={RouterLink}
              to="/dashboard"
              variant="contained"
              color="primary"
              size="large"
            >
              Go to Dashboard
            </Button>
            
            <Button
              variant="outlined"
              color="error"
              size="large"
              startIcon={<CancelIcon />}
              onClick={() => setCancelDialogOpen(true)}
              sx={{ ml: 2 }}
              disabled={cancelling}
            >
              {cancelling ? <CircularProgress size={24} /> : "Cancel Booking"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
        <DialogTitle>Share Ticket</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Send your ticket to any email address:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={customEmail}
            onChange={(e) => {
              setCustomEmail(e.target.value);
              setCustomEmailError('');
            }}
            error={!!customEmailError}
            helperText={customEmailError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSendCustomEmail}
            variant="contained"
            disabled={sendingEmail}
          >
            {sendingEmail ? <CircularProgress size={24} /> : "Send"}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Cancellation Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setCancelDialogOpen(false)}
            autoFocus
          >
            No, Keep My Booking
          </Button>
          <Button 
            onClick={handleCancelBooking}
            variant="contained"
            color="error"
            disabled={cancelling}
          >
            {cancelling ? <CircularProgress size={24} /> : "Yes, Cancel Booking"}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TicketConfirmation;