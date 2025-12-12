/* eslint-disable */
const { BOOK_STATUS } = require('../utils/constants');

/**
 * Validate user registration data
 */
const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  // Name validation
  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.length > 50) {
    errors.push('Name must be less than 50 characters');
  }

  // Email validation
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please provide a valid email');
    }
  }

  // Password validation
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validate user login data
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  }

  if (!password || password.trim().length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validate book creation/update data
 */
const validateBook = (req, res, next) => {
  const { title, author, status, tags } = req.body;
  const errors = [];
  const isUpdate = req.method === 'PUT';

  // Title validation (required for create, optional for update)
  if (!isUpdate && (!title || title.trim().length === 0)) {
    errors.push('Title is required');
  } else if (title && title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  // Author validation (required for create, optional for update)
  if (!isUpdate && (!author || author.trim().length === 0)) {
    errors.push('Author is required');
  } else if (author && author.length > 100) {
    errors.push('Author must be less than 100 characters');
  }

  // Status validation
  if (status) {
    const validStatuses = Object.values(BOOK_STATUS);
    if (!validStatuses.includes(status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }
  }

  // Tags validation
  if (tags && !Array.isArray(tags)) {
    errors.push('Tags must be an array');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validate MongoDB ObjectId
 */
const validateObjectId = (req, res, next) => {
  const id = req.params.id;
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;

  if (!objectIdRegex.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  next();
};

/**
 * Validate query parameters for filtering
 */
const validateBookFilters = (req, res, next) => {
  const { status, page, limit } = req.query;
  const errors = [];

  // Validate status
  if (status) {
    const validStatuses = Object.values(BOOK_STATUS);
    if (!validStatuses.includes(status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }
  }

  // Validate pagination
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    errors.push('Page must be a positive number');
  }

  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    errors.push('Limit must be between 1 and 100');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateBook,
  validateObjectId,
  validateBookFilters
};

