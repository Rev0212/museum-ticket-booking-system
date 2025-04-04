import React, { useState, useContext } from 'react';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Grid,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import MuseumIcon from '@mui/icons-material/Museum';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

const RegisterPage = () => {
  const history = useHistory();
  const { registerUser } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!agreeTerms) {
      setError('You must agree to the Terms and Conditions');
      return;
    }
    
    setLoading(true);
    
    try {
      // Remove confirmPassword from the data sent to the API
      const { confirmPassword, ...registrationData } = formData;
      await registerUser(registrationData);
      
      // Registration successful, redirect to dashboard or home
      history.push('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper 
        elevation={3}
        sx={{ 
          p: 4, 
          borderRadius: 2,
          border: '1px solid rgba(156, 87, 0, 0.1)',
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <MuseumIcon 
            color="primary" 
            sx={{ 
              fontSize: 56, 
              mb: 2,
              p: 1,
              borderRadius: '50%',
              bgcolor: 'rgba(156, 87, 0, 0.1)'
            }} 
          />
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Create an Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join Indian Heritage Museums to explore India's cultural treasures
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                type="text"
                variant="outlined"
                required
                value={formData.name}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                variant="outlined"
                required
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
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
                type="tel"
                variant="outlined"
                value={formData.phone}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                required
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                variant="outlined"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={toggleShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Link 
                      component={RouterLink}
                      to="/terms"
                      sx={{ color: 'primary.main' }}
                    >
                      Terms and Conditions
                    </Link>
                    {' '}and{' '}
                    <Link 
                      component={RouterLink}
                      to="/privacy"
                      sx={{ color: 'primary.main' }}
                    >
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
            </Grid>
          </Grid>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading || !agreeTerms}
            sx={{ 
              mt: 3,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </Button>
        </form>
        
        <Box sx={{ my: 3, position: 'relative' }}>
          <Divider sx={{ '&::before, &::after': { borderColor: 'divider' } }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ px: 2 }}
            >
              OR
            </Typography>
          </Divider>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{ 
                py: 1.2,
                color: '#DB4437',
                borderColor: '#DB4437',
                '&:hover': {
                  borderColor: '#DB4437',
                  bgcolor: 'rgba(219, 68, 55, 0.04)'
                }
              }}
            >
              Sign up with Google
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
              sx={{ 
                py: 1.2,
                color: '#4267B2',
                borderColor: '#4267B2',
                '&:hover': {
                  borderColor: '#4267B2',
                  bgcolor: 'rgba(66, 103, 178, 0.04)'
                }
              }}
            >
              Sign up with Facebook
            </Button>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link 
              component={RouterLink} 
              to="/login"
              sx={{ 
                color: 'primary.main',
                fontWeight: 'bold',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;