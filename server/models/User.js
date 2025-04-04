const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash the password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to check if password matches
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role }, 
    config.get('jwtSecret'),
    { expiresIn: config.get('jwtExpiration') }
  );
};

// Method to return user data without password
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', UserSchema);