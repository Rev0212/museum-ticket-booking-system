const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');

// @route    GET api/news
// @desc     Get art and culture news
// @access   Public
router.get('/', async (req, res) => {
  try {
    const API_KEY = config.get('newsApiKey') || '77bbfe31c227435bb6989073804040b6';
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=Modern%20Indian%20Art&language=en&sortBy=publishedAt&apiKey=${API_KEY}`
    );
    
    if (response.data.status === 'ok') {
      // Filter articles with images and limit to 6
      const filteredNews = response.data.articles
        .filter(article => article.urlToImage)
        .slice(0, 6);
        
      res.json(filteredNews);
    } else {
      res.status(500).json({ msg: response.data.message || 'News API error' });
    }
  } catch (err) {
    console.error('News API error:', err.message);
    
    if (err.response && err.response.data) {
      return res.status(err.response.status).json({ 
        msg: err.response.data.message || 'News API error' 
      });
    }
    
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;