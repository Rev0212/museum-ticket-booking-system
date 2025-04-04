import React, { useState, useContext } from 'react';
import { useHistory, useLocation, Link as RouterLink } from 'react-router-dom';
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
  CircularProgress
} from '@mui/material';
import MuseumIcon from '@mui/icons-material/Museum';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

const LoginPage = () => {
  const history = useHistory();
  const location = useLocation();
  const { loginUser } = useContext(AuthContext);
  
  // Get the page the user was trying to access
  const { from } = location.state || { from: { pathname: '/' } };
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
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
    setLoading(true);
    
    try {
      const data = await loginUser(formData);
      
      // Explicitly reload user data to ensure auth state is current
      await loadUser(); 
      
      // Redirect to the page they were trying to access or dashboard
      history.replace(from || '/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
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
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to continue to Indian Heritage Museums
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
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
          
          <TextField
            fullWidth
            margin="normal"
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
          
          <Box sx={{ textAlign: 'right', mt: 1, mb: 3 }}>
            <Link 
              component={RouterLink} 
              to="/forgot-password"
              sx={{ 
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Forgot password?
            </Link>
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ 
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
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
              Google
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
              Facebook
            </Button>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link 
              component={RouterLink} 
              to="/register"
              sx={{ 
                color: 'primary.main',
                fontWeight: 'bold',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;