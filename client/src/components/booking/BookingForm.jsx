import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getAllMuseums } from '../../utils/api';

const BookingForm = ({ bookingData, setBookingData, preselectedMuseum, loading: preselectedMuseumLoading, onNext }) => {
  const { user } = useContext(AuthContext);
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    museum: preselectedMuseum?._id || bookingData?.museum?._id || '',
    visitDate: bookingData?.visitDate || null,
    adultTickets: bookingData?.tickets?.adult || 0,
    childTickets: bookingData?.tickets?.child || 0,
    seniorTickets: bookingData?.tickets?.senior || 0,
    contactName: bookingData?.contactInfo?.name || user?.name || '',
    contactEmail: bookingData?.contactInfo?.email || user?.email || '',
    contactPhone: bookingData?.contactInfo?.phone || user?.phone || ''
  });

  // Fetch museums if not preselected
  useEffect(() => {
    const fetchMuseums = async () => {
      if (!preselectedMuseum) {
        try {
          setLoading(true);
          const data = await getAllMuseums();
          setMuseums(data);
        } catch (err) {
          console.error('Error fetching museums:', err);
          setError('Failed to load museums. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMuseums();
  }, [preselectedMuseum]);

  // Update form when preselectedMuseum changes
  useEffect(() => {
    if (preselectedMuseum) {
      setFormData({
        ...formData,
        museum: preselectedMuseum._id
      });
    }
  }, [preselectedMuseum]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, visitDate: date });
  };

  const calculateTotal = () => {
    const adultPrice = 50;
    const childPrice = 0;
    const seniorPrice = 20;

    return (
      (parseInt(formData.adultTickets || 0) * adultPrice) +
      (parseInt(formData.childTickets || 0) * childPrice) +
      (parseInt(formData.seniorTickets || 0) * seniorPrice)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.museum) {
      setError('Please select a museum');
      return;
    }
    
    if (!formData.visitDate) {
      setError('Please select a visit date');
      return;
    }
    
    const totalTickets = 
      parseInt(formData.adultTickets || 0) + 
      parseInt(formData.childTickets || 0) + 
      parseInt(formData.seniorTickets || 0);
    
    if (totalTickets === 0) {
      setError('Please select at least one ticket');
      return;
    }
    
    // Find the selected museum object
    const selectedMuseum = preselectedMuseum || museums.find(m => m._id === formData.museum);
    
    // Format data for next step
    const bookingFormData = {
      museum: selectedMuseum._id, // Make sure this is the MongoDB _id
      visitDate: formData.visitDate,
      tickets: [
        { type: 'adult', quantity: parseInt(formData.adultTickets || 0), price: 50 },
        { type: 'child', quantity: parseInt(formData.childTickets || 0), price: 0 },
        { type: 'senior', quantity: parseInt(formData.seniorTickets || 0), price: 20 }
      ].filter(ticket => ticket.quantity > 0),
      contactInfo: {
        name: formData.contactName,
        email: formData.contactEmail,
        phone: formData.contactPhone
      },
      totalAmount: calculateTotal()
    };
    
    // Update booking data context
    setBookingData(bookingFormData);
    
    // Move to next step
    onNext();
  };

  if (loading || preselectedMuseumLoading) {
    return <CircularProgress />;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Select Museum and Date
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="museum-select-label">Museum</InputLabel>
            <Select
              labelId="museum-select-label"
              id="museum-select"
              name="museum"
              value={formData.museum}
              onChange={handleChange}
              required
              disabled={!!preselectedMuseum}
            >
              {museums.map((museum) => (
                <MenuItem key={museum._id} value={museum._id}>
                  {museum.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Visit Date"
              value={formData.visitDate}
              onChange={handleDateChange}
              slotProps={{ textField: { fullWidth: true, required: true } }}
              disablePast
              minDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>
        
        <Grid item xs={12}>
          <Divider>
            <Chip label="Tickets" />
          </Divider>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Adult Tickets"
            name="adultTickets"
            type="number"
            value={formData.adultTickets}
            onChange={handleChange}
            InputProps={{ inputProps: { min: 0 } }}
            helperText="₹50 per ticket"
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Child Tickets"
            name="childTickets"
            type="number"
            value={formData.childTickets}
            onChange={handleChange}
            InputProps={{ inputProps: { min: 0 } }}
            helperText="Free for children"
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Senior Tickets"
            name="seniorTickets"
            type="number"
            value={formData.seniorTickets}
            onChange={handleChange}
            InputProps={{ inputProps: { min: 0 } }}
            helperText="₹20 per ticket"
          />
        </Grid>
        
        <Grid item xs={12}>
          <Divider>
            <Chip label="Contact Information" />
          </Divider>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Name"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            required
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Email"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
            required
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Phone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            required
          />
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
        >
          Continue to Payment
        </Button>
      </Box>
    </Box>
  );
};

export default BookingForm;