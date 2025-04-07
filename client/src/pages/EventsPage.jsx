import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Button, CircularProgress, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { getEvents } from '../utils/api';
import EventsList from '../components/events/EventsList';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Events
        </Typography>
        <Box>
          <Button
            component={RouterLink}
            to="/events/calendar"
            variant="outlined"
            startIcon={<CalendarMonthIcon />}
            sx={{ mr: 2 }}
          >
            Calendar View
          </Button>
          <Button
            component={RouterLink}
            to="/events/create"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Create Event
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <EventsList events={events} />
      )}
    </Container>
  );
};

export default EventsPage;