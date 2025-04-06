import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  IconButton,
  CircularProgress,
  Alert,
  Divider 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getEventById, registerForEvent } from '../../utils/api';
import { useParams, useHistory } from 'react-router-dom';

const EventRegistration = () => {
  const { eventId } = useParams();
  const history = useHistory();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [attendees, setAttendees] = useState([
    { name: '', email: '', phone: '', ticketType: 'standard' }
  ]);
  
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventById(eventId);
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);
  
  const handleAttendeeChange = (index, field, value) => {
    const newAttendees = [...attendees];
    newAttendees[index][field] = value;
    setAttendees(newAttendees);
  };
  
  const addAttendee = () => {
    setAttendees([
      ...attendees,
      { name: '', email: '', phone: '', ticketType: 'standard' }
    ]);
  };
  
  const removeAttendee = (index) => {
    if (attendees.length > 1) {
      const newAttendees = [...attendees];
      newAttendees.splice(index, 1);
      setAttendees(newAttendees);
    }
  };
  
  const calculateTotal = () => {
    if (!event) return 0;
    
    const basePrice = event.ticketPrice || 0;
    let total = 0;
    
    attendees.forEach(attendee => {
      let multiplier = 1;
      
      switch (attendee.ticketType) {
        case 'vip':
          multiplier = 2;
          break;
        case 'student':
          multiplier = 0.7;
          break;
        case 'senior':
          multiplier = 0.8;
          break;
        default:
          multiplier = 1;
      }
      
      total += basePrice * multiplier;
    });
    
    return total;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    // Validate form
    const isValid = attendees.every(a => a.name && a.email);
    if (!isValid) {
      setError('Please fill in name and email for all attendees');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Create registration data
      const registrationData = {
        eventId,
        attendees,
        totalAmount: calculateTotal(),
        paymentMethod,
        notes
      };
      
      // Register for event
      const result = await registerForEvent(registrationData);
      
      setSuccess(true);
      setTimeout(() => {
        history.push(`/event-registrations/${result._id}`);
      }, 3000);
      
    } catch (err) {
      setError(err.msg || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error && !event) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => history.push('/events')}
        >
          Back to Events
        </Button>
      </Box>
    );
  }
  
  if (!event) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">Event not found</Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => history.push('/events')}
        >
          Back to Events
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Register for Event
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" color="primary">
            {event.title}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {new Date(event.startDate).toLocaleDateString()} at {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {event.location?.address}, {event.location?.city}, {event.location?.state}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Base Ticket Price: ₹{event.ticketPrice || 0}
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Registration successful! Redirecting to confirmation page...
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Attendee Information
          </Typography>
          
          {attendees.map((attendee, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={11}>
                  <Typography variant="subtitle1">
                    Attendee {index + 1}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <IconButton 
                    color="error" 
                    onClick={() => removeAttendee(index)}
                    disabled={attendees.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={attendee.name}
                    onChange={(e) => handleAttendeeChange(index, 'name', e.target.value)}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={attendee.email}
                    onChange={(e) => handleAttendeeChange(index, 'email', e.target.value)}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone (optional)"
                    value={attendee.phone}
                    onChange={(e) => handleAttendeeChange(index, 'phone', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Ticket Type</InputLabel>
                    <Select
                      value={attendee.ticketType}
                      onChange={(e) => handleAttendeeChange(index, 'ticketType', e.target.value)}
                      label="Ticket Type"
                    >
                      <MenuItem value="standard">Standard (₹{event.ticketPrice})</MenuItem>
                      <MenuItem value="vip">VIP (₹{event.ticketPrice * 2})</MenuItem>
                      <MenuItem value="student">Student (₹{event.ticketPrice * 0.7})</MenuItem>
                      <MenuItem value="senior">Senior (₹{event.ticketPrice * 0.8})</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          ))}
          
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addAttendee}
            sx={{ mb: 3 }}
          >
            Add Another Attendee
          </Button>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Payment Information
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Payment Method"
                >
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="debit_card">Debit Card</MenuItem>
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="net_banking">Net Banking</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Typography>
              {attendees.length} {attendees.length === 1 ? 'Ticket' : 'Tickets'}
            </Typography>
            <Typography variant="h5" sx={{ mt: 1 }}>
              Total: ₹{calculateTotal()}
            </Typography>
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ mt: 3 }}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : 'Complete Registration'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default EventRegistration;