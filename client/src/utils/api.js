import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Handle authentication errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API calls - FIX THESE ENDPOINTS
export const registerUser = async (userData) => {
  try {
    // Changed from '/users' to '/auth/register'
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { msg: 'Server error' };
  }
};

export const loginUser = async (userData) => {
  try {
    // Changed from '/auth' to '/auth/login'
    const response = await api.post('/auth/login', userData);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { msg: 'Server error' };
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getUserProfile = async () => {
  try {
    // Keep as '/auth' - this matches your backend route
    const response = await api.get('/auth');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { msg: 'Server error' };
  }
};

// Museum API calls
export const fetchFeaturedMuseums = async () => {
  try {
    const response = await api.get('/museums/featured');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured museums:', error);
    throw error;
  }
};

// Get all museums
export const getAllMuseums = async () => {
  try {
    const response = await api.get('/museums');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { msg: 'Server error' };
  }
};

// Get museum by ID
export const getMuseumById = async (id) => {
  try {
    const response = await api.get(`/museums/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { msg: 'Server error' };
  }
};

// News API calls - update to use your server proxy
export const fetchNews = async () => {
  try {
    const response = await api.get('/news');
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    // Return empty array instead of throwing to prevent component crashes
    return [];
  }
};

// Event API calls
export const fetchUpcomingEvents = async () => {
  try {
    const response = await api.get('/events/upcoming');
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
};

export const getUpcomingEvents = async () => {
  try {
    const response = await api.get('/events/upcoming');
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
};

export const getEventById = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    throw error;
  }
};

// Booking API calls
export const bookTickets = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error booking tickets:', error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error.response ? error.response.data : { msg: 'Server error' };
  }
};

// Replace this function
export const fetchUserBookings = async () => {
  try {
    // Don't pass the user ID - the server already knows the user from the auth token
    const response = await api.get('/bookings/current');
    return response.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return []; // Return empty array instead of throwing error to prevent UI crashes
  }
};

export const getCurrentBookings = async () => {
  try {
    const response = await api.get('/bookings/current');
    return response.data;
  } catch (error) {
    console.error('Error fetching current bookings:', error);
    return [];
  }
};

export const getBookingHistory = async () => {
  try {
    const response = await api.get('/bookings/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching booking history:', error);
    return [];
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking ${id}:`, error);
    throw error;
  }
};

export const cancelBooking = async (id) => {
  try {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  } catch (error) {
    console.error(`Error cancelling booking ${id}:`, error);
    throw error.response ? error.response.data : { msg: 'Server error' };
  }
};

// For email functions, rename for clarity
export const sendTicketEmailWithData = async (ticketData) => {
  try {
    const response = await api.post('/email/send', ticketData);
    return response.data;
  } catch (error) {
    console.error('Error sending ticket via email:', error);
    throw error;
  }
};

export const sendTicketEmailById = async (id) => {
  try {
    const response = await api.post(`/bookings/${id}/send-ticket/email`);
    return response.data;
  } catch (error) {
    console.error('Error sending ticket via email:', error);
    throw error.response ? error.response.data : { msg: 'Server error' };
  }
};

// For WhatsApp functions, rename for clarity
export const sendTicketWhatsAppWithData = async (ticketData) => {
  try {
    const response = await api.post('/whatsapp/send', ticketData);
    return response.data;
  } catch (error) {
    console.error('Error sending ticket via WhatsApp:', error);
    throw error;
  }
};

export const sendTicketWhatsAppById = async (id) => {
  try {
    const response = await api.post(`/bookings/${id}/send-ticket/whatsapp`);
    return response.data;
  } catch (error) {
    console.error('Error sending ticket via WhatsApp:', error);
    throw error.response ? error.response.data : { msg: 'Server error' };
  }
};

/**
 * Download ticket as PDF
 * @param {string} id - Booking ID
 */
export const downloadTicketPDF = async (id) => {
  try {
    // For file downloads, we need to use a different approach
    // We'll create a temporary anchor element and simulate a click
    
    // Get the authentication token
    const token = localStorage.getItem('token');
    
    // Create URL with token in the header using fetch
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/download-ticket`, {
      headers: {
        'x-auth-token': token
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to download ticket');
    }
    
    // Convert response to blob
    const blob = await response.blob();
    
    // Create URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    
    // Set the file name
    const fileName = response.headers.get('content-disposition')
      ? response.headers.get('content-disposition').split('filename=')[1].replace(/"/g, '')
      : `ticket-${id}.pdf`;
    
    a.download = fileName;
    
    // Append to body, click, and clean up
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return { success: true };
  } catch (error) {
    console.error('Error downloading ticket:', error);
    throw error;
  }
};