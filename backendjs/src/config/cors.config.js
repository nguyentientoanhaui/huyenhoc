/**
 * CORS Configuration
 * Handles Cross-Origin Resource Sharing for different environments
 */

const getCorsOptions = () => {
    const nodeEnv = process.env.NODE_ENV || 'development';
    const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3005';

    // Parse CORS_ORIGIN (can be comma-separated list)
    const allowedOrigins = corsOrigin.split(',').map(origin => origin.trim());

    const options = {
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            // Check if origin is in whitelist
            if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
                callback(null, true);
            } else {
                console.warn(`[CORS] Rejected request from origin: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
        maxAge: 86400 // 24 hours
    };

    console.log(`[CORS] Configured for ${nodeEnv} environment`);
    console.log(`[CORS] Allowed origins: ${allowedOrigins.join(', ')}`);

    return options;
};

module.exports = {
    getCorsOptions
};
