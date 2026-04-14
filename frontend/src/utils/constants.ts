// Application constants
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Nucleus Metal Cast',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  API_URL: import.meta.env.VITE_API_URL || '/api',
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  ODOO_URL: import.meta.env.VITE_ODOO_URL || 'http://localhost:8069',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true'
};

// UI Constants
export const UI_CONSTANTS = {
  LOADING_DELAY: 300,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  TOAST_DURATION: 5000,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  LEADS: '/leads',
  PAGES: '/pages',
  AUTH: {
    LOGIN: '/auth/login',
    VERIFY: '/auth/verify',
    LOGOUT_REDIRECT: '/auth/logout-redirect',
    CREATE_ODOO_SESSION: '/auth/create-odoo-session'
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  TIMEOUT: 'Request timed out. Please try again.',
  UNKNOWN: 'An unexpected error occurred.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LEAD_SUBMITTED: 'Your inquiry has been submitted successfully. We will contact you soon.',
  LOGIN_SUCCESS: 'Login successful!',
  REGISTRATION_SUCCESS: 'Registration successful! Please check your email for verification.',
  VERIFICATION_SUCCESS: 'Email verified successfully!'
};

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[\d\s\-\(\)]+$/,
  NAME: /^[a-zA-Z\s]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
};

// Default Values
export const DEFAULTS = {
  PAGINATION: {
    PAGE: 1,
    LIMIT: 12
  },
  IMAGES: {
    PLACEHOLDER: 'https://placehold.co/600x400/eeeeee/999999?text=No+Image',
    FALLBACK: 'https://images.unsplash.com/photo-1565514020179-026b92b217ac?auto=format&fit=crop&w=800&q=80'
  }
};
