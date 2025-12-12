const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  createBook,
  createMultipleBooks,
  updateBook,
  deleteBook,
  getDashboardStats,
  getAllTags
} = require('../controllers/book.controller');
const { protect } = require('../middleware/auth.middleware');
const {
  validateBook,
  validateObjectId,
  validateBookFilters
} = require('../middleware/validation.middleware');

// All routes are protected (require authentication)
router.use(protect);

// Dashboard and stats routes (must be before /:id route)
router.get('/dashboard/stats', getDashboardStats);
router.get('/tags', getAllTags);

// Bulk create route (must be before /:id route)
router.post('/bulk', createMultipleBooks);

// CRUD routes
router.route('/')
  .get(validateBookFilters, getAllBooks)
  .post(validateBook, createBook);

router.route('/:id')
  .get(validateObjectId, getBookById)
  .put(validateObjectId, validateBook, updateBook)
  .delete(validateObjectId, deleteBook);

module.exports = router;

