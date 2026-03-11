require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const app = require('../app');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library_management';

// Connect to MongoDB (fire-and-forget; Mongoose buffers ops until connected)
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
}).then(async () => {
  console.log('MongoDB connected (Vercel)');
  try {
    const Admin = require('../models/Admin');
    await Admin.initDefaultAdmin();
  } catch (e) { console.error('Init admin:', e.message); }
  try {
    const Book = require('../models/Book');
    await Book.initDefaultBooks();
    await Book.updateBooksContent();
  } catch (e) { console.error('Init books:', e.message); }
}).catch(err => console.error('MongoDB connection error:', err));

module.exports = app;
