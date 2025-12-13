/**
 * Global error handling middleware
 * Catches all errors and sends appropriate response
 */
const errorHandler = (err, req, res, next) => {
  console.log('❌ [ERROR] Error occurred');
  console.log('📍 [ERROR] Path:', req.method, req.originalUrl);
  console.log('💥 [ERROR] Message:', err.message);
  console.log('🔢 [ERROR] Status:', err.statusCode || 500);
  
  // Only log full errors in development
  if (process.env.NODE_ENV === 'development') {
    console.error('📋 [ERROR] Stack:', err.stack);
  }

  // Default error
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error'
  };

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.statusCode = 400;
    error.message = 'Invalid ID format';
    console.log('🔍 [ERROR] Type: Mongoose CastError');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error.statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    error.message = `${field} already exists`;
    console.log('🔍 [ERROR] Type: Duplicate Key Error');
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.statusCode = 400;
    error.message = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    console.log('🔍 [ERROR] Type: Validation Error');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.message = 'Invalid token';
    console.log('🔍 [ERROR] Type: JWT Error - Invalid Token');
  }

  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.message = 'Token expired';
    console.log('🔍 [ERROR] Type: JWT Error - Token Expired');
  }

  console.log('📤 [ERROR] Sending response:', error.statusCode, error.message);

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Handle 404 errors for undefined routes
 */
const notFound = (req, res, next) => {
  console.log('❌ [404] Route not found');
  console.log('📍 [404] Path:', req.method, req.originalUrl);
  console.log('🌐 [404] IP:', req.ip || req.connection.remoteAddress);
  
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Async handler wrapper to catch errors in async functions
 * Usage: asyncHandler(async (req, res) => { ... })
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler
};

