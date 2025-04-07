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
  Box,
  FormHelperText,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays } from 'date-fns';
import { getAllMuseums } from '../../utils/api';
import { isValidDate } from '../../utils/validation';

const TicketTypeRow = ({ type, label, price, quantity, onChange }) => {
  return (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
      <Grid item xs={5}>
        <Typography>{label}</Typography>
        <Typography variant="caption" color="text.secondary">
          ₹{price} per ticket
        </Typography>
      </Grid>
      <Grid item xs={7}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            color="primary" 
            onClick={() => onChange(type, Math.max(0, quantity - 1))}
            disabled={quantity <= 0}
          >
            <RemoveIcon />
          </IconButton>
          <TextField
            value={quantity}
            onChange={(e) => onChange(type, parseInt(e.target.value) || 0)}
            inputProps={{ min: 0, style: { textAlign: 'center' } }}
            sx={{ width: '60px', mx: 1 }}
          />
          <IconButton 
            color="primary" 
            onClick={() => onChange(type, quantity + 1)}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Grid>
    </Grid>
  );
};

const BookingForm = ({ bookingData, setBookingData, loading: externalLoading, onNext }) => {
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  // Deconstruct for ease of use
  const { museum, visitDate, tickets } = bookingData;
  
  // Local state for ticket quantities
  const [ticketQuantities, setTicketQuantities] = useState({
    adult: 0,
    child: 0,
    senior: 0
  });

  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAllMuseums();
        setMuseums(data);
        
        // Pre-select museum if already in booking data
        if (bookingData.museum) {
          // Make sure it exists in our museum list
          const exists = data.some(m => m._id === bookingData.museum._id);
          if (!exists) {
            setBookingData(prev => ({...prev, museum: null}));
          }
        }
        
        // Extract ticket quantities from booking data if available
        if (bookingData.tickets && bookingData.tickets.length > 0) {
          const quantities = {
            adult: 0,
            child: 0,
            senior: 0
          };
          
          bookingData.tickets.forEach(ticket => {
            if (quantities[ticket.type] !== undefined) {
              quantities[ticket.type] = ticket.quantity;
            }
          });
          
          setTicketQuantities(quantities);
        }
      } catch (err) {
        console.error('Error fetching museums:', err);
        setError('Failed to load museums. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMuseums();
  }, [bookingData.museum, bookingData.tickets, setBookingData]);
  
  const handleMuseumChange = (e) => {
    const selectedMuseumId = e.target.value;
    const selectedMuseum = museums.find(m => m._id === selectedMuseumId);
    
    setBookingData(prev => ({
      ...prev,
      museum: selectedMuseum
    }));
    
    // Reset errors
    setFormErrors(prev => ({...prev, museum: ''}));
  };
  
  const handleDateChange = (date) => {
    // Skip updating state if date is invalid
    if (!date || date === 'Invalid Date' || isNaN(new Date(date).getTime())) {
      console.error('Invalid date ignored:', date);
      return;
    }
    
    setBookingData(prev => ({
      ...prev,
      visitDate: date
    }));
  };
  
  const handleTicketQuantityChange = (type, quantity) => {
    setTicketQuantities(prev => ({
      ...prev,
      [type]: quantity
    }));
    
    // Reset errors
    setFormErrors(prev => ({...prev, tickets: ''}));
  };
  
  const calculateTotalAmount = () => {
    if (!museum || !museum.ticketPrices) return 0;
    
    const { adult, child, senior } = ticketQuantities;
    const prices = museum.ticketPrices;
    
    return (adult * prices.adult) + (child * prices.child) + (senior * prices.senior);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const errors = {};
    
    if (!museum) {
      errors.museum = 'Please select a museum';
    }
    
    if (!visitDate || !isValidDate(visitDate)) {
      errors.visitDate = 'Please select a valid visit date';
    }
    
    const totalTickets = ticketQuantities.adult + ticketQuantities.child + ticketQuantities.senior;
    if (totalTickets === 0) {
      errors.tickets = 'Please select at least one ticket';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Create tickets array with price information
    const ticketArray = [];
    const { adult, child, senior } = ticketQuantities;
    const prices = museum.ticketPrices;
    
    if (adult > 0) {
      ticketArray.push({
        type: 'adult',
        quantity: adult,
        price: prices.adult
      });
    }
    
    if (child > 0) {
      ticketArray.push({
        type: 'child',
        quantity: child,
        price: prices.child
      });
    }
    
    if (senior > 0) {
      ticketArray.push({
        type: 'senior',
        quantity: senior,
        price: prices.senior
      });
    }
    
    // Update booking data and proceed to next step
    const totalAmount = calculateTotalAmount();
    
    // Format the date as string - add defensive handling
    let formattedDate;
    try {
      // Make sure visitDate is a valid date first
      if (visitDate && !isNaN(new Date(visitDate).getTime())) {
        formattedDate = format(new Date(visitDate), 'yyyy-MM-dd');
      } else {
        // Use tomorrow as fallback
        formattedDate = format(addDays(new Date(), 1), 'yyyy-MM-dd');
        console.warn('Using fallback date due to invalid visitDate:', visitDate);
      }
    } catch (err) {
      console.error('Error formatting date:', err);
      formattedDate = format(addDays(new Date(), 1), 'yyyy-MM-dd');
    }

    const updatedData = {
      tickets: ticketArray,
      totalAmount,
      visitDate: formattedDate
    };

    console.log('Submitting data with date:', formattedDate);
    onNext(updatedData);
  };
  
  const isLoading = loading || externalLoading;
  
  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth error={!!formErrors.museum}>
            <InputLabel>Select Museum</InputLabel>
            <Select
              value={museum?._id || ''}
              onChange={handleMuseumChange}
              label="Select Museum"
              disabled={isLoading}
            >
              {isLoading ? (
                <MenuItem value="" disabled>
                  Loading museums...
                </MenuItem>
              ) : (
                museums.map(museum => (
                  <MenuItem key={museum._id} value={museum._id}>
                    {museum.name}
                  </MenuItem>
                ))
              )}
            </Select>
            {formErrors.museum && (
              <FormHelperText>{formErrors.museum}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Visit Date"
              value={bookingData.visitDate && !isNaN(new Date(bookingData.visitDate).getTime()) 
                     ? new Date(bookingData.visitDate) 
                     : null}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!formErrors.visitDate,
                  helperText: formErrors.visitDate || ''
                }
              }}
              minDate={addDays(new Date(), 1)}
              maxDate={addDays(new Date(), 90)}
              disabled={isLoading}
            />
          </LocalizationProvider>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Select Tickets
          </Typography>
          
          {formErrors.tickets && (
            <FormHelperText error>{formErrors.tickets}</FormHelperText>
          )}
          
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            {museum && museum.ticketPrices ? (
              <>
                <TicketTypeRow 
                  type="adult"
                  label="Adult"
                  price={museum.ticketPrices.adult}
                  quantity={ticketQuantities.adult}
                  onChange={handleTicketQuantityChange}
                />
                
                <TicketTypeRow 
                  type="child"
                  label="Child"
                  price={museum.ticketPrices.child}
                  quantity={ticketQuantities.child}
                  onChange={handleTicketQuantityChange}
                />
                
                <TicketTypeRow 
                  type="senior"
                  label="Senior"
                  price={museum.ticketPrices.senior}
                  quantity={ticketQuantities.senior}
                  onChange={handleTicketQuantityChange}
                />
              </>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                {isLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  <Typography color="text.secondary">
                    Please select a museum to view ticket options
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6">
              Total Amount: ₹{calculateTotalAmount()}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            disabled={isLoading || calculateTotalAmount() === 0}
            size="large"
          >
            {isLoading ? <CircularProgress size={24} /> : 'Proceed to Payment'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingForm;