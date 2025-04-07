const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const auth = require('../middleware/Auth');

// Get all news articles
router.get('/', newsController.getAllNews);

// Get featured news
router.get('/featured', newsController.getFeaturedNews);

// Get news by category
router.get('/category/:category', newsController.getNewsByCategory);

// Get news by ID
router.get('/:id', newsController.getNewsById);

// Create new news article (protected admin route)
router.post('/', auth, newsController.createNews);

// Update news article (protected admin route)
router.put('/:id', auth, newsController.updateNews);

// Delete news article (protected admin route)
router.delete('/:id', auth, newsController.deleteNews);

module.exports = router;