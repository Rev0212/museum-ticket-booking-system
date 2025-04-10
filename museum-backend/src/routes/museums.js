const express = require('express');
const router = express.Router();
const museumController = require('../controllers/museumController');
const auth = require('../middleware/Auth');
const upload = require('../middleware/upload');

// Get all museums
router.get('/', museumController.getAllMuseums);

// Get featured museums
router.get('/featured', museumController.getFeaturedMuseums);

// Search museums
router.get('/search', museumController.searchMuseums);

// Get museums by state
router.get('/state/:state', museumController.getMuseumsByState);

// Get museum by ID
router.get('/:id', museumController.getMuseumById);

// Create new museum with image upload (protected admin route)
router.post('/', auth, upload.array('images', 5), museumController.createMuseum);

// Update museum with image upload (protected admin route)
router.put('/:id', auth, upload.array('images', 5), museumController.updateMuseum);

// Delete museum (protected admin route)
router.delete('/:id', auth, museumController.deleteMuseum);

module.exports = router;