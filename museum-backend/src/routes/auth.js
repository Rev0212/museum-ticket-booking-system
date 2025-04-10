const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/Auth');

// Register user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get user profile (protected route)
router.get('/', auth, authController.getUserProfile);

// Update user profile (protected route)
router.put('/profile', auth, authController.updateProfile);

// Forgot password
router.post('/forgot-password', authController.forgotPassword);

// Reset password
router.post('/reset-password', authController.resetPassword);

module.exports = router;