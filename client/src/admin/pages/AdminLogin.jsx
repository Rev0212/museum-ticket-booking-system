import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password
      });
      
      // Check if user is admin
      if (response.data.user.role !== 'admin') {
        setError('Unauthorized: Admin access only');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      history.push('/admin');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="grey.100"
    >
      <Paper elevation={3} style={{ padding: '2rem', maxWidth: '400px' }}>
        <Box textAlign="center" marginBottom="1.5rem">
          <Typography variant="h4">Admin Login</Typography>
          <Typography variant="body2" color="textSecondary">
            Enter your credentials to access the admin panel
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" style={{ marginBottom: '1rem' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FormHelperText>Enter your email address</FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormHelperText>Enter your password</FormHelperText>
          </FormControl>

          <Box marginTop="1.5rem">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AdminLogin;