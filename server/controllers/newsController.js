const News = require('../models/News');

// Fetch news about Indian art and museums
exports.getNews = async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 });
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news', error });
    }
};

// Create a new news entry (for admin use)
exports.createNews = async (req, res) => {
    const { title, content, imageUrl } = req.body;

    try {
        const newNews = new News({ title, content, imageUrl });
        await newNews.save();
        res.status(201).json(newNews);
    } catch (error) {
        res.status(500).json({ message: 'Error creating news', error });
    }
};