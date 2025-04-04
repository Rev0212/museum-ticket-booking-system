import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Divider,
  Skeleton,
  Alert
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axios from 'axios';
import { fetchNews } from '../../utils/api';

// Fallback news data


const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true);
        
        // Direct call to NewsAPI (use with caution - API key will be exposed)
        const API_KEY = '77bbfe31c227435bb6989073804040b6';
        const response = await axios.get(
          `https://newsapi.org/v2/everything?q=Modern%20Indian%20Art&language=en&sortBy=publishedAt&apiKey=${API_KEY}`
        );
        
        if (response.data.status === 'ok') {
          // Filter articles with images and limit to 6
          const filteredNews = response.data.articles
            .filter(article => article.urlToImage)
            .slice(0, 6);
            
          setNews(filteredNews);
        } else {
          throw new Error(response.data.message || 'News API error');
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Using fallback news content.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', py: 6 }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ 
            textAlign: 'center', 
            fontWeight: 'bold',
            position: 'relative',
            mb: 5,
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
          Art & Culture News
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {loading ? (
            // Loading skeleton
            Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Skeleton variant="rectangular" height={160} />
                  <CardContent>
                    <Skeleton variant="text" height={28} width="80%" />
                    <Skeleton variant="text" height={20} width="40%" />
                    <Skeleton variant="text" height={20} width="100%" />
                    <Skeleton variant="text" height={20} width="90%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            // Actual news content
            news.map((article, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height={160}
                    image={article.urlToImage || 'https://via.placeholder.com/640x360?text=No+Image+Available'}
                    alt={article.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/640x360?text=Image+Error';
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mb: 1
                      }}
                    >
                      <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      {formatDate(article.publishedAt)}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      gutterBottom
                      sx={{ 
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        height: 54,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {article.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        height: 60,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {article.description}
                    </Typography>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button 
                      size="small" 
                      color="primary" 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      endIcon={<OpenInNewIcon fontSize="small" />}
                    >
                      Read More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            variant="outlined" 
            color="primary"
            size="large"
            href="https://news.google.com/search?q=modern%20indian%20art"
            target="_blank"
            rel="noopener noreferrer"
          >
            More Art News
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NewsSection;