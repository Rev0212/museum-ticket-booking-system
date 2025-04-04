import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:5001/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Inside your AuthContext provider:

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    // If no token, clear auth state
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    
    try {
      // Set auth token header
      axios.defaults.headers.common['x-auth-token'] = token;
      
      const response = await axios.get(`${API_BASE_URL}/auth`);
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Token verification failed:', err);
      // Clear invalid auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['x-auth-token'];
      setUser(null);
      setIsAuthenticated(false);
      setError('Authentication session expired. Please log in again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Run loadUser on component mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Register user
  const registerUser = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, formData);
      
      // Store token and user data
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      setUser(res.data.user);
      setIsAuthenticated(true);
      
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const loginUser = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, formData);
      
      // Store token and user data
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      setUser(res.data.user);
      setIsAuthenticated(true);
      
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Invalid credentials';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      error,
      registerUser,
      loginUser,
      logoutUser,
      loadUser // Include loadUser in the context
    }}>
      {children}
    </AuthContext.Provider>
  );
};