require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library_management';

// Connect to MongoDB and start server after DB is ready
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

