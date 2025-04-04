const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const auth = require('../../middleware/auth');
const { check } = require('express-validator');

// @route   POST /api/users
// @desc    Register a new user
// @access  Public
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], authController.registerUser);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, authController.getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail()
], authController.updateUserProfile);

module.exports = router;