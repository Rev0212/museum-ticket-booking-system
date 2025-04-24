import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  Divider, 
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  alpha,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  useTheme,
  Skeleton
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuseumIcon from '@mui/icons-material/Museum';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

// Mock API functions
const getAllStates = async () => {
  return Object.keys(museumsByState);
};

const getAllMuseums = async () => {
  return Object.values(museumsByState).flat();
};

const getMuseumsByState = async (state) => {
  return museumsByState[state] || [];
};

// Sample museums data organized by state
const museumsByState = {
  "Andhra Pradesh": [
    {
      id: 101,
      name: "Salar Jung Museum",
      city: "Hyderabad",
      description: "One of the three National Museums of India, featuring the largest one-man collection of antiques in the world.",
      image: "https://i0.wp.com/weekendyaari.in/wp-content/uploads/2024/11/Salarjung-Museum-hyd.webp?fit=1500%2C1000&ssl=1",
      wikipediaUrl: "https://salarjungmuseum.in/"
    },
    {
      id: 102,
      name: "Archaeological Museum",
      city: "Amaravati",
      description: "Home to ancient Buddhist sculptures and artifacts from the Amaravati Stupa dating back to the 3rd century BCE.",
      image: "https://s7ap1.scene7.com/is/image/incredibleindia/amaravati-archaeological-museum-amaravati-andhra-pradesh-4-attr-hero?qlt=82&ts=1726743670605",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Amaravati_Archaeological_Museum"
    }
  ],
  "Delhi": [
    {
      id: 201,
      name: "National Museum",
      city: "New Delhi",
      description: "Houses over 200,000 artworks spanning 5,000 years of Indian cultural heritage and world civilizations.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/India_national_museum_01.jpg/250px-India_national_museum_01.jpg",
      wikipediaUrl: "https://nationalmuseumindia.gov.in/"
    },
    {
      id: 202,
      name: "National Gallery of Modern Art",
      city: "New Delhi",
      description: "Showcasing the changing art forms in Indian paintings, sculptures and graphics throughout the years.",
      image: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?q=80&w=1200&auto=format&fit=crop",
      wikipediaUrl: "https://en.wikipedia.org/wiki/National_Gallery_of_Modern_Art"
    },
    {
      id: 203,
      name: "Red Fort Archaeological Museum",
      city: "New Delhi",
      description: "Located inside the historic Red Fort, displaying artifacts from the Mughal era.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7_l9GvkWlxR0qejyadBFrL5gMxyxwKpUeCw&s",
      wikipediaUrl: "https://asi.nic.in/pages/WorldHeritageRedFort"
    }
  ],
  "Gujarat": [
    {
      id: 301,
      name: "Calico Museum of Textiles",
      city: "Ahmedabad",
      description: "One of the finest textile museums in the world with an outstanding collection of Indian fabrics.",
      image: "https://calicomuseum.org/wp-content/uploads/2013/10/DSC_8569_web.jpg",
      wikipediaUrl: "https://www.calicomuseum.org/"
    },
    {
      id: 302,
      name: "Lalbhai Dalpatbhai Museum",
      city: "Ahmedabad",
      description: "Houses a collection of paintings, sculptures, and other exhibits with emphasis on Jain art forms.",
      image: "https://ahmedabadtourism.in/images/places-to-visit/headers/lalbhai-dalpatbhai-museum-ahmedabad-tourism-entry-fee-timings-holidays-reviews-header.jpg",
      wikipediaUrl: "https://www.ldmuseum.co.in/"
    }
  ],
  "Karnataka": [
    {
      id: 401,
      name: "Government Museum",
      city: "Bangalore",
      description: "One of the oldest museums in India, featuring archaeological artifacts, paintings, and geological exhibits.",
      image: "https://static.toiimg.com/thumb/62277521/Government-Museum.jpg?width=1200&height=900",
      wikipediaUrl: "https://archaeology.karnataka.gov.in/page/Government+Museums/Government+Museums+Bengaluru/en"
    }
  ],
  "Maharashtra": [
    {
      id: 501,
      name: "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
      city: "Mumbai",
      description: "Formerly known as the Prince of Wales Museum, featuring Indo-Saracenic architectural style and extensive art collections.",
      image: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=1200&auto=format&fit=crop",
      wikipediaUrl: "https://csmvs.in/"
    },
    {
      id: 502,
      name: "Raja Dinkar Kelkar Museum",
      city: "Pune",
      description: "Contains the collection of Dr. Dinkar G. Kelkar, dedicated to everyday arts of the Maratha period.",
      image: "https://img-cdn.thepublive.com/filters:format(webp)/local-samosal/media/media_files/pgZODvPlwDSNcLFDdX9c.png",
      wikipediaUrl: "https://rajakelkarmuseum.org/"
    }
  ],
  "Rajasthan": [
    {
      id: 601,
      name: "Albert Hall Museum",
      city: "Jaipur",
      description: "The oldest museum in Rajasthan, featuring a rich collection of artifacts including paintings, jewelry, carpets, and more.",
      image: "https://s7ap1.scene7.com/is/image/incredibleindia/albert-hall-museum-jaipur-rajasthan-3-attr-hero?qlt=82&ts=1726660086518",
      wikipediaUrl: "https://shop.museumsofindia.org/node/412"
    },
    {
      id: 602,
      name: "City Palace Museum",
      city: "Udaipur",
      description: "Located within the City Palace complex, showcasing royal artifacts, miniature paintings, and traditional Rajasthani arts.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9nz1ahkd47CqDpM4jzQBOA9nMkpLOM-XVyA&s",
      wikipediaUrl: "https://en.wikipedia.org/wiki/City_Palace,_Udaipur"
    }
  ],
  "Tamil Nadu": [
    {
      id: 701,
      name: "Government Museum",
      city: "Chennai",
      description: "Established in 1851, featuring archaeological, numismatic, zoological and botanical collections.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM1f29PqAxFrPTUpr3ibsfoy_eMqJHHOstnQ&s",
      wikipediaUrl: "https://www.chennaimuseum.org/draft/geninfo/geninfo.htm"
    }
  ],
  "West Bengal": [
    {
      id: 801,
      name: "Indian Museum",
      city: "Kolkata",
      description: "Established in 1814, it is the oldest and largest museum in India with rare collections of antiques, armor, ornaments, fossils and mummies.",
      image: "https://www.trawell.in/admin/images/upload/555418834Kolkata_Indian_Museum_Main.jpg",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Indian_Museum,_Kolkata"
    },
    {
      id: 802,
      name: "Victoria Memorial Hall",
      city: "Kolkata",
      description: "A magnificent marble building dedicated to the memory of Queen Victoria, now serving as a museum with rare artifacts.",
      image: "https://upload.wikimedia.org/wikipedia/commons/7/72/Victoria_Memorial_situated_in_Kolkata.jpg",
      wikipediaUrl: "https://victoriamemorial-cal.org/"
    }
  ]
};

const MuseumsPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [filteredStates, setFilteredStates] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [states, setStates] = useState(['all']);
  const [museumsByState, setMuseumsByState] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        setLoading(true);

        // Fetch available states for filtering
        let statesData = await getAllStates();
        if (!statesData || statesData.length === 0) {
          statesData = Object.keys(museumsByState); // Fallback to sample data
        }
        setStates(['all', ...statesData]);

        // Get museums based on selected state
        let museumsData;
        if (selectedState === 'all') {
          museumsData = await getAllMuseums();
          if (!museumsData || museumsData.length === 0) {
            museumsData = Object.values(museumsByState).flat(); // Fallback to sample data
          }
        } else {
          museumsData = await getMuseumsByState(selectedState);
          if (!museumsData || museumsData.length === 0) {
            museumsData = museumsByState[selectedState] || []; // Fallback to sample data
          }
        }

        // Group museums by state for display
        const groupedMuseums = {};
        museumsData.forEach((museum) => {
          const state = museum.location?.state || 'Other';
          if (!groupedMuseums[state]) {
            groupedMuseums[state] = [];
          }
          groupedMuseums[state].push(museum);
        });

        setMuseumsByState(groupedMuseums);
      } catch (error) {
        console.error('Failed to fetch museums:', error);
        setError('Failed to load museums. Using sample data.');
        setMuseumsByState(museumsByState); // Fallback to sample data
      } finally {
        setLoading(false);
      }
    };

    fetchMuseums();
  }, [selectedState]);

  useEffect(() => {
    // Apply search and state filters
    const statesAfterFilter = {};
    
    Object.entries(museumsByState).forEach(([state, museums]) => {
      // Filter by state if not "all"
      if (selectedState !== 'all' && selectedState !== state) {
        return;
      }
      
      // Filter by search term
      const filteredMuseums = museums.filter(museum => 
        museum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        museum.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        museum.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (filteredMuseums.length > 0) {
        statesAfterFilter[state] = filteredMuseums;
      }
    });
    
    setFilteredStates(statesAfterFilter);
  }, [searchTerm, selectedState, museumsByState]);
  
  const handleStateChange = (event, newValue) => {
    setSelectedState(newValue);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleAccordionChange = (state) => (event, isExpanded) => {
    setExpanded({ ...expanded, [state]: isExpanded });
  };

  return (
    <Box 
      sx={{ 
        py: 6,
        background: `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.02)})`,
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: theme.palette.primary.dark,
              position: 'relative',
              display: 'inline-block',
              pb: 2,
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                backgroundColor: theme.palette.primary.main,
                borderRadius: '2px'
              }
            }}
          >
            <MuseumIcon sx={{ mr: 1, fontSize: 40, verticalAlign: 'text-bottom' }} />
            Museums of India
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto', 
              mt: 2,
              fontWeight: 'normal'
            }}
          >
            Explore the cultural heritage and treasures housed in museums across different states of India
          </Typography>
        </Box>
      
        {/* Search and Filters */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            backgroundColor: theme.palette.background.paper
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth
                placeholder="Search museums, cities, or descriptions..."
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography 
                variant="subtitle2" 
                color="text.secondary" 
                sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
              >
                Filter by State:
              </Typography>
              <Box sx={{ 
                maxWidth: '100%', 
                overflowX: 'auto',
                '&::-webkit-scrollbar': {
                  height: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  borderRadius: '10px',
                },
              }}>
                <Tabs
                  value={selectedState}
                  onChange={handleStateChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    '.MuiTabs-indicator': {
                      backgroundColor: theme.palette.primary.main,
                      height: 3,
                    },
                    '.MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      minWidth: 'auto',
                      px: 2,
                      '&.Mui-selected': {
                        color: theme.palette.primary.main,
                      },
                    },
                  }}
                >
                  {states.map((state) => (
                    <Tab 
                      key={state} 
                      label={state === 'all' ? 'All States' : state} 
                      value={state}
                    />
                  ))}
                </Tabs>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      
        {loading ? (
          // Loading skeletons
          Array.from(new Array(3)).map((_, stateIndex) => (
            <Box key={stateIndex} mb={4}>
              <Skeleton variant="text" height={50} width="30%" />
              <Skeleton variant="rectangular" height={1} sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                {Array.from(new Array(2)).map((_, museumIndex) => (
                  <Grid item xs={12} sm={6} md={4} key={museumIndex}>
                    <Card sx={{ height: '100%' }}>
                      <Skeleton variant="rectangular" height={200} />
                      <Box sx={{ p: 2 }}>
                        <Skeleton variant="text" height={28} />
                        <Skeleton variant="text" height={20} width="60%" />
                        <Skeleton variant="text" height={20} width="80%" sx={{ mb: 1 }} />
                        <Skeleton variant="text" height={60} />
                        <Skeleton variant="rectangular" height={36} width={120} sx={{ mt: 2 }} />
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        ) : (
          // Actual content
          Object.entries(filteredStates).length > 0 ? (
            Object.entries(filteredStates).map(([state, museums]) => (
              <Accordion 
                key={state}
                expanded={expanded[state]}
                onChange={handleAccordionChange(state)}
                sx={{ 
                  mb: 3,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  borderRadius: '8px !important',
                  overflow: 'hidden',
                  '&:before': {
                    display: 'none',
                  },
                  boxShadow: expanded[state] 
                    ? `0 8px 16px ${alpha(theme.palette.primary.main, 0.1)}`
                    : `0 2px 8px ${alpha(theme.palette.primary.main, 0.05)}`,
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="primary" />}
                  sx={{ 
                    borderBottom: expanded[state] ? `1px solid ${alpha(theme.palette.primary.main, 0.1)}` : 'none',
                    bgcolor: expanded[state] ? alpha(theme.palette.primary.main, 0.03) : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography 
                      variant="h5" 
                      component="h2"
                      sx={{ 
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {state}
                    </Typography>
                    <Chip 
                      label={`${museums.length} Museum${museums.length !== 1 ? 's' : ''}`}
                      size="small"
                      sx={{ 
                        ml: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3, pt: 4 }}>
                  <Grid container spacing={3}>
                    {museums.map((museum) => (
                      <Grid item xs={12} sm={6} md={4} key={museum.id}>
                        <Card 
                          sx={{ 
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.3s ease',
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                              '& .museum-image': {
                                transform: 'scale(1.05)'
                              }
                            }
                          }}
                        >
                          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                            <CardMedia
                              component="img"
                              height={220}
                              image={museum.image}
                              alt={museum.name}
                              className="museum-image"
                              sx={{ 
                                transition: 'transform 0.5s ease',
                              }}
                            />
                          </Box>
                          <CardContent sx={{ p: 3, flexGrow: 1 }}>
                            <Typography 
                              variant="h6" 
                              component="h3" 
                              gutterBottom
                              sx={{ 
                                fontWeight: 'bold',
                                color: theme.palette.text.primary,
                                fontSize: '1.1rem',
                                lineHeight: 1.3
                              }}
                            >
                              {museum.name}
                            </Typography>
                            <Box 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                mb: 1.5,
                                color: theme.palette.secondary.main
                              }}
                            >
                              <LocationOnIcon sx={{ fontSize: 18, mr: 0.5 }} />
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: 500,
                                }}
                              >
                                {museum.city}, {state}
                              </Typography>
                            </Box>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                lineHeight: 1.6,
                              }}
                            >
                              {museum.description}
                            </Typography>
                          </CardContent>
                          <Divider sx={{ mx: 2 }} />
                          <CardActions sx={{ p: 2, pt: 1.5, pb: 2 }}>
                            <Button 
                              variant="contained"
                              color="primary"
                              endIcon={<OpenInNewIcon />}
                              href={museum.wikipediaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ 
                                textTransform: 'none',
                                borderRadius: 1.5,
                                fontWeight: 600
                              }}
                            >
                              Learn More
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Paper 
              sx={{ 
                py: 5, 
                px: 3, 
                textAlign: 'center',
                borderRadius: 2,
                border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                bgcolor: alpha(theme.palette.background.paper, 0.7)
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No museums match your search criteria
              </Typography>
              <Typography variant="body1">
                Try adjusting your search or filter selections
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                sx={{ mt: 3 }}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedState('all');
                }}
              >
                Reset Filters
              </Button>
            </Paper>
          )
        )}
      </Container>
    </Box>
  );
};

export default MuseumsPage;