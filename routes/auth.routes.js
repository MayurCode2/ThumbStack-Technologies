const express = require('express');
const router = express.Router();
const { signup, login, getCurrentUser, logout } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateSignup, validateLogin } = require('../middleware/validation.middleware');

// Public routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.post('/logout', protect, logout);

module.exports = router;

