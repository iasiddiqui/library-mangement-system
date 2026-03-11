require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const app = require('../app');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library_management';

const isMissingMongoUri = process.env.VERCEL && (!process.env.MONGODB_URI || MONGODB_URI.includes('localhost'));

// Connect to MongoDB (skip if URI not set on Vercel)
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
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

// Wait for DB before handling API requests (handles cold start); skip wait if URI missing
function waitForDb(ms = 12000) {
  return new Promise((resolve, reject) => {
    if (mongoose.connection.readyState === 1) return resolve();
    const t = setTimeout(() => reject(new Error('Database connection timeout')), ms);
    mongoose.connection.once('connected', () => { clearTimeout(t); resolve(); });
    mongoose.connection.once('error', (err) => { clearTimeout(t); reject(err); });
  });
}

const handler = (req, res) => {
  try {
    const path = (req.url || '').split('?')[0];
    if (!path.startsWith('/api/')) return app(req, res);
    if (isMissingMongoUri) {
      return res.status(503).json({
        success: false,
        message: 'MONGODB_URI not configured. Add it in Vercel Project Settings → Environment Variables.'
      });
    }
    waitForDb()
      .then(() => app(req, res))
      .catch((err) => {
        console.error('DB not ready:', err.message);
        res.status(503).json({
          success: false,
          message: 'Database connecting. Please try again in a few seconds.',
          detail: process.env.VERCEL ? undefined : err.message
        });
      });
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

handler.config = { maxDuration: 30 };
module.exports = handler;
