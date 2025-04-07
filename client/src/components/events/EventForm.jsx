import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress 
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addHours, addDays } from 'date-fns';
import { createEventWithCalendar, getAllMuseums } from '../../utils/api';

const EventForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    museum: '',
    imageUrl: '',
    startDate: addDays(new Date(), 1),
    endDate: addDays(addHours(new Date(), 2), 1),
    location: {
      address: '',
      city: '',
      state: ''
    },
    category: 'Exhibition',
    ticketPrice: 0,
    featured: false,
    addToCalendar: true
  });
  
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchMuseums = async () => {
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
    };
    
    fetchMuseums();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (location)
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleDateChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setSubmitting(true);
      
      // Validate form
      if (!formData.title || !formData.description || !formData.category) {
        setError('Please fill in all required fields');
        setSubmitting(false);
        return;
      }
      
      // Create event
      const createdEvent = await createEventWithCalendar(formData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        museum: '',
        imageUrl: '',
        startDate: addDays(new Date(), 1),
        endDate: addDays(addHours(new Date(), 2), 1),
        location: {
          address: '',
          city: '',
          state: ''
        },
        category: 'Exhibition',
        ticketPrice: 0,
        featured: false,
        addToCalendar: true
      });
      
      // Call success callback
      if (onSuccess) {
        onSuccess(createdEvent);
      }
      
    } catch (err) {
      setError(err.msg || 'Failed to create event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create New Event
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Event Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Museum</InputLabel>
              <Select
                name="museum"
                value={formData.museum}
                onChange={handleChange}
                label="Museum"
              >
                <MenuItem value="">None</MenuItem>
                {museums.map((museum) => (
                  <MenuItem key={museum._id} value={museum._id}>
                    {museum.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
                required
              >
                <MenuItem value="Exhibition">Exhibition</MenuItem>
                <MenuItem value="Workshop">Workshop</MenuItem>
                <MenuItem value="Lecture">Lecture</MenuItem>
                <MenuItem value="Performance">Performance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Start Date & Time"
                value={formData.startDate}
                onChange={(value) => handleDateChange('startDate', value)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDateTime={new Date()}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="End Date & Time"
                value={formData.endDate}
                onChange={(value) => handleDateChange('endDate', value)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDateTime={formData.startDate}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Location
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State"
              name="location.state"
              value={formData.location.state}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ticket Price (₹)"
              name="ticketPrice"
              type="number"
              value={formData.ticketPrice}
              onChange={handleChange}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ pt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.featured}
                    onChange={handleSwitchChange}
                    name="featured"
                  />
                }
                label="Featured Event"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.addToCalendar}
                    onChange={handleSwitchChange}
                    name="addToCalendar"
                  />
                }
                label="Add to Calendar"
              />
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={submitting}
              sx={{ mt: 2 }}
            >
              {submitting ? <CircularProgress size={24} /> : 'Create Event'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default EventForm;