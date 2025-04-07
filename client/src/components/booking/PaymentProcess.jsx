import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Divider, 
  Grid, 
  Paper,
  TextField, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import { validateCardNumber, validateExpiryDate } from '../../utils/validation';

// Update the visit date display

const formatDate = (dateValue) => {
  try {
    // Handle various date formats
    if (!dateValue) return 'Date not available';
    
    // If it's already a string in standard format, parse it
    let dateObj;
    if (typeof dateValue === 'string') {
      dateObj = new Date(dateValue);
    } else if (dateValue instanceof Date) {
      dateObj = dateValue;
    } else {
      return 'Invalid date format';
    }
    
    // Verify the date is valid
    if (isNaN(dateObj.getTime())) return 'Invalid date';
    
    // Format the valid date
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (err) {
    console.error('Error formatting date:', err, dateValue);
    return 'Date format error';
  }
};

const PaymentProcess = ({ bookingData, setBookingData, onNext, onPrevious }) => {
  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState(bookingData.paymentMethod || 'credit_card');
  
  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // UPI details
  const [upiId, setUpiId] = useState('');
  
  // Net banking details
  const [bankName, setBankName] = useState('');
  
  // Contact information
  const [contactInfo, setContactInfo] = useState({
    name: bookingData.contactInfo?.name || '',
    email: bookingData.contactInfo?.email || '',
    phone: bookingData.contactInfo?.phone || '',
    address: bookingData.contactInfo?.address || ''
  });
  
  // Delivery preferences
  const [emailDelivery, setEmailDelivery] = useState(true);
  const [smsDelivery, setSmsDelivery] = useState(false);
  
  // Form state
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateContactInfo = () => {
    const newErrors = {};
    
    if (!contactInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!contactInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(contactInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!contactInfo.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(contactInfo.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number should be 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePaymentDetails = () => {
    const newErrors = {};
    
    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      if (!cardName.trim()) {
        newErrors.cardName = 'Name on card is required';
      }
      
      if (!cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!validateCardNumber(cardNumber)) {
        newErrors.cardNumber = 'Invalid card number';
      }
      
      if (!expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!validateExpiryDate(expiryDate)) {
        newErrors.expiryDate = 'Invalid expiry date (use MM/YY format)';
      }
      
      if (!cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3}$/.test(cvv)) {
        newErrors.cvv = 'CVV must be 3 digits';
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId.trim()) {
        newErrors.upiId = 'UPI ID is required';
      } else if (!/^[\w.-]+@[\w]+$/.test(upiId)) {
        newErrors.upiId = 'Invalid UPI ID format';
      }
    } else if (paymentMethod === 'net_banking') {
      if (!bankName) {
        newErrors.bankName = 'Please select a bank';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNextStep = () => {
    if (currentStep === 0) {
      // Validate contact information
      if (validateContactInfo()) {
        setCurrentStep(1);
      }
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep === 0) {
      onPrevious();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const processPayment = () => {
    return new Promise((resolve, reject) => {
      // Simulate payment processing
      setTimeout(() => {
        // 90% chance of success
        const isSuccess = Math.random() < 0.9;
        
        if (isSuccess) {
          resolve({ 
            success: true, 
            transactionId: `TXN${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
            timestamp: new Date()
          });
        } else {
          reject(new Error('Payment failed. Please try again.'));
        }
      }, 2000);
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePaymentDetails()) {
      return;
    }
    
    setError('');
    setIsProcessing(true);
    
    try {
      const paymentResult = await processPayment();
      
      // Update booking data with payment and contact information
      const updatedBookingData = {
        ...bookingData,
        payment: {
          method: paymentMethod,
          transactionId: paymentResult.transactionId,
          timestamp: paymentResult.timestamp
        },
        contactInfo,
        deliveryPreferences: {
          email: emailDelivery,
          sms: smsDelivery
        },
        paymentMethod
      };
      
      setBookingData(updatedBookingData);
      
      // Proceed to next step
      onNext();
    } catch (err) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const steps = [
    'Contact Information',
    'Payment Details'
  ];
  
  return (
    <Box>
      <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Box sx={{ mb: 4 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Booking Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">Museum:</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight="bold">
                {bookingData.museum?.name}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">Visit Date:</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight="bold">
                {formatDate(bookingData.visitDate)}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2">Tickets:</Typography>
            </Grid>
            
            {bookingData.tickets?.map((ticket, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    {ticket.quantity} x {ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}:
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    ₹{ticket.price * ticket.quantity}
                  </Typography>
                </Grid>
              </React.Fragment>
            ))}
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Total Amount:</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                ₹{bookingData.totalAmount}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {currentStep === 0 ? (
        <Box component="form">
          <Typography variant="h6" gutterBottom>
            Contact Information for Ticket Delivery
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={contactInfo.name}
                onChange={handleContactInfoChange}
                required
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={contactInfo.email}
                onChange={handleContactInfoChange}
                required
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={contactInfo.phone}
                onChange={handleContactInfoChange}
                required
                error={!!errors.phone}
                helperText={errors.phone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address (Optional)"
                name="address"
                value={contactInfo.address}
                onChange={handleContactInfoChange}
                multiline
                rows={2}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Delivery Preferences
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={emailDelivery} 
                    onChange={(e) => setEmailDelivery(e.target.checked)}
                  />
                }
                label="Send tickets to email"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={smsDelivery} 
                    onChange={(e) => setSmsDelivery(e.target.checked)}
                  />
                }
                label="Send tickets via SMS"
              />
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              onClick={handlePreviousStep}
              variant="outlined"
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextStep}
            >
              Continue to Payment
            </Button>
          </Box>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Payment Method
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 3 }} error={!!errors.paymentMethod}>
            <InputLabel id="payment-method-label">Payment Method</InputLabel>
            <Select
              labelId="payment-method-label"
              id="payment-method"
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setErrors({});
              }}
              label="Payment Method"
              startAdornment={
                <InputAdornment position="start">
                  {paymentMethod === 'credit_card' || paymentMethod === 'debit_card' ? (
                    <CreditCardIcon />
                  ) : paymentMethod === 'upi' ? (
                    <PhoneAndroidIcon />
                  ) : (
                    <AccountBalanceIcon />
                  )}
                </InputAdornment>
              }
            >
              <MenuItem value="credit_card">Credit Card</MenuItem>
              <MenuItem value="debit_card">Debit Card</MenuItem>
              <MenuItem value="upi">UPI</MenuItem>
              <MenuItem value="net_banking">Net Banking</MenuItem>
            </Select>
            {errors.paymentMethod && <FormHelperText>{errors.paymentMethod}</FormHelperText>}
          </FormControl>
          
          {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Card Number"
                  value={cardNumber}
                  onChange={(e) => {
                    setCardNumber(e.target.value);
                    if (errors.cardNumber) setErrors({...errors, cardNumber: ''});
                  }}
                  placeholder="1234 5678 9012 3456"
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCardIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name on Card"
                  value={cardName}
                  onChange={(e) => {
                    setCardName(e.target.value);
                    if (errors.cardName) setErrors({...errors, cardName: ''});
                  }}
                  error={!!errors.cardName}
                  helperText={errors.cardName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expiry Date (MM/YY)"
                  value={expiryDate}
                  onChange={(e) => {
                    setExpiryDate(e.target.value);
                    if (errors.expiryDate) setErrors({...errors, expiryDate: ''});
                  }}
                  placeholder="MM/YY"
                  error={!!errors.expiryDate}
                  helperText={errors.expiryDate}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  value={cvv}
                  onChange={(e) => {
                    setCvv(e.target.value);
                    if (errors.cvv) setErrors({...errors, cvv: ''});
                  }}
                  type="password"
                  inputProps={{ maxLength: 3 }}
                  error={!!errors.cvv}
                  helperText={errors.cvv}
                />
              </Grid>
            </Grid>
          )}
          
          {paymentMethod === 'upi' && (
            <TextField
              fullWidth
              label="UPI ID"
              value={upiId}
              onChange={(e) => {
                setUpiId(e.target.value);
                if (errors.upiId) setErrors({...errors, upiId: ''});
              }}
              placeholder="name@upi"
              sx={{ mb: 2 }}
              error={!!errors.upiId}
              helperText={errors.upiId || "Enter your UPI ID (e.g., name@upi)"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneAndroidIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
          
          {paymentMethod === 'net_banking' && (
            <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.bankName}>
              <InputLabel id="bank-select-label">Select Bank</InputLabel>
              <Select
                labelId="bank-select-label"
                id="bank-select"
                value={bankName}
                onChange={(e) => {
                  setBankName(e.target.value);
                  if (errors.bankName) setErrors({...errors, bankName: ''});
                }}
                label="Select Bank"
                error={!!errors.bankName}
              >
                <MenuItem value="sbi">State Bank of India</MenuItem>
                <MenuItem value="hdfc">HDFC Bank</MenuItem>
                <MenuItem value="icici">ICICI Bank</MenuItem>
                <MenuItem value="axis">Axis Bank</MenuItem>
                <MenuItem value="pnb">Punjab National Bank</MenuItem>
              </Select>
              {errors.bankName && <FormHelperText>{errors.bankName}</FormHelperText>}
            </FormControl>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              onClick={handlePreviousStep}
              variant="outlined"
              disabled={isProcessing}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isProcessing}
              startIcon={isProcessing && <CircularProgress size={20} color="inherit" />}
            >
              {isProcessing ? 'Processing...' : `Pay ₹${bookingData.totalAmount}`}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PaymentProcess;