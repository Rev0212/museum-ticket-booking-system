const News = require('../models/News');

// @route   GET api/news
// @desc    Get all news articles
// @access  Public
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ publishedAt: -1 });
    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/news/featured
// @desc    Get featured news
// @access  Public
exports.getFeaturedNews = async (req, res) => {
  try {
    const news = await News.find()
      .sort({ publishedAt: -1 })
      .limit(6);
    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/news/:id
// @desc    Get news by ID
// @access  Public
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ msg: 'News article not found' });
    }
    
    res.json(news);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'News article not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   POST api/news
// @desc    Create a new news article
// @access  Private (admin)
exports.createNews = async (req, res) => {
  try {
    const {
      title,
      content,
      imageUrl,
      source,
      category,
      url
    } = req.body;
    
    // Create new news article
    const newNews = new News({
      title,
      content,
      imageUrl,
      source,
      category,
      url
    });
    
    const news = await newNews.save();
    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   PUT api/news/:id
// @desc    Update news article
// @access  Private (admin)
exports.updateNews = async (req, res) => {
  try {
    const {
      title,
      content,
      imageUrl,
      source,
      category,
      url
    } = req.body;
    
    // Build update object
    const newsFields = {};
    if (title) newsFields.title = title;
    if (content) newsFields.content = content;
    if (imageUrl) newsFields.imageUrl = imageUrl;
    if (source) newsFields.source = source;
    if (category) newsFields.category = category;
    if (url) newsFields.url = url;
    
    let news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ msg: 'News article not found' });
    }
    
    // Update news
    news = await News.findByIdAndUpdate(
      req.params.id,
      { $set: newsFields },
      { new: true }
    );
    
    res.json(news);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'News article not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   DELETE api/news/:id
// @desc    Delete news article
// @access  Private (admin)
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ msg: 'News article not found' });
    }
    
    await News.findByIdAndRemove(req.params.id);
    
    res.json({ msg: 'News article removed' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'News article not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/news/category/:category
// @desc    Get news by category
// @access  Public
exports.getNewsByCategory = async (req, res) => {
  try {
    const news = await News.find({ category: req.params.category })
      .sort({ publishedAt: -1 });
      
    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};