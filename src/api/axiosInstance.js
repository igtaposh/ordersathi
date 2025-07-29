import axios from 'axios';

/**
 * Base URL for API requests
 * In production, use the environment variable or the deployed API URL
 */
const baseURL = import.meta.env.VITE_API_URL || 'https://ordersathi.onrender.com/api';

/**
 * Create axios instance with base URL and default headers
 */
const axiosInstance = axios.create({
   baseURL,
   headers: {
      'Content-Type': 'application/json',
   },
   withCredentials: true, // Important for cookies/sessions
});

/**
 * Set auth token for all requests
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
   if (token) {
      // Set token for all requests
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
   } else {
      // Remove token if null/undefined
      delete axiosInstance.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
   }
};

/**
 * Initialize auth token from localStorage (for app startup)
 */
const token = localStorage.getItem('token');
if (token) {
   setAuthToken(token);
}

/**
 * Add response interceptor to handle expired tokens/auth errors
 */
axiosInstance.interceptors.response.use(
   (response) => response,
   (error) => {
      const { status } = error.response || {};

      // Handle auth errors (401 Unauthorized, 403 Forbidden)
      if (status === 401 || status === 403) {
         // Clear auth data
         setAuthToken(null);
         localStorage.removeItem('user');

         // Redirect to login if not already there
         if (
            window.location.pathname !== '/login' &&
            window.location.pathname !== '/register'
         ) {
            window.location.href = '/login';
         }
      }

      return Promise.reject(error);
   }
);

export default axiosInstance;