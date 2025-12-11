const { VALIDATION, BOOK_STATUS } = require('./constants');

// Validate email format
exports.isValidEmail = (email) => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

// Validate password strength
exports.isValidPassword = (password) => {
  return password && password.length >= VALIDATION.PASSWORD_MIN_LENGTH;
};

// Validate book status
exports.isValidBookStatus = (status) => {
  const validStatuses = Object.values(BOOK_STATUS);
  return validStatuses.includes(status);
};

// Sanitize and validate tags
exports.sanitizeTags = (tags) => {
  if (!Array.isArray(tags)) {
    return [];
  }
  
  return tags
    .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
    .map(tag => tag.trim().toLowerCase())
    .filter((tag, index, self) => self.indexOf(tag) === index); // Remove duplicates
};

// Validate pagination parameters
exports.validatePagination = (page, limit) => {
  const validPage = Math.max(1, parseInt(page) || VALIDATION.DEFAULT_PAGE);
  const validLimit = Math.min(
    VALIDATION.MAX_LIMIT,
    Math.max(1, parseInt(limit) || VALIDATION.DEFAULT_LIMIT)
  );
  
  return { page: validPage, limit: validLimit };
};

