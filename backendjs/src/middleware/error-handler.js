/**
 * Error Handler Middleware
 * Handles errors and returns appropriate responses
 */

const errorHandler = (err, req, res, next) => {
    const nodeEnv = process.env.NODE_ENV || 'development';
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    // Log error
    console.error(`[ERROR] ${statusCode} - ${message}`);
    if (nodeEnv === 'development') {
        console.error(err.stack);
    }

    // Database errors
    if (err.code === 'ECONNREFUSED') {
        return res.status(503).json({
            error: 'Database connection failed',
            message: 'Service temporarily unavailable',
            code: 'DB_CONNECTION_ERROR'
        });
    }

    // PostgreSQL specific errors
    if (err.code === '23505') { // Unique violation
        return res.status(409).json({
            error: 'Conflict',
            message: 'Resource already exists',
            code: 'UNIQUE_VIOLATION'
        });
    }

    if (err.code === '23503') { // Foreign key violation
        return res.status(400).json({
            error: 'Invalid reference',
            message: 'Referenced resource does not exist',
            code: 'FOREIGN_KEY_VIOLATION'
        });
    }

    // Authentication errors
    if (err.statusCode === 401) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: err.message || 'Authentication required',
            code: 'UNAUTHORIZED'
        });
    }

    // Authorization errors
    if (err.statusCode === 403) {
        return res.status(403).json({
            error: 'Forbidden',
            message: err.message || 'Access denied',
            code: 'FORBIDDEN'
        });
    }

    // Validation errors
    if (err.statusCode === 400) {
        return res.status(400).json({
            error: 'Bad request',
            message: err.message || 'Invalid request',
            code: 'BAD_REQUEST'
        });
    }

    // Rate limit errors
    if (err.statusCode === 429) {
        return res.status(429).json({
            error: 'Too many requests',
            message: err.message || 'Rate limit exceeded',
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: err.retryAfter || 60
        });
    }

    // Default error response
    const response = {
        error: 'Internal server error',
        message: nodeEnv === 'development' ? message : 'An error occurred',
        code: 'INTERNAL_SERVER_ERROR'
    };

    if (nodeEnv === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Custom error class
 */
class AppError extends Error {
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    errorHandler,
    asyncHandler,
    AppError
};
