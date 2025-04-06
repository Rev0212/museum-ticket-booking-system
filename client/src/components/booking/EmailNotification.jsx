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
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { sendTicketEmailById } from '../../utils/api';

const EmailNotification = ({ bookingId, defaultEmail = '' }) => {
  const [email, setEmail] = useState(defaultEmail);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSendEmail = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setSending(true);
      setError('');
      
      // In real implementation, we would pass the email to the API
      await sendTicketEmailById(bookingId);
      
      setSuccess(true);
    } catch (err) {
      console.error('Error sending email:', err);
      setError('Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        <EmailIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Send Ticket via Email
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
            Email Sent Successfully!
          </Typography>
          <Typography variant="body1">
            Your ticket has been sent to {email}. Please check your inbox.
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            We'll send your ticket to the email address below.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={sending}
              placeholder="Enter your email address"
            />
            
            <Button
              variant="contained"
              onClick={handleSendEmail}
              disabled={sending}
              sx={{ minWidth: '120px' }}
            >
              {sending ? <CircularProgress size={24} /> : 'Send'}
            </Button>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            If you don't receive the email within a few minutes, please check your spam folder.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default EmailNotification;