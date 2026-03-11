const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Issue = require('../models/Issue');
const Book = require('../models/Book');

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Admin authentication required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    req.adminId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid admin token' });
  }
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.headers['x-auth-token'];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key');
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Admin: Get all issued books (with student and book details)
router.get('/admin/all', verifyAdminToken, async (req, res) => {
  try {
    const issues = await Issue.find({ status: 'issued' })
      .populate('bookId', 'title category imageUrl author')
      .populate('studentId', 'username email firstName lastName')
      .sort({ issueDate: -1 });
    res.json({ success: true, issues });
  } catch (error) {
    console.error('Admin get issued books error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching issued books' });
  }
});

// Admin: Return book to inventory
router.post('/admin/return/:issueId', verifyAdminToken, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue record not found' });
    }
    if (issue.status === 'returned') {
      return res.status(400).json({ success: false, message: 'Book already returned to inventory' });
    }

    issue.status = 'returned';
    issue.returnDate = new Date();
    await issue.save();

    const book = await Book.findById(issue.bookId);
    if (book) {
      book.isAvailable = true;
      await book.save();
    }

    res.json({ success: true, message: 'Book returned to inventory successfully' });
  } catch (error) {
    console.error('Admin return book error:', error);
    res.status(500).json({ success: false, message: 'Server error returning book' });
  }
});

// Get all issued books for a student
router.get('/', verifyToken, async (req, res) => {
  try {
    const issues = await Issue.find({ studentId: req.userId, status: 'issued' })
      .populate('bookId', 'title category imageUrl author')
      .sort({ issueDate: -1 });
    
    res.json({ success: true, issues });
  } catch (error) {
    console.error('Get issued books error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching issued books' });
  }
});

// Issue a book
router.post('/:bookId', verifyToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (!book.isAvailable) {
      return res.status(400).json({ success: false, message: 'Book is not available' });
    }

    // Check if student already has this book
    const existingIssue = await Issue.findOne({
      studentId: req.userId,
      bookId: req.params.bookId,
      status: 'issued'
    });

    if (existingIssue) {
      return res.status(400).json({ success: false, message: 'You already have this book issued' });
    }

    // Create issue
    const issue = await Issue.create({
      studentId: req.userId,
      bookId: req.params.bookId,
      issueDate: new Date()
    });

    // Mark book as unavailable
    book.isAvailable = false;
    await book.save();

    const populatedIssue = await Issue.findById(issue._id)
      .populate('bookId', 'title category imageUrl author');

    res.json({
      success: true,
      message: 'Book issued successfully',
      issue: populatedIssue
    });
  } catch (error) {
    console.error('Issue book error:', error);
    res.status(500).json({ success: false, message: 'Server error issuing book' });
  }
});

// Return a book
router.post('/return/:issueId', verifyToken, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    if (issue.studentId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (issue.status === 'returned') {
      return res.status(400).json({ success: false, message: 'Book already returned' });
    }

    // Update issue
    issue.status = 'returned';
    issue.returnDate = new Date();
    await issue.save();

    // Mark book as available
    const book = await Book.findById(issue.bookId);
    if (book) {
      book.isAvailable = true;
      await book.save();
    }

    res.json({
      success: true,
      message: 'Book returned successfully'
    });
  } catch (error) {
    console.error('Return book error:', error);
    res.status(500).json({ success: false, message: 'Server error returning book' });
  }
});

module.exports = router;

