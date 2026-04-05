import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding auth token (when implemented)
apiClient.interceptors.request.use(
  (config) => {
    // Future: Add JWT token to headers
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Future: Handle unauthorized (redirect to login)
        console.warn('Unauthorized - redirect to login');
      } else if (error.response.status === 403) {
        console.warn('Forbidden - insufficient permissions');
      } else if (error.response.status === 404) {
        console.warn('Resource not found');
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response from server:', error.request);
    } else {
      // Something else happened
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
