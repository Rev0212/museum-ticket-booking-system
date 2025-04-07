import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Chip, 
  Divider,
  Grid,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import { useParams, useHistory } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import { getEventById } from '../utils/api';
import { format } from 'date-fns';

const EventDetailPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const theme = useTheme();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);
  
  const handleRegister = () => {
    history.push(`/events/${id}/register`);
  };
  
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Exhibition':
        return theme.palette.primary.main;
      case 'Workshop':
        return theme.palette.secondary.main;
      case 'Lecture':
        return theme.palette.info.main;
      case 'Performance':
        return theme.palette.warning.main;
      default:
        return theme.palette.primary.main;
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }
  
  if (!event) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">Event not found</Alert>
      </Container>
    );
  }
  
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
  };
  
  const formatTime = (dateString) => {
    return format(new Date(dateString), 'h:mm a');
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ position: 'relative', mb: 4 }}>
        <Box 
          sx={{ 
            position: 'relative',
            height: { xs: 200, sm: 300, md: 400 },
            borderRadius: 2,
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.6))',
              zIndex: 1
            }
          }}
        >
          <Box 
            component="img"
            src={event.imageUrl || 'https://source.unsplash.com/random?museum'}
            alt={event.title}
            sx={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover'
            }}
          />
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              p: { xs: 2, sm: 3 },
              zIndex: 2,
              width: '100%'
            }}
          >
            <Chip
              label={event.category}
              sx={{
                bgcolor: getCategoryColor(event.category),
                color: 'white',
                fontWeight: 'bold',
                mb: 1
              }}
            />
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                color: 'white', 
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              {event.title}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              About This Event
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {event.description}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Event Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 1,
                  fontWeight: 'medium',
                  color: theme.palette.text.primary
                }}
              >
                <CalendarTodayIcon sx={{ mr: 1, color: getCategoryColor(event.category) }} />
                Date
              </Typography>
              <Typography variant="body1" sx={{ ml: 4 }}>
                {formatDate(event.startDate)}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 1,
                  fontWeight: 'medium',
                  color: theme.palette.text.primary
                }}
              >
                <AccessTimeIcon sx={{ mr: 1, color: getCategoryColor(event.category) }} />
                Time
              </Typography>
              <Typography variant="body1" sx={{ ml: 4 }}>
                {formatTime(event.startDate)} - {formatTime(event.endDate)}
              </Typography>
            </Box>
            
            {event.location && (
              <Box sx={{ mb: 3 }}>
                <Typography 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 1,
                    fontWeight: 'medium',
                    color: theme.palette.text.primary
                  }}
                >
                  <LocationOnIcon sx={{ mr: 1, color: getCategoryColor(event.category) }} />
                  Location
                </Typography>
                <Typography variant="body1" sx={{ ml: 4 }}>
                  {event.location.address}<br />
                  {event.location.city}, {event.location.state}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ mb: 3 }}>
              <Typography 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 1,
                  fontWeight: 'medium',
                  color: theme.palette.text.primary
                }}
              >
                <EventIcon sx={{ mr: 1, color: getCategoryColor(event.category) }} />
                Category
              </Typography>
              <Typography variant="body1" sx={{ ml: 4 }}>
                {event.category}
              </Typography>
            </Box>
            
            {event.ticketPrice !== undefined && (
              <Box sx={{ mb: 3 }}>
                <Typography 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 1,
                    fontWeight: 'medium',
                    color: theme.palette.text.primary
                  }}
                >
                  <PeopleIcon sx={{ mr: 1, color: getCategoryColor(event.category) }} />
                  Ticket Price
                </Typography>
                <Typography variant="body1" sx={{ ml: 4 }}>
                  {event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`}
                </Typography>
              </Box>
            )}
            
            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              sx={{ 
                mt: 2, 
                py: 1.5,
                bgcolor: getCategoryColor(event.category),
                '&:hover': {
                  bgcolor: `${getCategoryColor(event.category)}CC`
                }
              }}
              onClick={handleRegister}
            >
              Register Now
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EventDetailPage;