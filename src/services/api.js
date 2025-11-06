import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yourdomain.com/v1';
const API_KEY = import.meta.env.VITE_API_KEY;

// Create Axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add authentication
apiClient.interceptors.request.use(
  (config) => {
    // Add API key to Authorization header
    if (API_KEY) {
      config.headers.Authorization = `Bearer ${API_KEY}`;
    }
    
    // Log request for debugging (remove in production)
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log response for debugging (remove in production)
    console.log('API Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data
      });
      
      switch (error.response.status) {
        case 401:
          console.error('Authentication failed - Invalid API key');
          break;
        case 403:
          console.error('Access forbidden - Insufficient permissions');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Internal server error');
          break;
        default:
          console.error('API request failed:', error.response.data);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response from server:', error.request);
    } else {
      // Error in request setup
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API Methods

/**
 * Submit onboarding form data
 * @param {Object} formData - Complete form data from both sections
 * @returns {Promise} API response
 */
export const submitOnboardingForm = async (formData) => {
  try {
    const response = await apiClient.post('/onboarding', formData);
    return {
      success: true,
      data: response.data,
      message: 'Form submitted successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      message: 'Failed to submit form'
    };
  }
};

/**
 * Get list of available transaction types
 * @returns {Promise} API response with transaction types
 */
export const getTransactionTypes = async () => {
  try {
    const response = await apiClient.get('/transaction-types');
    return {
      success: true,
      data: response.data,
      message: 'Transaction types retrieved successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      message: 'Failed to retrieve transaction types'
    };
  }
};

/**
 * Validate company information
 * @param {Object} companyData - Section 1 company data
 * @returns {Promise} API response
 */
export const validateCompanyInfo = async (companyData) => {
  try {
    const response = await apiClient.post('/validate/company', companyData);
    return {
      success: true,
      data: response.data,
      message: 'Company information validated'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      message: 'Validation failed'
    };
  }
};

/**
 * Get existing onboarding by ID
 * @param {string} onboardingId - Onboarding ID
 * @returns {Promise} API response
 */
export const getOnboarding = async (onboardingId) => {
  try {
    const response = await apiClient.get(`/onboarding/${onboardingId}`);
    return {
      success: true,
      data: response.data,
      message: 'Onboarding data retrieved successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      message: 'Failed to retrieve onboarding data'
    };
  }
};

/**
 * Update existing onboarding
 * @param {string} onboardingId - Onboarding ID
 * @param {Object} formData - Updated form data
 * @returns {Promise} API response
 */
export const updateOnboarding = async (onboardingId, formData) => {
  try {
    const response = await apiClient.put(`/onboarding/${onboardingId}`, formData);
    return {
      success: true,
      data: response.data,
      message: 'Onboarding updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      message: 'Failed to update onboarding'
    };
  }
};

/**
 * Test API connection and authentication
 * @returns {Promise} API response
 */
export const testConnection = async () => {
  try {
    const response = await apiClient.get('/health');
    return {
      success: true,
      data: response.data,
      message: 'Connection successful'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      message: 'Connection failed'
    };
  }
};

// Export the configured axios instance for custom requests
export default apiClient;
