import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  CircularProgress, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  getAllCalendarEvents, 
  getEventsByDateRange, 
  importEventsToCalendar 
} from '../../utils/api';
import { useHistory } from 'react-router-dom';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const EventCalendar = () => {
  const history = useHistory();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const calendarEvents = await getAllCalendarEvents();
      
      // Format events for the calendar
      const formattedEvents = calendarEvents.map(event => ({
        id: event._id,
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
        allDay: event.allDay,
        resource: {
          description: event.description,
          location: event.location,
          color: event.color,
          eventId: event.eventId,
          public: event.public
        }
      }));
      
      setEvents(formattedEvents);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setError('Failed to load calendar events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setOpenEventDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenEventDialog(false);
  };
  
  const handleViewEventDetails = () => {
    if (selectedEvent && selectedEvent.resource.eventId) {
      history.push(`/events/${selectedEvent.resource.eventId}`);
    }
    handleCloseDialog();
  };
  
  const handleRegisterForEvent = () => {
    if (selectedEvent && selectedEvent.resource.eventId) {
      history.push(`/events/${selectedEvent.resource.eventId}/register`);
    }
    handleCloseDialog();
  };
  
  const handleRangeChange = async (range) => {
    // Only fetch on month view to avoid excessive API calls
    if (range.length === 0 && range.start && range.end) {
      try {
        setLoading(true);
        const eventsInRange = await getEventsByDateRange(
          range.start.toISOString(),
          range.end.toISOString()
        );
        
        // Format events for the calendar
        const formattedEvents = eventsInRange.map(event => ({
          id: event._id,
          title: event.title,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          allDay: false,
          resource: {
            description: event.description,
            location: event.location 
              ? `${event.location.address}, ${event.location.city}, ${event.location.state}` 
              : '',
            color: getEventColor(event.category),
            eventId: event._id,
            public: true
          }
        }));
        
        // Merge with existing events, avoiding duplicates
        setEvents(prev => {
          const existingIds = new Set(formattedEvents.map(e => e.id));
          const filteredPrev = prev.filter(e => !existingIds.has(e.id));
          return [...filteredPrev, ...formattedEvents];
        });
      } catch (err) {
        console.error('Error fetching events for date range:', err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const getEventColor = (category) => {
    switch (category) {
      case 'Exhibition':
        return '#1976d2';
      case 'Workshop':
        return '#9c27b0';
      case 'Lecture':
        return '#0288d1';
      case 'Performance':
        return '#f57c00';
      default:
        return '#1976d2';
    }
  };
  
  const handleImportEvents = async () => {
    try {
      setImportLoading(true);
      await importEventsToCalendar();
      setImportSuccess(true);
      fetchEvents(); // Refresh calendar
    } catch (err) {
      console.error('Error importing events:', err);
      setError('Failed to import events. Please try again.');
    } finally {
      setImportLoading(false);
    }
  };
  
  const eventStyleGetter = (event) => {
    const backgroundColor = event.resource?.color || '#1976d2';
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        color: '#fff',
        border: 'none',
        display: 'block'
      }
    };
  };
  
  if (loading && events.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Event Calendar
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleImportEvents}
            disabled={importLoading}
          >
            {importLoading ? <CircularProgress size={24} /> : 'Import Museum Events'}
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {importSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Events successfully imported to calendar!
          </Alert>
        )}
        
        <Box sx={{ height: 700 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onSelectEvent={handleEventSelect}
            eventPropGetter={eventStyleGetter}
            onRangeChange={handleRangeChange}
          />
        </Box>
      </Paper>
      
      {/* Event Details Dialog */}
      <Dialog open={openEventDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedEvent && (
          <>
            <DialogTitle>{selectedEvent.title}</DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Date:</strong> {format(selectedEvent.start, 'MMMM d, yyyy')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Time:</strong> {format(selectedEvent.start, 'h:mm a')} - {format(selectedEvent.end, 'h:mm a')}
              </Typography>
              {selectedEvent.resource?.location && (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Location:</strong> {selectedEvent.resource.location}
                </Typography>
              )}
              {selectedEvent.resource?.description && (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Description:</strong> {selectedEvent.resource.description}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              {selectedEvent.resource?.eventId && (
                <>
                  <Button onClick={handleViewEventDetails} color="primary">
                    View Details
                  </Button>
                  <Button onClick={handleRegisterForEvent} color="primary" variant="contained">
                    Register
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default EventCalendar;