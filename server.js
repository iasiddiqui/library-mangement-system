const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// Serve images from root directory
app.use('/images', express.static(__dirname));

// API Routes (registered before DB connect - Mongoose buffers operations until connected)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/books', require('./routes/books'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/issues', require('./routes/issues'));

// Serve static HTML files
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // Serve HTML files from public directory
  const filePath = path.join(__dirname, 'public', req.path === '/' ? 'index.html' : req.path);
  res.sendFile(filePath, (err) => {
    if (err) {
      // If file not found, serve index.html (for SPA fallback)
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
  });
});

const PORT = process.env.PORT || 3000;

// Connect to MongoDB and only start server after DB is ready with books initialized
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library_management';
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000
})
  .then(async () => {
    console.log('MongoDB connected successfully');
    // Initialize default admin and books before accepting requests
    try {
      const Admin = require('./models/Admin');
      await Admin.initDefaultAdmin();
    } catch (error) {
      console.error('Error initializing admin:', error);
    }
    try {
      const Book = require('./models/Book');
      await Book.initDefaultBooks();
      await Book.updateBooksContent();
    } catch (error) {
      console.error('Error initializing books:', error);
    }
    // Start server only after DB is ready
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Make sure your .env MONGODB_URI is correct and your IP is whitelisted in Atlas.');
    process.exit(1);
  });

