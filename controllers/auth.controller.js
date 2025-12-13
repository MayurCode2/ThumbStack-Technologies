const authService = require('../services/auth.service');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    console.log('📝 [SIGNUP] New user registration attempt');
    const { name, email, password } = req.body;
    console.log('📧 [SIGNUP] Email:', email);
    console.log('👤 [SIGNUP] Name:', name);

    // Validate input
    if (!name || !email || !password) {
      console.log('❌ [SIGNUP] Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Call service
    console.log('🔍 [SIGNUP] Creating user account...');
    const result = await authService.registerUser({ name, email, password });
    console.log('✅ [SIGNUP] User created successfully:', email);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    console.error('❌ [SIGNUP] Registration failed:', error.message);
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    console.log('🔑 [LOGIN] Login attempt');
    const { email, password } = req.body;
    console.log('📧 [LOGIN] Email:', email);

    // Validate input
    if (!email || !password) {
      console.log('❌ [LOGIN] Missing credentials');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Call service
    console.log('🔍 [LOGIN] Authenticating user...');
    const result = await authService.loginUser({ email, password });
    console.log('✅ [LOGIN] Login successful for:', email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    console.error('❌ [LOGIN] Login failed:', error.message);
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user._id);

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    // In JWT, logout is typically handled client-side by removing the token
    // This endpoint is mainly for consistency and can be used for logging
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  getCurrentUser,
  logout
};

