const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

/**
 * Register a new user
 */
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, phone } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      phone
    });

    // Save user to database
    await user.save();

    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(201).json({ token, user: user.toJSON() });
  } catch (err) {
    console.error('Error in registerUser:', err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Authenticate user & get token
 */
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    res.json({ token, user: user.toJSON() });
  } catch (err) {
    console.error('Error in loginUser:', err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Get authenticated user's profile
 */
exports.getUserProfile = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    res.json(req.user);
  } catch (err) {
    console.error('Error in getUserProfile:', err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Update user profile
 */
exports.updateUserProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, avatar } = req.body;

  try {
    // Create profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (email) profileFields.email = email;
    if (phone) profileFields.phone = phone;
    if (avatar) profileFields.avatar = avatar;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error('Error in updateUserProfile:', err.message);
    res.status(500).send('Server error');
  }
};

// Change password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};