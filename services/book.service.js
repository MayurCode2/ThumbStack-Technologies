/* eslint-disable */
const Book = require('../models/Book.model');
const { PAGINATION } = require('../utils/constants');

const getAllUserBooks = async (userId, filters = {}) => {
  const { status, tag, search, page = 1, limit = 10 } = filters;

  // Build query
  const query = { user: userId };

  // Filter by status
  if (status && ['want-to-read', 'reading', 'completed'].includes(status)) {
    query.status = status;
  }


  // Filter by tag (case-insensitive)
  if (tag) {
    query.tags = { $in: [tag.toLowerCase().trim()] };
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

const createMultipleBooks = async (booksData, userId) => {
  const booksToCreate = booksData.map(bookData => ({
    title: bookData.title,
    author: bookData.author,
    tags: Array.isArray(bookData.tags) 
      ? bookData.tags.filter(tag => tag && typeof tag === 'string' && tag.trim().length > 0)
                      .map(tag => tag.toLowerCase().trim())
      : [],
    status: bookData.status || 'want-to-read',
    notes: bookData.notes || '',
    user: userId
  }));

  const createdBooks = await Book.insertMany(booksToCreate);
  return createdBooks;
};

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
  createMultipleBooks,
  updateBook,
  deleteBook,
  getDashboardStatistics,
  getUserTags,
  getBookCountsByStatus
};

