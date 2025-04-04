const { validationResult } = require('express-validator');
const Event = require('../models/Event');
const Museum = require('../models/Museum');
const fallbackData = require('../utils/fallbackData');

/**
 * Get all events
 */
exports.getAllEvents = async (req, res) => {
  try {
    let events = await Event.find().populate('museum', 'name location images');
    
    // Use fallback data if no events found in database
    if (!events || events.length === 0) {
      events = fallbackData.events;
    }
    
    res.json(events);
  } catch (err) {
    console.error('Error in getAllEvents:', err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Get upcoming events
 */
exports.getUpcomingEvents = async (req, res) => {
  try {
    const currentDate = new Date();
    
    let events = await Event.find({
      endDate: { $gte: currentDate }
    })
      .populate('museum', 'name location images')
      .sort({ startDate: 1 });
    
    // Use fallback data if no events found in database
    if (!events || events.length === 0) {
      events = fallbackData.events.filter(event => new Date(event.endDate) >= currentDate);
    }
    
    res.json(events);
  } catch (err) {
    console.error('Error in getUpcomingEvents:', err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Search events
 */
exports.searchEvents = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ msg: 'Search query is required' });
    }
    
    const events = await Event.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    }).populate('museum', 'name location images');
    
    res.json(events);
  } catch (err) {
    console.error('Error in searchEvents:', err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Get events by museum
 */
exports.getEventsByMuseum = async (req, res) => {
  try {
    const events = await Event.find({ museum: req.params.museumId })
      .populate('museum', 'name location images')
      .sort({ startDate: 1 });
    
    res.json(events);
  } catch (err) {
    console.error('Error in getEventsByMuseum:', err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Get event by ID
 */
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('museum', 'name location images operatingHours');
    
    // Use fallback data if event not found
    if (!event) {
      const fallbackEvent = fallbackData.events.find(e => e._id === req.params.id);
      
      if (fallbackEvent) {
        return res.json(fallbackEvent);
      }
      
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.json(event);
  } catch (err) {
    console.error('Error in getEventById:', err.message);
    
    // Try to find in fallback data if there's an ObjectId error
    if (err.kind === 'ObjectId') {
      const fallbackEvent = fallbackData.events.find(e => e._id === req.params.id);
      
      if (fallbackEvent) {
        return res.json(fallbackEvent);
      }
      
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.status(500).send('Server error');
  }
};

/**
 * Create an event
 */
exports.createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newEvent = new Event(req.body);
    const event = await newEvent.save();
    res.status(201).json(event);
  } catch (err) {
    console.error('Error in createEvent:', err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Update an event
 */
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.json(event);
  } catch (err) {
    console.error('Error in updateEvent:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.status(500).send('Server error');
  }
};

/**
 * Delete an event
 */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    await event.remove();
    
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error('Error in deleteEvent:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.status(500).send('Server error');
  }
};