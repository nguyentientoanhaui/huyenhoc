/**
 * Environment Configuration
 * Handles environment-specific settings for frontend
 */

// Detect environment
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Get API URL from environment variable or detect from current location
const getApiUrl = () => {
    // If VITE_API_URL is set, use it
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // Otherwise, detect from current location
    if (isProduction) {
        // In production, use same host as frontend
        return `${window.location.protocol}//${window.location.hostname}`;
    } else {
        // In development, use localhost:8888
        return 'http://localhost:8888';
    }
};

// Get app configuration
const getAppConfig = () => {
    return {
        name: import.meta.env.VITE_APP_NAME || 'BaZi Mega-Evolution',
        version: import.meta.env.VITE_APP_VERSION || '2.1',
        description: import.meta.env.VITE_APP_DESCRIPTION || 'Huyền Cơ Bát Tự - Phân tích Tứ Trụ',
        apiUrl: getApiUrl(),
        apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
        isDevelopment,
        isProduction,
        environment: isDevelopment ? 'development' : 'production'
    };
};

// Feature flags
const getFeatureFlags = () => {
    return {
        enableAiConsultant: import.meta.env.VITE_ENABLE_AI_CONSULTANT !== 'false',
        enableMatching: import.meta.env.VITE_ENABLE_MATCHING !== 'false',
        enableArticles: import.meta.env.VITE_ENABLE_ARTICLES !== 'false',
        enableAdminPanel: import.meta.env.VITE_ENABLE_ADMIN_PANEL !== 'false'
    };
};

// Analytics configuration
const getAnalyticsConfig = () => {
    return {
        googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || null,
        sentryDsn: import.meta.env.VITE_SENTRY_DSN || null
    };
};

// Export configuration
export const appConfig = getAppConfig();
export const featureFlags = getFeatureFlags();
export const analyticsConfig = getAnalyticsConfig();

// Log configuration in development
if (isDevelopment) {
    console.log('[ENV] Application Configuration:', appConfig);
    console.log('[ENV] Feature Flags:', featureFlags);
}

export default {
    appConfig,
    featureFlags,
    analyticsConfig
};
