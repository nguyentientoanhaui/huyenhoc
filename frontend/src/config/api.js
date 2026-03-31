/**
 * API Configuration
 * Automatically detects environment and sets API base URL
 * Supports environment variables for production deployment
 */

import { appConfig } from './env.js';

// Get API host from environment or auto-detect
const getApiHost = () => {
    // If VITE_API_URL is set in environment, use it
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // Otherwise, detect from current location
    const isProduction = import.meta.env.PROD;
    
    if (isProduction) {
        // In production, use same host as frontend
        return `${window.location.protocol}//${window.location.hostname}`;
    } else {
        // In development, use localhost:8888
        return 'http://localhost:8888';
    }
};

const API_HOST = getApiHost();

// Export API endpoints
export const API_CONFIG = {
    HOST: API_HOST,
    BASE_URL: `${API_HOST}/api`,
    AUTH: `${API_HOST}/api/auth`,
    CONSULTANT: `${API_HOST}/api/consultant`,
    ADMIN: `${API_HOST}/api/admin`,
    BAZI: `${API_HOST}/api/bazi`,
    ARTICLES: `${API_HOST}/api/articles`,
    QUE: `${API_HOST}/api/que`,
    TIMEOUT: appConfig.apiTimeout
};

// For debugging
if (import.meta.env.DEV) {
    console.log('[API Config] Environment:', appConfig.environment);
    console.log('[API Config] API Host:', API_HOST);
    console.log('[API Config] API Timeout:', appConfig.apiTimeout);
}

export default API_CONFIG;
