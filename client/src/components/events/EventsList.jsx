import React, { useState } from 'react';
import { 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Box, 
  Chip, 
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  alpha,
  useTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const EventsList = ({ events }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Filter events based on search term and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter ? event.category === categoryFilter : true;
    
    return matchesSearch && matchesCategory;
  });
  
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
  
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="category-filter-label">Filter by Category</InputLabel>
          <Select
            labelId="category-filter-label"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            label="Filter by Category"
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="Exhibition">Exhibition</MenuItem>
            <MenuItem value="Workshop">Workshop</MenuItem>
            <MenuItem value="Lecture">Lecture</MenuItem>
            <MenuItem value="Performance">Performance</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {filteredEvents.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', my: 4 }}>
          No events found matching your criteria.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {filteredEvents.map((event) => (
            <Grid item xs={12} md={6} key={event._id || event.id}>
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
                    image={event.imageUrl || 'https://source.unsplash.com/random?museum'}
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
                        {formatDate(event.startDate)}
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
                        {formatTime(event.startDate)} - {formatTime(event.endDate)}
                      </Typography>
                      {event.location && (
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
                          {`${event.location.address}, ${event.location.city}`}
                        </Typography>
                      )}
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        lineHeight: 1.6,
                        mb: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {event.description}
                    </Typography>
                  </CardContent>
                  <Divider sx={{ mx: 3, opacity: 0.6 }} />
                  <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                    <Button 
                      component={RouterLink}
                      to={`/events/${event._id || event.id}`}
                      size="medium"
                      sx={{ 
                        color: getCategoryColor(event.category),
                        '&:hover': {
                          bgcolor: alpha(getCategoryColor(event.category), 0.08)
                        }
                      }}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="contained"
                      component={RouterLink}
                      to={`/events/${event._id || event.id}/register`}
                      sx={{ 
                        bgcolor: getCategoryColor(event.category),
                        '&:hover': {
                          bgcolor: alpha(getCategoryColor(event.category), 0.9)
                        }
                      }}
                    >
                      Register
                    </Button>
                  </CardActions>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default EventsList;