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
  Alert
} from '@mui/material';

const PaymentProcess = ({ bookingData, onNext, onPrevious }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        setError('Please fill all card details');
        return;
      }
      
      // Very basic card validation
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        setError('Card number must be 16 digits');
        return;
      }
      
      if (cvv.length !== 3) {
        setError('CVV must be 3 digits');
        return;
      }
    }
    
    // In a real app, you would process payment here
    // For this demo, just proceed to next step
    
    onNext();
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
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
                {bookingData.visitDate?.toLocaleDateString()}
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
      
      <Box component="form" onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="payment-method-label">Payment Method</InputLabel>
          <Select
            labelId="payment-method-label"
            id="payment-method"
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
        
        {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name on Card"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date (MM/YY)"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                type="password"
                inputProps={{ maxLength: 3 }}
              />
            </Grid>
          </Grid>
        )}
        
        {paymentMethod === 'upi' && (
          <TextField
            fullWidth
            label="UPI ID"
            placeholder="name@upi"
            sx={{ mb: 2 }}
          />
        )}
        
        {paymentMethod === 'net_banking' && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="bank-select-label">Select Bank</InputLabel>
            <Select
              labelId="bank-select-label"
              id="bank-select"
              label="Select Bank"
            >
              <MenuItem value="sbi">State Bank of India</MenuItem>
              <MenuItem value="hdfc">HDFC Bank</MenuItem>
              <MenuItem value="icici">ICICI Bank</MenuItem>
              <MenuItem value="axis">Axis Bank</MenuItem>
            </Select>
          </FormControl>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            onClick={onPrevious}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Pay ₹{bookingData.totalAmount}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentProcess;