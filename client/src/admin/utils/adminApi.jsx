import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance with auth headers
const api = axios.create({
  baseURL: API_BASE_URL
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Museum APIs
export const getMuseums = async () => {
  try {
    const response = await api.get('/museums');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMuseumById = async (id) => {
  try {
    const response = await api.get(`/museums/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createMuseum = async (museumData) => {
  try {
    const response = await api.post('/museums', museumData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateMuseum = async (id, museumData) => {
  try {
    const response = await api.put(`/museums/${id}`, museumData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteMuseum = async (id) => {
  try {
    const response = await api.delete(`/museums/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// News APIs
export const getNews = async () => {
  try {
    const response = await api.get('/news');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createNews = async (newsData) => {
  try {
    const response = await api.post('/news', newsData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateNews = async (id, newsData) => {
  try {
    const response = await api.put(`/news/${id}`, newsData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteNews = async (id) => {
  try {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// User APIs
export const getUsers = async () => {
  try {
    const response = await api.get('/auth/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};