const Event = require('../models/Event');
const CalendarEvent = require('../models/CalendarEvent');
const { generateQRCode } = require('../utils/qrCodeGenerator');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
                              .sort({ startDate: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get upcoming events
exports.getUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();
    const events = await Event.find({ 
      startDate: { $gte: now } 
    })
    .sort({ startDate: 1 })
    .limit(10);
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get featured events
exports.getFeaturedEvents = async (req, res) => {
  try {
    const now = new Date();
    const events = await Event.find({ 
      featured: true,
      startDate: { $gte: now }
    })
    .sort({ startDate: 1 })
    .limit(6);
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching featured events:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      museum,
      imageUrl,
      startDate,
      endDate,
      location,
      category,
      ticketPrice,
      featured
    } = req.body;
    
    // Create a new event
    const newEvent = new Event({
      title,
      description,
      museum,
      imageUrl,
      startDate,
      endDate,
      location,
      category,
      ticketPrice,
      featured
    });
    
    // Save event
    await newEvent.save();
    
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      museum,
      imageUrl,
      startDate,
      endDate,
      location,
      category,
      ticketPrice,
      featured
    } = req.body;
    
    // Find and update event
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        museum,
        imageUrl,
        startDate,
        endDate,
        location,
        category,
        ticketPrice,
        featured
      },
      { new: true }
    );
    
    if (!updatedEvent) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    await event.remove();
    
    res.json({ msg: 'Event removed' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Create event and add to calendar
exports.createEventWithCalendar = async (req, res) => {
  try {
    const {
      title,
      description,
      museum,
      imageUrl,
      startDate,
      endDate,
      location,
      category,
      ticketPrice,
      featured,
      addToCalendar
    } = req.body;
    
    // Create a new event
    const newEvent = new Event({
      title,
      description,
      museum,
      imageUrl,
      startDate,
      endDate,
      location,
      category,
      ticketPrice,
      featured
    });
    
    // Save event
    await newEvent.save();
    
    // If addToCalendar is true, also create a calendar event
    if (addToCalendar) {
      const calendarEvent = new CalendarEvent({
        title: title,
        start: startDate,
        end: endDate,
        allDay: false,
        location: `${location.address}, ${location.city}, ${location.state}`,
        description: description,
        color: category === 'Exhibition' ? '#1976d2' : 
               category === 'Workshop' ? '#9c27b0' : 
               category === 'Lecture' ? '#0288d1' : 
               '#f57c00', // Performance
        eventId: newEvent._id,
        createdBy: req.user.id,
        public: true
      });
      
      await calendarEvent.save();
    }
    
    res.status(201).json({
      event: newEvent,
      calendarEventCreated: addToCalendar ? true : false
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get events by date range (for calendar)
exports.getEventsByDateRange = async (req, res) => {
  try {
    const { start, end } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({ msg: 'Start and end dates are required' });
    }
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const events = await Event.find({
      $or: [
        { 
          startDate: { $gte: startDate, $lte: endDate } 
        },
        { 
          endDate: { $gte: startDate, $lte: endDate } 
        },
        {
          $and: [
            { startDate: { $lte: startDate } },
            { endDate: { $gte: endDate } }
          ]
        }
      ]
    }).sort({ startDate: 1 });
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching events by date range:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};