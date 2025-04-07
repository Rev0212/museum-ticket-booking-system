const Museum = require('../models/Museum'); // Make sure to fix the file name typo Museum.js instead of Musem.js
const path = require('path');

// @route   GET api/museums
// @desc    Get all museums
// @access  Public
exports.getAllMuseums = async (req, res) => {
  try {
    const museums = await Museum.find();
    res.json(museums);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/museums/featured
// @desc    Get featured museums
// @access  Public
exports.getFeaturedMuseums = async (req, res) => {
  try {
    const museums = await Museum.find({ featured: true }).limit(7);
    res.json(museums);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/museums/:id
// @desc    Get museum by ID
// @access  Public
exports.getMuseumById = async (req, res) => {
  try {
    const museum = await Museum.findById(req.params.id);
    
    if (!museum) {
      return res.status(404).json({ msg: 'Museum not found' });
    }
    
    res.json(museum);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Museum not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   POST api/museums
// @desc    Create a new museum
// @access  Private (admin)
exports.createMuseum = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      location, 
      ticketPrices,
      openingHours,
      contactInfo,
      featured
    } = req.body;
    
    // Create new museum
    const newMuseum = new Museum({
      name,
      description,
      location,
      ticketPrices,
      openingHours,
      contactInfo,
      featured
    });
    
    // If images were uploaded (implement with multer middleware)
    if (req.files && req.files.length > 0) {
      newMuseum.images = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        caption: file.originalname
      }));
    }
    
    const museum = await newMuseum.save();
    res.json(museum);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   PUT api/museums/:id
// @desc    Update museum
// @access  Private (admin)
exports.updateMuseum = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      location, 
      ticketPrices,
      openingHours,
      contactInfo,
      featured
    } = req.body;
    
    // Build update object
    const museumFields = {};
    if (name) museumFields.name = name;
    if (description) museumFields.description = description;
    if (location) museumFields.location = location;
    if (ticketPrices) museumFields.ticketPrices = ticketPrices;
    if (openingHours) museumFields.openingHours = openingHours;
    if (contactInfo) museumFields.contactInfo = contactInfo;
    if (featured !== undefined) museumFields.featured = featured;
    
    // If new images were uploaded (implement with multer middleware)
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        caption: file.originalname
      }));
      
      // If we want to replace all images
      museumFields.images = newImages;
      
      // Or if we want to add new images to existing ones
      // const museum = await Museum.findById(req.params.id);
      // museumFields.images = [...museum.images, ...newImages];
    }
    
    let museum = await Museum.findById(req.params.id);
    
    if (!museum) {
      return res.status(404).json({ msg: 'Museum not found' });
    }
    
    // Update museum
    museum = await Museum.findByIdAndUpdate(
      req.params.id,
      { $set: museumFields },
      { new: true }
    );
    
    res.json(museum);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Museum not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   DELETE api/museums/:id
// @desc    Delete museum
// @access  Private (admin)
exports.deleteMuseum = async (req, res) => {
  try {
    const museum = await Museum.findById(req.params.id);
    
    if (!museum) {
      return res.status(404).json({ msg: 'Museum not found' });
    }
    
    await Museum.findByIdAndRemove(req.params.id);
    
    res.json({ msg: 'Museum removed' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Museum not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/museums/search
// @desc    Search museums
// @access  Public
exports.searchMuseums = async (req, res) => {
  try {
    const { query, state, city } = req.query;
    
    let searchQuery = {};
    
    // Text search if query parameter is provided
    if (query) {
      searchQuery = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      };
    }
    
    // Filter by state if provided
    if (state && state !== 'all') {
      searchQuery['location.state'] = state;
    }
    
    // Filter by city if provided
    if (city) {
      searchQuery['location.city'] = { $regex: city, $options: 'i' };
    }
    
    const museums = await Museum.find(searchQuery);
    res.json(museums);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/museums/state/:state
// @desc    Get museums by state
// @access  Public
exports.getMuseumsByState = async (req, res) => {
  try {
    const { state } = req.params;
    
    if (!state || state === 'all') {
      const museums = await Museum.find();
      return res.json(museums);
    }
    
    const museums = await Museum.find({
      'location.state': state
    });
    
    res.json(museums);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};