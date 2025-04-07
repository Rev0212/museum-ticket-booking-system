import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { getEventRegistrationById, downloadEventTicket, sendEventTicketEmail, cancelEventRegistration } from '../utils/api';
import EmailIcon from '@mui/icons-material/Email';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CancelIcon from '@mui/icons-material/Cancel';

const EventRegistrationDetailPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        setLoading(true);
        const data = await getEventRegistrationById(id);
        setRegistration(data);
      } catch (err) {
        setError('Failed to load registration details. Please try again later.');
        console.error('Error fetching registration:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRegistration();
    }
  }, [id]);

  const handleSendEmail = async () => {
    try {
      setSendingEmail(true);
      await sendEventTicketEmail(id);
      setActionSuccess('Tickets sent to email successfully!');
    } catch (err) {
      setError('Failed to send tickets to email.');
      console.error('Error sending email:', err);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleDownloadTicket = async () => {
    try {
      setDownloading(true);
      await downloadEventTicket(id);
      setActionSuccess('Tickets downloaded successfully!');
    } catch (err) {
      setError('Failed to download tickets.');
      console.error('Error downloading tickets:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (window.confirm('Are you sure you want to cancel this registration? This action cannot be undone.')) {
      try {
        setCancelling(true);
        await cancelEventRegistration(id);
        setActionSuccess('Registration cancelled successfully!');
        // Refresh the registration data
        const data = await getEventRegistrationById(id);
        setRegistration(data);
      } catch (err) {
        setError('Failed to cancel registration.');
        console.error('Error cancelling registration:', err);
      } finally {
        setCancelling(false);
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !registration) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error || 'Registration not found'}</Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => history.push('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {actionSuccess && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setActionSuccess('')}>
          {actionSuccess}
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Event Registration
          </Typography>
          
          <Chip 
            label={registration.registrationStatus} 
            color={
              registration.registrationStatus === 'confirmed' ? 'success' :
              registration.registrationStatus === 'pending' ? 'warning' : 'error'
            }
            sx={{ mb: 2 }}
          />
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              {registration.event.title}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Date:</strong> {new Date(registration.event.startDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Time:</strong> {new Date(registration.event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
              {new Date(registration.event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
            
            {registration.event.location && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Location:</strong> {registration.event.location.address}, {registration.event.location.city}, {registration.event.location.state}
              </Typography>
            )}
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Attendees
            </Typography>
            
            <List>
              {registration.attendees.map((attendee, index) => (
                <ListItem key={index} divider={index < registration.attendees.length - 1}>
                  <ListItemText
                    primary={attendee.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          {attendee.email}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          {attendee.phone}
                        </Typography>
                        <br />
                        <Chip 
                          size="small" 
                          label={attendee.ticketType.charAt(0).toUpperCase() + attendee.ticketType.slice(1)} 
                          sx={{ mt: 1 }}
                        />
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Registration Details
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Registration Reference:</strong> {registration.registrationReference}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Registration Date:</strong> {new Date(registration.registrationDate).toLocaleDateString()}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Payment Method:</strong> {registration.paymentMethod.replace('_', ' ').toUpperCase()}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Total Amount:</strong> ₹{registration.totalAmount}
              </Typography>
              
              {registration.notes && (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Notes:</strong> {registration.notes}
                </Typography>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" align="center" gutterBottom>
                Ticket QR Code
              </Typography>
              
              {registration.qrCode ? (
                <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <img src={registration.qrCode} alt="QR Code" style={{ width: '100%', maxWidth: 200 }} />
                </Box>
              ) : (
                <QRCode value={registration.registrationReference} size={200} style={{ margin: '10px 0' }} />
              )}
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<EmailIcon />}
                onClick={handleSendEmail}
                disabled={sendingEmail || registration.registrationStatus === 'cancelled'}
                sx={{ mt: 2 }}
              >
                {sendingEmail ? <CircularProgress size={24} /> : 'Send to Email'}
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PictureAsPdfIcon />}
                onClick={handleDownloadTicket}
                disabled={downloading || registration.registrationStatus === 'cancelled'}
                sx={{ mt: 2 }}
              >
                {downloading ? <CircularProgress size={24} /> : 'Download Tickets'}
              </Button>
              
              {registration.registrationStatus !== 'cancelled' && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelRegistration}
                  disabled={cancelling}
                  sx={{ mt: 2 }}
                >
                  {cancelling ? <CircularProgress size={24} /> : 'Cancel Registration'}
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default EventRegistrationDetailPage;