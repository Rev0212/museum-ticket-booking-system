import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Grid,
  Switch,
  InputAdornment,
  Box,
  Typography
} from '@mui/material';
import { createMuseum, updateMuseum } from '../../utils/adminApi';

const defaultMuseum = {
  name: '',
  description: '',
  location: {
    address: '',
    city: '',
    state: '',
    country: '',
  },
  ticketPrices: {
    adult: 50,
    child: 0,
    senior: 20,
  },
  openingHours: {
    open: '09:00',
    close: '17:00',
  },
  contactInfo: {
    phone: '',
    email: '',
    website: '',
  },
  featured: false,
};

const MuseumForm = ({ open, onClose, museum }) => {
  const [formData, setFormData] = useState(defaultMuseum);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  
  const isEditMode = !!museum;
  
  useEffect(() => {
    if (museum) {
      setFormData(museum);
    } else {
      setFormData(defaultMuseum);
    }
  }, [museum]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  const handleSwitchChange = () => {
    setFormData({
      ...formData,
      featured: !formData.featured,
    });
  };
  
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validate()) return;
    
    try {
      setIsSubmitting(true);
      
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'object' && formData[key] !== null && !Array.isArray(formData[key])) {
          Object.keys(formData[key]).forEach(nestedKey => {
            formDataToSend.append(`${key}.${nestedKey}`, formData[key][nestedKey]);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (images.length > 0) {
        images.forEach(image => {
          formDataToSend.append('images', image);
        });
      }
      
      if (isEditMode) {
        await updateMuseum(formData._id, formDataToSend);
      } else {
        await createMuseum(formDataToSend);
      }
      
      onClose(true);
    } catch (error) {
      console.error('Error saving museum:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={() => onClose()} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { bgcolor: 'background.paper' }
      }}
    >
      <DialogTitle>
        {isEditMode ? 'Edit Museum' : 'Add New Museum'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Museum Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={!!errors.name}
                helperText={errors.name}
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
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Location</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
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
                    label="Country"
                    name="location.country"
                    value={formData.location.country}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Ticket Prices</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Adult"
                    type="number"
                    name="ticketPrices.adult"
                    value={formData.ticketPrices.adult}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Child"
                    type="number"
                    name="ticketPrices.child"
                    value={formData.ticketPrices.child}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Senior"
                    type="number"
                    name="ticketPrices.senior"
                    value={formData.ticketPrices.senior}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Opening Hours</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Opening Time"
                    type="time"
                    name="openingHours.open"
                    value={formData.openingHours.open}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Closing Time"
                    type="time"
                    name="openingHours.close"
                    value={formData.openingHours.close}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Contact Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="contactInfo.phone"
                    value={formData.contactInfo.phone}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="contactInfo.email"
                    value={formData.contactInfo.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Website"
                    name="contactInfo.website"
                    value={formData.contactInfo.website}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle1">Museum Images</Typography>
                <TextField
                  fullWidth
                  margin="normal"
                  type="file"
                  inputProps={{ multiple: true, accept: "image/*" }}
                  onChange={handleImageChange}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.featured}
                    onChange={handleSwitchChange}
                    name="featured"
                    color="primary"
                  />
                }
                label="Featured Museum"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ bgcolor: 'background.paper', px: 3, py: 2 }}>
        <Button
          onClick={() => onClose()}
          color="inherit"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained" 
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MuseumForm;