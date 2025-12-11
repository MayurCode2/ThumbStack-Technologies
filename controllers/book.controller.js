const bookService = require('../services/book.service');

// @desc    Get all books for logged in user
// @route   GET /api/books
// @access  Private
const getAllBooks = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      tag: req.query.tag,
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit
    };

    const result = await bookService.getAllUserBooks(req.user._id, filters);

    res.status(200).json({
      success: true,
      count: result.books.length,
      total: result.pagination.total,
      page: result.pagination.page,
      pages: result.pagination.pages,
      data: result.books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Private
const getBookById = async (req, res, next) => {
  try {
    const book = await bookService.getBookById(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res, next) => {
  try {
    const { title, author, tags, status, notes } = req.body;

    // Validate required fields
    if (!title || !author) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and author'
      });
    }

    const book = await bookService.createBook(
      { title, author, tags, status, notes },
      req.user._id
    );

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res, next) => {
  try {
    const { title, author, tags, status, notes } = req.body;

    const book = await bookService.updateBook(
      req.params.id,
      req.user._id,
      { title, author, tags, status, notes }
    );

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res, next) => {
  try {
    await bookService.deleteBook(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/books/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await bookService.getDashboardStatistics(req.user._id);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique tags for the user
// @route   GET /api/books/tags
// @access  Private
const getAllTags = async (req, res, next) => {
  try {
    const tags = await bookService.getUserTags(req.user._id);

    res.status(200).json({
      success: true,
      count: tags.length,
      data: tags
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getDashboardStats,
  getAllTags
};

