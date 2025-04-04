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
  ListItemText
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
// No import needed for the placeholder
import { 
  getBookingById, 
  sendTicketEmailById, 
  sendTicketWhatsAppById,
  downloadTicketPDF 
} from '../../utils/api';

const TicketConfirmation = ({ bookingData, onPrevious, directData }) => {
  const { id } = useParams();
  const history = useHistory();
  const [booking, setBooking] = useState(directData ? bookingData : null);
  const [loading, setLoading] = useState(!directData);
  const [error, setError] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [whatsAppSuccess, setWhatsAppSuccess] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  
  useEffect(() => {
    // Only fetch if we're viewing by ID (not in booking flow)
    if (!directData && id) {
      const fetchBooking = async () => {
        try {
          const data = await getBookingById(id);
          setBooking(data);
        } catch (err) {
          setError('Failed to load booking details');
        } finally {
          setLoading(false);
        }
      };
      
      fetchBooking();
    }
  }, [id, directData]);
  
  const handleSendEmail = async () => {
    try {
      setSendingEmail(true);
      await sendTicketEmailById(id);
      setEmailSuccess(true);
    } catch (err) {
      setError('Failed to send ticket via email');
    } finally {
      setSendingEmail(false);
    }
  };
  
  const handleSendWhatsApp = async () => {
    try {
      setSendingWhatsApp(true);
      await sendTicketWhatsAppById(id);
      setWhatsAppSuccess(true);
    } catch (err) {
      setError('Failed to send ticket via WhatsApp');
    } finally {
      setSendingWhatsApp(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloadingPDF(true);
      await downloadTicketPDF(id);
      setPdfSuccess(true);
    } catch (err) {
      setError('Failed to download ticket PDF');
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleViewBookings = () => {
    history.push('/dashboard');
  };
  
  const handleDownloadTicket = () => {
    // In a real app, this would trigger a PDF download
    alert('Ticket download functionality will be implemented in the next phase.');
  };
  
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
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
  
  const visitDate = new Date(booking.visitDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Generate a random booking reference for demo purposes
  const bookingReference = `MUSEUM-${Math.floor(100000 + Math.random() * 900000)}`;
  
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
            <Chip 
              label={`Booking ID: ${booking.bookingReference}`}
              color="primary"
              sx={{ mt: 2 }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Museum Details
            </Typography>
            
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              {booking.museum?.name || 'Museum'}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                {visitDate}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
              <LocationOnIcon sx={{ mr: 1, mt: 0.5, color: 'primary.main' }} />
              <Typography variant="body1">
                {booking.museum?.location.address || 'Address not available'}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                {booking.contactInfo?.name || booking.user?.name || 'Name not available'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                {booking.contactInfo?.email || booking.user?.email || 'Email not available'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                {booking.contactInfo?.phone || booking.user?.phone || 'Phone not available'}
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
                  onClick={handleSendEmail}
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
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5" component="h2" sx={{ color: 'success.main', mb: 2 }}>
          Booking Confirmed!
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4 }}>
          Your booking reference is: <strong>{bookingReference}</strong>
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mb: 4, maxWidth: 500, mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box 
              sx={{ 
                width: 150, 
                height: 150, 
                border: '1px solid #ccc', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: '#f5f5f5'
              }}
            >
              <Typography variant="body2" color="text.secondary" align="center">
                QR Code<br />
                {bookingReference}
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <List>
            <ListItem>
              <ListItemText 
                primary="Museum" 
                secondary={booking.museum?.name} 
              />
            </ListItem>
            
            <ListItem>
              <ListItemText 
                primary="Visit Date" 
                secondary={visitDate} 
              />
            </ListItem>
            
            <ListItem>
              <ListItemText 
                primary="Tickets" 
                secondary={
                  <span>
                    {booking.tickets?.map((ticket, index) => (
                      <div key={index}>
                        {ticket.quantity} x {ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}
                      </div>
                    ))}
                  </span>
                } 
              />
            </ListItem>
            
            <ListItem>
              <ListItemText 
                primary="Total Amount" 
                secondary={`₹${booking.totalAmount}`} 
              />
            </ListItem>
          </List>
        </Paper>
        
        <Typography variant="body2" sx={{ mb: 3 }}>
          A copy of this ticket has been sent to your email: {booking.contactInfo?.email}
        </Typography>
        
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleDownloadTicket}
            >
              Download Ticket
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="outlined"
              onClick={handleViewBookings}
            >
              View My Bookings
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TicketConfirmation;