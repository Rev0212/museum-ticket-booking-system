const CalendarEvent = require('../models/CalendarEvent');
const Event = require('../models/Event');

// Get all calendar events
exports.getAllCalendarEvents = async (req, res) => {
  try {
    const calendarEvents = await CalendarEvent.find({
      $or: [
        { createdBy: req.user.id },
        { public: true }
      ]
    }).sort({ start: 1 });
    
    res.json(calendarEvents);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get calendar events by month
exports.getCalendarEventsByMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    
    if (!year || !month) {
      return res.status(400).json({ msg: 'Year and month are required' });
    }
    
    // Create date range for the given month
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0); // Last day of month
    
    const calendarEvents = await CalendarEvent.find({
      $or: [
        { createdBy: req.user.id },
        { public: true }
      ],
      $and: [
        {
          $or: [
            { 
              start: { $gte: startDate, $lte: endDate } 
            },
            { 
              end: { $gte: startDate, $lte: endDate } 
            },
            {
              $and: [
                { start: { $lte: startDate } },
                { end: { $gte: endDate } }
              ]
            }
          ]
        }
      ]
    }).sort({ start: 1 });
    
    res.json(calendarEvents);
  } catch (error) {
    console.error('Error fetching calendar events by month:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Create a personal calendar event
exports.createCalendarEvent = async (req, res) => {
  try {
    const {
      title,
      start,
      end,
      allDay,
      location,
      description,
      color,
      url,
      public,
      recurrence
    } = req.body;
    
    // Create a new calendar event
    const newCalendarEvent = new CalendarEvent({
      title,
      start,
      end,
      allDay,
      location,
      description,
      color,
      url,
      createdBy: req.user.id,
      public,
      recurrence: recurrence || { frequency: 'none', interval: 1 }
    });
    
    // Save calendar event
    await newCalendarEvent.save();
    
    res.status(201).json(newCalendarEvent);
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Import all museum events to calendar
exports.importAllEventsToCalendar = async (req, res) => {
  try {
    // Get all events
    const events = await Event.find();
    
    // Convert each event to a calendar event
    const calendarEvents = [];
    
    for (const event of events) {
      // Check if calendar event for this event already exists
      const existingCalendarEvent = await CalendarEvent.findOne({ eventId: event._id });
      
      if (!existingCalendarEvent) {
        const calendarEvent = new CalendarEvent({
          title: event.title,
          start: event.startDate,
          end: event.endDate,
          allDay: false,
          location: event.location ? `${event.location.address}, ${event.location.city}, ${event.location.state}` : '',
          description: event.description,
          color: event.category === 'Exhibition' ? '#1976d2' : 
                 event.category === 'Workshop' ? '#9c27b0' : 
                 event.category === 'Lecture' ? '#0288d1' : 
                 '#f57c00', // Performance
          eventId: event._id,
          createdBy: req.user.id,
          public: true
        });
        
        await calendarEvent.save();
        calendarEvents.push(calendarEvent);
      }
    }
    
    res.json({
      message: `Successfully imported ${calendarEvents.length} events to calendar`,
      importedEvents: calendarEvents.length
    });
  } catch (error) {
    console.error('Error importing events to calendar:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};