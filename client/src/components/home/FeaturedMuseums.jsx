import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Button, 
  MobileStepper,
  useTheme,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Grid
} from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { Link as RouterLink } from 'react-router-dom';

// Auto play wrapper for SwipeableViews
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

// Indian Museums data
const featuredMuseums = [
  {
    id: 1,
    name: 'National Museum',
    location: 'New Delhi, India',
    description: 'Houses over 200,000 artworks spanning 5,000 years of Indian cultural heritage and world civilizations.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/India_national_museum_01.jpg/250px-India_national_museum_01.jpg'
  },
  {
    id: 2,
    name: 'Indian Museum',
    location: 'Kolkata, India',
    description: 'Established in 1814, it is the oldest and largest museum in India with rare collections of antiques, armor, ornaments, fossils and mummies.',
    image: 'https://www.trawell.in/admin/images/upload/555418834Kolkata_Indian_Museum_Main.jpg',
  },
  {
    id: 3,
    name: 'Salar Jung Museum',
    location: 'Hyderabad, India',
    description: 'One of the three National Museums of India, housing the largest one-man collection of antiques in the world.',
    image: 'https://i0.wp.com/weekendyaari.in/wp-content/uploads/2024/11/Salarjung-Museum-hyd.webp?fit=1500%2C1000&ssl=1'
  },
  {
    id: 4,
    name: 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya',
    location: 'Mumbai, India',
    description: 'Formerly known as the Prince of Wales Museum, featuring Indo-Saracenic architectural style and extensive art collections.',
    image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 5,
    name: 'National Gallery of Modern Art',
    location: 'New Delhi, India',
    description: 'Showcasing the changing art forms in Indian paintings, sculptures and graphics throughout the years.',
    image: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 6,
    name: 'Victoria Memorial Hall',
    location: 'Kolkata, India',
    description: 'A magnificent marble building dedicated to the memory of Queen Victoria, now serving as a museum with rare artifacts.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZeIEx5VaLJu0eHEilcRw15LKjYnrKsmI2Iw&s'
  },
  {
    id: 7,
    name: 'Calico Museum of Textiles',
    location: 'Ahmedabad, India',
    description: 'One of the finest textile museums in the world with an outstanding collection of Indian fabrics and historical textiles.',
    image: 'https://calicomuseum.org/wp-content/uploads/2013/10/DSC_8569_web.jpg'
  }
];

const FeaturedMuseums = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = featuredMuseums.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  useEffect(() => {
    // You can fetch featured museums data from API here
    // For now, we're using the static data defined above
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom
        sx={{ 
          textAlign: 'center', 
          fontWeight: 'bold',
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: '50%',
            width: 60,
            height: 4,
            bgcolor: 'primary.main',
            transform: 'translateX(-50%)'
          }
        }}
      >
        Featured Indian Museums
      </Typography>
      
      <Typography 
        variant="subtitle1" 
        color="text.secondary" 
        sx={{ textAlign: 'center', mb: 4, mt: 2 }}
      >
        Discover India's rich cultural heritage through its magnificent museums
      </Typography>

      <Paper 
        elevation={3}
        sx={{ 
          position: 'relative',
          mt: 4, 
          mb: 4,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <AutoPlaySwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
          interval={6000}
        >
          {featuredMuseums.map((museum, index) => (
            <div key={museum.id}>
              {Math.abs(activeStep - index) <= 2 ? (
                <Box sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    sx={{
                      height: { xs: 280, sm: 400, md: 500 },
                      display: 'block',
                      overflow: 'hidden',
                      width: '100%',
                      objectFit: 'cover',
                    }}
                    src={museum.image}
                    alt={museum.name}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      bgcolor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      px: 4,
                      py: 3,
                    }}
                  >
                    <Typography variant="h5" component="h3" gutterBottom>
                      {museum.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="subtitle1">
                        {museum.location}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2,
                        display: { xs: 'none', sm: 'block' }
                      }}
                    >
                      {museum.description}
                    </Typography>
                    <Button 
                      variant="contained" 
                      component={RouterLink}
                      to={`/museums/${museum.id}`}
                      sx={{ 
                        mt: { xs: 1, sm: 2 },
                        bgcolor: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        }
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </Box>
              ) : null}
            </div>
          ))}
        </AutoPlaySwipeableViews>
        
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{ 
            bgcolor: 'background.paper',
            '& .MuiMobileStepper-dot': {
              width: 10,
              height: 10,
              mx: 0.5
            },
            '& .MuiMobileStepper-dotActive': {
              bgcolor: 'primary.main',
            }
          }}
          nextButton={
            <IconButton 
              size="large" 
              onClick={handleNext}
              aria-label="next museum"
              sx={{ 
                bgcolor: 'rgba(0, 0, 0, 0.05)',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.1)' },
                mr: 1
              }}
            >
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
          }
          backButton={
            <IconButton 
              size="large" 
              onClick={handleBack}
              aria-label="previous museum"
              sx={{ 
                bgcolor: 'rgba(0, 0, 0, 0.05)',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.1)' },
                ml: 1
              }}
            >
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
          }
        />
      </Paper>

      {/* Additional Museum Cards */}
      <Typography variant="h6" gutterBottom sx={{ mt: 6, mb: 3 }}>
        Popular Museums in India
      </Typography>
      
      <Grid container spacing={3}>
        {featuredMuseums.slice(0, 3).map((museum) => (
          <Grid item xs={12} sm={6} md={4} key={museum.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 8
                }
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={museum.image}
                alt={museum.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h3">
                  {museum.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 16 }} />
                  <Typography variant="body2" color="text.secondary">
                    {museum.location}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {museum.description.substring(0, 100)}...
                </Typography>
                <Button 
                  size="small" 
                  component={RouterLink}
                  to={`/museums/${museum.id}`}
                  sx={{ mt: 'auto' }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button 
          variant="outlined" 
          component={RouterLink}
          to="/museums"
          size="large"
        >
          View All Museums
        </Button>
      </Box>
    </Container>
  );
};

export default FeaturedMuseums;