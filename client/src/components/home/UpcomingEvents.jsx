import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  Chip,
  Divider,
  alpha,
  Skeleton,
  useTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import axios from 'axios';

// Sample data for development (replace with actual API call later)
const sampleEvents = [
  {
    id: 1,
    title: 'Classical Dance Performance: Bharatanatyam',
    description: 'Experience the ancient Indian classical dance form Bharatanatyam, featuring renowned dancers performing traditional pieces that tell stories from Indian mythology.',
    date: '2025-04-15T18:30:00',
    time: '6:30 PM - 8:30 PM',
    location: 'National Museum Auditorium, New Delhi',
    category: 'Performance',
    image: 'https://images.unsplash.com/photo-1635321593217-40050ad13c74?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Textile Heritage: Weaving Workshop',
    description: 'Learn traditional Indian weaving techniques in this hands-on workshop led by master craftsmen. Create your own small tapestry while exploring the rich textile heritage of India.',
    date: '2025-04-20T10:00:00',
    time: '10:00 AM - 1:00 PM',
    location: 'Calico Museum of Textiles, Ahmedabad',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Miniature Painting Exhibition: Rajasthani School',
    description: 'A special exhibition showcasing rare miniature paintings from the Rajasthani School, featuring works from the 16th to 19th centuries that depict court scenes, mythology, and everyday life.',
    date: '2025-04-25T09:00:00',
    time: '9:00 AM - 5:00 PM',
    location: 'Salar Jung Museum, Hyderabad',
    category: 'Exhibition',
    image: 'https://images.unsplash.com/photo-1577083288073-40892c0860a4?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'Lecture Series: Ancient Indian Science & Technology',
    description: 'Distinguished scholars present a series of talks on the scientific and technological achievements of ancient India, from mathematics and astronomy to metallurgy and architecture.',
    date: '2025-05-05T17:00:00',
    time: '5:00 PM - 7:00 PM',
    location: 'Indian Museum Conference Hall, Kolkata',
    category: 'Lecture',
    image: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?q=80&w=1200&auto=format&fit=crop'
  }
];

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // In a real application, you would use this API call
        // const response = await axios.get('/api/events/upcoming');
        // setEvents(response.data);
        
        // For development, we'll use the sample data and simulate a delay
        setTimeout(() => {
          setEvents(sampleEvents);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
        setError('Failed to load upcoming events. Please try again later.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

  return (
    <Box 
      sx={{ 
        py: 6, 
        bgcolor: alpha(theme.palette.secondary.main, 0.05),
        backgroundImage: `radial-gradient(${alpha(theme.palette.secondary.main, 0.05)} 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
        }
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ 
              position: 'relative',
              display: 'inline-block',
              fontWeight: 'bold',
              color: theme.palette.text.primary,
              '&::after': {
                content: '""',
                display: 'block',
                width: '80px',
                height: '3px',
                backgroundColor: theme.palette.secondary.main,
                margin: '0.8rem auto 0',
              }
            }}
          >
            <EventIcon sx={{ mr: 1, fontSize: 32, verticalAlign: 'text-bottom', color: theme.palette.secondary.main }} />
            Upcoming Cultural Events
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto',
              mt: 2,
              fontSize: '1.1rem'
            }}
          >
            Immerse yourself in India's rich heritage through our curated events, exhibitions, and workshops
          </Typography>
        </Box>
        
        {error && (
          <Typography 
            color="error" 
            variant="h6" 
            sx={{ textAlign: 'center', my: 4 }}
          >
            {error}
          </Typography>
        )}

        <Grid container spacing={4}>
          {loading ? (
            // Loading skeletons
            Array.from(new Array(4)).map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  height: '100%',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  borderRadius: 2
                }}>
                  <Skeleton 
                    variant="rectangular" 
                    sx={{ 
                      width: { xs: '100%', sm: 200 },
                      height: { xs: 200, sm: 'auto' } 
                    }} 
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <CardContent sx={{ flex: '1 0 auto', p: 3 }}>
                      <Skeleton variant="text" height={32} width="80%" />
                      <Skeleton variant="text" height={24} width="40%" sx={{ mt: 1 }} />
                      <Skeleton variant="text" height={20} width="60%" sx={{ mt: 1 }} />
                      <Skeleton variant="text" height={20} width="50%" sx={{ mt: 1 }} />
                      <Skeleton variant="rectangular" height={60} sx={{ mt: 2 }} />
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Skeleton variant="rectangular" height={36} width={120} />
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            // Actual event cards
            events.map((event) => (
              <Grid item xs={12} md={6} key={event.id}>
                <Card 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    height: '100%',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                      '& .event-image': {
                        transform: 'scale(1.05)'
                      }
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: { xs: '100%', sm: 200 },
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <CardMedia
                      component="img"
                      className="event-image"
                      sx={{ 
                        width: '100%', 
                        height: { xs: 200, sm: '100%' },
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease'
                      }}
                      image={event.image}
                      alt={event.title}
                    />
                    <Chip
                      label={event.category}
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: getCategoryColor(event.category),
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    width: '100%',
                    borderLeft: { xs: 'none', sm: `4px solid ${getCategoryColor(event.category)}` } 
                  }}>
                    <CardContent sx={{ flex: '1 0 auto', p: 3 }}>
                      <Typography 
                        variant="h5" 
                        component="h3" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: { xs: '1.25rem', md: '1.4rem' },
                          color: theme.palette.text.primary,
                          lineHeight: 1.3
                        }}
                      >
                        {event.title}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            color: theme.palette.text.secondary,
                            mb: 0.5,
                            fontSize: '0.95rem'
                          }}
                        >
                          <CalendarTodayIcon sx={{ fontSize: 18, mr: 1, color: getCategoryColor(event.category) }} />
                          {formatDate(event.date)}
                        </Typography>
                        <Typography 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            color: theme.palette.text.secondary,
                            mb: 0.5,
                            fontSize: '0.95rem'
                          }}
                        >
                          <AccessTimeIcon sx={{ fontSize: 18, mr: 1, color: getCategoryColor(event.category) }} />
                          {event.time}
                        </Typography>
                        <Typography 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            color: theme.palette.text.secondary,
                            fontSize: '0.95rem',
                            mb: 1
                          }}
                        >
                          <LocationOnIcon sx={{ fontSize: 18, mr: 1, color: getCategoryColor(event.category) }} />
                          {event.location}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          lineHeight: 1.6,
                          mb: 1.5
                        }}
                      >
                        {event.description}
                      </Typography>
                    </CardContent>
                    <Divider sx={{ mx: 3, opacity: 0.6 }} />
                    <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                      <Button 
                        component={RouterLink}
                        to={`/events/${event.id}`}
                        size="medium"
                        sx={{ 
                          color: getCategoryColor(event.category),
                          '&:hover': {
                            bgcolor: alpha(getCategoryColor(event.category), 0.08)
                          }
                        }}
                      >
                        Learn More
                      </Button>
                      <Button 
                        variant="contained"
                        component={RouterLink}
                        to={`/booking?event=${event.id}`}
                        sx={{ 
                          bgcolor: getCategoryColor(event.category),
                          '&:hover': {
                            bgcolor: alpha(getCategoryColor(event.category), 0.9)
                          }
                        }}
                      >
                        Book Tickets
                      </Button>
                    </CardActions>
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button 
            variant="outlined"
            color="secondary"
            component={RouterLink}
            to="/events"
            size="large"
            sx={{ 
              px: 4,
              py: 1.2,
              borderWidth: 2,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 600,
              '&:hover': {
                borderWidth: 2
              }
            }}
          >
            View All Events
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default UpcomingEvents;