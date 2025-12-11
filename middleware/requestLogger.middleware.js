/**
 * Request logger middleware
 * Logs incoming requests with timestamp, method, and URL
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

  // Log response time
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${timestamp}] ${method} ${url} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};

/**
 * Rate limiting helper (simple in-memory implementation)
 * For production, use redis-based rate limiting
 */
const createRateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const userRequests = requests.get(ip);
    
    // Remove old requests outside the time window
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later'
      });
    }

    validRequests.push(now);
    requests.set(ip, validRequests);
    
    next();
  };
};

module.exports = {
  requestLogger,
  createRateLimiter
};

