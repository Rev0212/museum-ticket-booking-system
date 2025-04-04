const express = require('express');
const router = express.Router();
const museumController = require('../../controllers/museumController');
const auth = require('../../middleware/auth');
const { check } = require('express-validator');

// @route   GET /api/museums
// @desc    Get all museums
// @access  Public
router.get('/', museumController.getAllMuseums);

// @route   GET /api/museums/featured
// @desc    Get featured museums
// @access  Public
router.get('/featured', museumController.getFeaturedMuseums);

// @route   GET /api/museums/state/:state
// @desc    Get museums by state
// @access  Public
router.get('/state/:state', museumController.getMuseumsByState);

// @route   GET /api/museums/search
// @desc    Search museums
// @access  Public
router.get('/search', museumController.searchMuseums);

// @route   GET /api/museums/:id
// @desc    Get museum by ID
// @access  Public
router.get('/:id', museumController.getMuseumById);

// @route   POST /api/museums
// @desc    Create a museum
// @access  Private/Admin
router.post('/', [
  auth,
  check('name', 'Name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('location.city', 'City is required').not().isEmpty(),
  check('location.state', 'State is required').not().isEmpty(),
  check('location.address', 'Address is required').not().isEmpty(),
  check('location.coordinates.latitude', 'Latitude is required').isNumeric(),
  check('location.coordinates.longitude', 'Longitude is required').isNumeric(),
  check('ticketPrice.adult', 'Adult ticket price is required').isNumeric(),
  check('ticketPrice.child', 'Child ticket price is required').isNumeric(),
  check('ticketPrice.senior', 'Senior ticket price is required').isNumeric(),
  check('ticketPrice.student', 'Student ticket price is required').isNumeric()
], museumController.createMuseum);

// @route   PUT /api/museums/:id
// @desc    Update a museum
// @access  Private/Admin
router.put('/:id', auth, museumController.updateMuseum);

// @route   DELETE /api/museums/:id
// @desc    Delete a museum
// @access  Private/Admin
router.delete('/:id', auth, museumController.deleteMuseum);

module.exports = router;