const { validationResult } = require('express-validator');
const Museum = require('../models/Museum');
const Event = require('../models/Event');
const fallbackData = require('../utils/fallbackData');

// Get all museums
exports.getAllMuseums = async (req, res) => {
  try {
    let museums = await Museum.find().sort({ name: 1 });
    
    // Use fallback data if no museums found in database
    if (!museums || museums.length === 0) {
      museums = fallbackData.museums;
    }
    
    res.json(museums);
  } catch (err) {
    console.error('Error in getAllMuseums:', err.message);
    res.status(500).send('Server error');
  }
};

// Get museums by state
exports.getMuseumsByState = async (req, res) => {
  try {
    const { state } = req.params;
    const museums = await Museum.find({ 'location.state': state }).sort({ name: 1 });
    res.json(museums);
  } catch (error) {
    console.error('Error fetching museums by state:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get featured museums
exports.getFeaturedMuseums = async (req, res) => {
  try {
    const featuredMuseums = await Museum.find({ featured: true }).limit(6);
    res.json(featuredMuseums);
  } catch (error) {
    console.error('Error fetching featured museums:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get museum by id
exports.getMuseumById = async (req, res) => {
  try {
    const museum = await Museum.findById(req.params.id);
    
    // Use fallback data if museum not found
    if (!museum) {
      const fallbackMuseum = fallbackData.museums.find(m => m._id === req.params.id);
      
      if (fallbackMuseum) {
        return res.json(fallbackMuseum);
      }
      
      return res.status(404).json({ msg: 'Museum not found' });
    }
    
    res.json(museum);
  } catch (err) {
    console.error('Error in getMuseumById:', err.message);
    
    // Try to find in fallback data if there's an ObjectId error
    if (err.kind === 'ObjectId') {
      const fallbackMuseum = fallbackData.museums.find(m => m._id === req.params.id);
      
      if (fallbackMuseum) {
        return res.json(fallbackMuseum);
      }
      
      return res.status(404).json({ msg: 'Museum not found' });
    }
    
    res.status(500).send('Server error');
  }
};

// Create new museum (admin only)
exports.createMuseum = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const newMuseum = new Museum(req.body);
    const museum = await newMuseum.save();
    
    res.status(201).json(museum);
  } catch (err) {
    console.error('Error in createMuseum:', err.message);
    res.status(500).send('Server error');
  }
};

// Update museum (admin only)
exports.updateMuseum = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const museum = await Museum.findById(req.params.id);
    
    if (!museum) {
      return res.status(404).json({ message: 'Museum not found' });
    }
    
    // Update fields
    const updatedMuseum = await Museum.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(updatedMuseum);
  } catch (error) {
    console.error('Error updating museum:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Museum not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete museum (admin only)
exports.deleteMuseum = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const museum = await Museum.findById(req.params.id);
    
    if (!museum) {
      return res.status(404).json({ message: 'Museum not found' });
    }
    
    await museum.remove();
    
    res.json({ message: 'Museum removed' });
  } catch (error) {
    console.error('Error deleting museum:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Museum not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Search museums
exports.searchMuseums = async (req, res) => {
  try {
    const { query, category, state } = req.query;
    let searchQuery = {};

    if (query) {
      searchQuery = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { 'location.city': { $regex: query, $options: 'i' } }
        ]
      };
    }

    if (category) {
      searchQuery.category = category;
    }

    if (state) {
      searchQuery['location.state'] = state;
    }

    const museums = await Museum.find(searchQuery).sort({ name: 1 });
    res.json(museums);
  } catch (error) {
    console.error('Error searching museums:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get news about Indian art and museums
exports.getNews = async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error });
  }
};

// Get upcoming events
exports.getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() } });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming events', error });
  }
};