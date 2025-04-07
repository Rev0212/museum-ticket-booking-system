import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Paper,
  Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays } from 'date-fns';
import axios from 'axios';

const BookingForm = ({ onSubmit, onProceedToPayment }) => {
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    museumId: '',
    date: addDays(new Date(), 1),
    adultTickets: 0,
    childTickets: 0,
    seniorTickets: 0,
    totalAmount: 0
  });
  const [selectedMuseum, setSelectedMuseum] = useState(null);
  
  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const response = await axios.get('/api/museums');
        setMuseums(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching museums:', error);
        setLoading(false);
      }
    };
    
    fetchMuseums();
  }, []);
  
  useEffect(() => {
    if (formData.museumId && museums.length > 0) {
      const museum = museums.find(m => m._id === formData.museumId);
      setSelectedMuseum(museum);
      calculateTotal(museum);
    }
  }, [formData.museumId, formData.adultTickets, formData.childTickets, formData.seniorTickets, museums]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date
    });
  };
  
  const calculateTotal = (museum) => {
    if (!museum) return;
    
    const adultTotal = formData.adultTickets * (museum.ticketPrices?.adult || 0);
    const childTotal = formData.childTickets * (museum.ticketPrices?.child || 0);
    const seniorTotal = formData.seniorTickets * (museum.ticketPrices?.senior || 0);
    
    setFormData({
      ...formData,
      totalAmount: adultTotal + childTotal + seniorTotal
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.museumId) {
      alert('Please select a museum');
      return;
    }
    
    if (formData.adultTickets === 0 && formData.childTickets === 0 && formData.seniorTickets === 0) {
      alert('Please select at least one ticket');
      return;
    }
    
    // Create booking object
    const bookingData = {
      museum: formData.museumId,
      visitDate: format(formData.date, 'yyyy-MM-dd'),
      tickets: {
        adult: formData.adultTickets,
        child: formData.childTickets,
        senior: formData.seniorTickets
      },
      totalAmount: formData.totalAmount
    };
    
    // Pass the data to parent component
    onProceedToPayment(bookingData);
  };
  
  if (loading) {
    return <Typography>Loading museums...</Typography>;
  }
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Book Your Museum Visit
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="museum-select-label">Museum</InputLabel>
              <Select
                labelId="museum-select-label"
                id="museumId"
                name="museumId"
                value={formData.museumId}
                onChange={handleChange}
                label="Museum"
              >
                {museums.map((museum) => (
                  <MenuItem key={museum._id} value={museum._id}>
                    {museum.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Visit Date"
                value={formData.date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDate={addDays(new Date(), 1)}
                maxDate={addDays(new Date(), 90)}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Adult Tickets"
              name="adultTickets"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              value={formData.adultTickets}
              onChange={handleChange}
              helperText={selectedMuseum ? `₹${selectedMuseum.ticketPrices?.adult || 0} per ticket` : ''}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Child Tickets"
              name="childTickets"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              value={formData.childTickets}
              onChange={handleChange}
              helperText={selectedMuseum ? `₹${selectedMuseum.ticketPrices?.child || 0} per ticket` : ''}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Senior Tickets"
              name="seniorTickets"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              value={formData.seniorTickets}
              onChange={handleChange}
              helperText={selectedMuseum ? `₹${selectedMuseum.ticketPrices?.senior || 0} per ticket` : ''}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Total Amount: ₹{formData.totalAmount}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
              disabled={formData.totalAmount <= 0}
            >
              Proceed to Payment
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default BookingForm;