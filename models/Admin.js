const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
adminSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Create default admin if it doesn't exist
adminSchema.statics.initDefaultAdmin = async function() {
  const Admin = this;
  try {
    const admin = await Admin.findOne({ username: 'admin' });
    if (!admin) {
      const newAdmin = new Admin({
        username: 'admin',
        password: 'admin123' // Will be hashed by pre-save hook
      });
      await newAdmin.save();
      console.log('Default admin created (username: admin, password: admin123)');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
};

module.exports = mongoose.model('Admin', adminSchema);

