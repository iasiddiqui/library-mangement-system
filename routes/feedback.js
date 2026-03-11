const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Feedback = require('../models/Feedback');

// Submit Feedback
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('feedback').trim().notEmpty().withMessage('Feedback is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, feedback } = req.body;

    const newFeedback = await Feedback.create({
      name,
      email,
      feedback
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback',
      feedback: newFeedback
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ success: false, message: 'Server error submitting feedback' });
  }
});

// Get All Feedback (Admin only)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      feedbacks
    });
  } catch (error) {
    console.error('Get feedbacks error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching feedbacks' });
  }
});

module.exports = router;

