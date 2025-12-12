const User = require('../models/User.model');
const { generateToken } = require('../middleware/auth.middleware');

const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('User already exists with this email');
    error.statusCode = 400;
    throw error;
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  // Generate token
  const token = generateToken(user._id);

  return {
    user: user.getPublicProfile(),
    token
  };
};

const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Find user with password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  // Generate token
  const token = generateToken(user._id);

  return {
    user: user.getPublicProfile(),
    token
  };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user.getPublicProfile();
};

const updateUserProfile = async (userId, updateData) => {
  const { name, email } = updateData;

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if email is taken by another user
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email already in use');
      error.statusCode = 400;
      throw error;
    }
  }

  // Update fields
  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  return user.getPublicProfile();
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile
};

