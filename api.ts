import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your Laravel backend URL
// For local development, use your computer's IP address or localhost
const API_BASE_URL = 'http://192.168.1.179:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for mobile networks
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('Response error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      // You can dispatch a logout action here if using Redux
    }
    return Promise.reject(error);
  }
);

export default api; 