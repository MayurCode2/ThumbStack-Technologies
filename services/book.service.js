const Book = require('../models/Book.model');
const { PAGINATION } = require('../utils/constants');

/**
 * Get all books for a user with filters and pagination
 * @param {String} userId - User ID
 * @param {Object} filters - Query filters
 * @returns {Promise<Object>} Books data with pagination
 */
const getAllUserBooks = async (userId, filters = {}) => {
  const { status, tag, search, page = 1, limit = 10 } = filters;

  // Build query
  const query = { user: userId };

  // Filter by status
  if (status && ['want-to-read', 'reading', 'completed'].includes(status)) {
    query.status = status;
  }

  // Filter by tag
  if (tag) {
    query.tags = { $in: [tag] };
  }

  // Search in title or author
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const validPage = Math.max(1, parseInt(page));
  const validLimit = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, parseInt(limit)));
  const skip = (validPage - 1) * validLimit;

  // Execute queries
  const [books, total] = await Promise.all([
    Book.find(query)
      .sort({ createdAt: -1 })
      .limit(validLimit)
      .skip(skip),
    Book.countDocuments(query)
  ]);

  return {
    books,
    pagination: {
      total,
      page: validPage,
      limit: validLimit,
      pages: Math.ceil(total / validLimit)
    }
  };
};

/**
 * Get a single book by ID
 * @param {String} bookId - Book ID
 * @param {String} userId - User ID
 * @returns {Promise<Object>} Book data
 */
const getBookById = async (bookId, userId) => {
  const book = await Book.findOne({
    _id: bookId,
    user: userId
  });

  if (!book) {
    const error = new Error('Book not found');
    error.statusCode = 404;
    throw error;
  }

  return book;
};

/**
 * Create a new book
 * @param {Object} bookData - Book data
 * @param {String} userId - User ID
 * @returns {Promise<Object>} Created book
 */
const createBook = async (bookData, userId) => {
  const { title, author, tags, status, notes } = bookData;

  const book = await Book.create({
    title,
    author,
    tags: tags || [],
    status: status || 'want-to-read',
    notes: notes || '',
    user: userId
  });

  return book;
};

/**
 * Update a book
 * @param {String} bookId - Book ID
 * @param {String} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated book
 */
const updateBook = async (bookId, userId, updateData) => {
  const book = await Book.findOne({
    _id: bookId,
    user: userId
  });

  if (!book) {
    const error = new Error('Book not found');
    error.statusCode = 404;
    throw error;
  }

  // Update fields
  const { title, author, tags, status, notes } = updateData;
  
  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (tags !== undefined) book.tags = tags;
  if (status !== undefined) book.status = status;
  if (notes !== undefined) book.notes = notes;

  await book.save();

  return book;
};

/**
 * Delete a book
 * @param {String} bookId - Book ID
 * @param {String} userId - User ID
 * @returns {Promise<void>}
 */
const deleteBook = async (bookId, userId) => {
  const book = await Book.findOne({
    _id: bookId,
    user: userId
  });

  if (!book) {
    const error = new Error('Book not found');
    error.statusCode = 404;
    throw error;
  }

  await book.deleteOne();
};

/**
 * Get dashboard statistics for a user
 * @param {String} userId - User ID
 * @returns {Promise<Object>} Dashboard statistics
 */
const getDashboardStatistics = async (userId) => {
  // Run all queries in parallel for better performance
  const [
    totalBooks,
    wantToRead,
    reading,
    completed,
    tagStats,
    recentBooks,
    topAuthors
  ] = await Promise.all([
    // Total books count
    Book.countDocuments({ user: userId }),
    
    // Books by status
    Book.countDocuments({ user: userId, status: 'want-to-read' }),
    Book.countDocuments({ user: userId, status: 'reading' }),
    Book.countDocuments({ user: userId, status: 'completed' }),
    
    // Tag statistics
    Book.aggregate([
      { $match: { user: userId } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),
    
    // Recent books
    Book.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title author status createdAt'),
    
    // Top authors
    Book.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$author', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])
  ]);

  return {
    totalBooks,
    statusCounts: {
      wantToRead,
      reading,
      completed
    },
    tags: tagStats.map(tag => ({
      name: tag._id,
      count: tag.count
    })),
    recentBooks,
    topAuthors: topAuthors.map(author => ({
      name: author._id,
      count: author.count
    }))
  };
};

/**
 * Get all unique tags for a user
 * @param {String} userId - User ID
 * @returns {Promise<Array>} List of tags with counts
 */
const getUserTags = async (userId) => {
  const tags = await Book.aggregate([
    { $match: { user: userId } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  return tags.map(tag => ({
    name: tag._id,
    count: tag.count
  }));
};

/**
 * Get books count by status for a user
 * @param {String} userId - User ID
 * @returns {Promise<Object>} Status counts
 */
const getBookCountsByStatus = async (userId) => {
  const [wantToRead, reading, completed] = await Promise.all([
    Book.countDocuments({ user: userId, status: 'want-to-read' }),
    Book.countDocuments({ user: userId, status: 'reading' }),
    Book.countDocuments({ user: userId, status: 'completed' })
  ]);

  return {
    wantToRead,
    reading,
    completed,
    total: wantToRead + reading + completed
  };
};

module.exports = {
  getAllUserBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getDashboardStatistics,
  getUserTags,
  getBookCountsByStatus
};

