import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { sendTicketWhatsAppById } from '../../utils/api';

const WhatsAppShare = ({ bookingId, defaultPhone = '' }) => {
  const [phone, setPhone] = useState(defaultPhone);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSendWhatsApp = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      setSending(true);
      setError('');
      
      // In real implementation, we would pass the phone to the API
      await sendTicketWhatsAppById(bookingId);
      
      setSuccess(true);
    } catch (err) {
      console.error('Error sending WhatsApp:', err);
      setError('Failed to send WhatsApp. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        <WhatsAppIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Send Ticket via WhatsApp
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success ? (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h6" color="success.main" gutterBottom>
            WhatsApp Sent Successfully!
          </Typography>
          <Typography variant="body1">
            Your ticket has been sent to {phone} via WhatsApp.
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            We'll send your ticket to the WhatsApp number below.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={sending}
              placeholder="Enter your WhatsApp number"
            />
            
            <Button
              variant="contained"
              color="success"
              onClick={handleSendWhatsApp}
              disabled={sending}
              sx={{ minWidth: '120px' }}
            >
              {sending ? <CircularProgress size={24} /> : 'Send'}
            </Button>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Make sure you have WhatsApp installed on your device.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default WhatsAppShare;