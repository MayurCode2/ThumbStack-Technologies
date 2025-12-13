const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    console.log('🔐 [AUTH] Authentication attempt');
    console.log('📍 [AUTH] Path:', req.method, req.originalUrl);
    console.log('🌐 [AUTH] IP:', req.ip || req.connection.remoteAddress);
    
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('✅ [AUTH] Authorization header found');
      console.log('🔑 [AUTH] Token preview:', token ? token.substring(0, 20) + '...' : 'none');
    } else {
      console.log('❌ [AUTH] No Authorization header found');
      console.log('📋 [AUTH] Headers:', JSON.stringify(req.headers, null, 2));
    }

    // Check if token exists
    if (!token) {
      console.log('❌ [AUTH] No token provided - returning 401');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please log in.'
      });
    }

    try {
      // Verify token
      console.log('🔍 [AUTH] Verifying token...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ [AUTH] Token verified successfully');
      console.log('👤 [AUTH] User ID from token:', decoded.id);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.log('❌ [AUTH] User not found in database');
        return res.status(401).json({
          success: false,
          message: 'User not found. Token invalid.'
        });
      }

      console.log('✅ [AUTH] User authenticated:', req.user.email);
      next();
    } catch (error) {
      console.log('❌ [AUTH] Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Token invalid or expired.'
      });
    }
  } catch (error) {
    console.error('❌ [AUTH] Server error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Generate JWT token
exports.generateToken = (id) => {
  const expiresIn = process.env.JWT_EXPIRE || '30d';
  console.log('🔑 [TOKEN] Generating token with expiration:', expiresIn);
  
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expiresIn
  });
  
  // Decode to check expiration time
  const decoded = jwt.decode(token);
  const expirationDate = new Date(decoded.exp * 1000);
  console.log('⏰ [TOKEN] Token will expire at:', expirationDate.toISOString());
  console.log('⏳ [TOKEN] Time until expiration:', Math.floor((decoded.exp * 1000 - Date.now()) / 1000 / 60), 'minutes');
  
  return token;
};

