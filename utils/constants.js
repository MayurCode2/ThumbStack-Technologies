// Book status constants
exports.BOOK_STATUS = {
  WANT_TO_READ: 'want-to-read',
  READING: 'reading',
  COMPLETED: 'completed'
};

// Book status display names
exports.BOOK_STATUS_DISPLAY = {
  'want-to-read': 'Want to Read',
  'reading': 'Reading',
  'completed': 'Completed'
};

// Book status emojis
exports.BOOK_STATUS_EMOJI = {
  'want-to-read': '📖',
  'reading': '📘',
  'completed': '✅'
};

// Response messages
exports.MESSAGES = {
  SUCCESS: {
    USER_CREATED: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logged out successfully',
    BOOK_CREATED: 'Book added successfully',
    BOOK_UPDATED: 'Book updated successfully',
    BOOK_DELETED: 'Book deleted successfully'
  },
  ERROR: {
    USER_EXISTS: 'User already exists with this email',
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_NOT_FOUND: 'User not found',
    BOOK_NOT_FOUND: 'Book not found',
    UNAUTHORIZED: 'Not authorized to access this route',
    VALIDATION_ERROR: 'Validation error',
    SERVER_ERROR: 'Internal server error',
    MISSING_FIELDS: 'Please provide all required fields'
  }
};

// Validation rules
exports.VALIDATION = {
  NAME_MAX_LENGTH: 50,
  EMAIL_REGEX: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  PASSWORD_MIN_LENGTH: 6,
  TITLE_MAX_LENGTH: 200,
  AUTHOR_MAX_LENGTH: 100,
  NOTES_MAX_LENGTH: 1000
};

// Pagination defaults
exports.PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

