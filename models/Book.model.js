const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true,
    maxlength: [100, 'Author name cannot be more than 100 characters']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: {
      values: ['want-to-read', 'reading', 'completed'],
      message: 'Status must be: want-to-read, reading, or completed'
    },
    default: 'want-to-read'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for better query performance
bookSchema.index({ user: 1, status: 1 });
bookSchema.index({ user: 1, tags: 1 });
bookSchema.index({ user: 1, createdAt: -1 });
bookSchema.index({ user: 1, author: 1 });

// Virtual field for status display
bookSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'want-to-read': 'Want to Read',
    'reading': 'Reading',
    'completed': 'Completed'
  };
  return statusMap[this.status];
});

// Virtual field for status emoji
bookSchema.virtual('statusEmoji').get(function() {
  const emojiMap = {
    'want-to-read': '📖',
    'reading': '📘',
    'completed': '✅'
  };
  return emojiMap[this.status];
});

// Pre-save middleware to sanitize tags
bookSchema.pre('save', function(next) {
  if (this.isModified('tags')) {
    // Remove duplicates and empty strings
    this.tags = [...new Set(this.tags.filter(tag => tag && tag.trim().length > 0))];
  }
  next();
});

// Method to format book for JSON response
bookSchema.methods.toJSON = function() {
  const book = this.toObject();
  
  // Remove version key
  delete book.__v;
  
  return book;
};

// Instance method to check if book is completed
bookSchema.methods.isCompleted = function() {
  return this.status === 'completed';
};

// Instance method to update status
bookSchema.methods.updateStatus = async function(newStatus) {
  this.status = newStatus;
  return await this.save();
};

// Static method to find books by status
bookSchema.statics.findByStatus = function(userId, status) {
  return this.find({ user: userId, status });
};

// Static method to find books by tag
bookSchema.statics.findByTag = function(userId, tag) {
  return this.find({ user: userId, tags: tag });
};

// Static method to find books by author
bookSchema.statics.findByAuthor = function(userId, author) {
  return this.find({ 
    user: userId, 
    author: { $regex: author, $options: 'i' } 
  });
};

// Static method to get book count by status
bookSchema.statics.getStatusCount = async function(userId, status) {
  return await this.countDocuments({ user: userId, status });
};

module.exports = mongoose.model('Book', bookSchema);

