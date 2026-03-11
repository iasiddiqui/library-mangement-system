require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const app = require('../app');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library_management';

const isMissingMongoUri = process.env.VERCEL && (!process.env.MONGODB_URI || MONGODB_URI.includes('localhost'));

// Connect to MongoDB - cache promise for serverless
const connectPromise = mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 20000,
  connectTimeoutMS: 20000,
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
}).catch(err => {
  console.error('MongoDB connection error:', err);
  throw err;
});

// Wait for DB before handling API (handles cold start)
async function waitForDb(ms = 25000) {
  if (mongoose.connection.readyState === 1) return;
  await Promise.race([
    connectPromise,
    new Promise((_, rej) => setTimeout(() => rej(new Error('Database connection timeout')), ms))
  ]);
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
          message: 'Database connecting. Please try again in a few seconds. If this persists, check MONGODB_URI in Vercel env vars and MongoDB Atlas Network Access (allow 0.0.0.0/0).',
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
