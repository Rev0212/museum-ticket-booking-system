import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import MuseumIcon from '@mui/icons-material/Museum';
import EventIcon from '@mui/icons-material/Event';
import ArticleIcon from '@mui/icons-material/Article';

// Stats Card Component
const StatsCard = ({ icon, title, value, subtitle, bgColor, iconColor }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              bgcolor: bgColor,
              p: 1.5,
              borderRadius: 2,
              mr: 2,
              display: 'flex',
            }}
          >
            {React.cloneElement(icon, { sx: { color: iconColor } })}
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    museums: 0,
    bookings: 0,
    news: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // This is a placeholder - integrate with your actual API endpoints
        const token = localStorage.getItem('token');
        
        // Mock data for now - replace with actual API calls when endpoints are ready
        const mockData = {
          stats: {
            users: 120,
            museums: 45,
            bookings: 350,
            news: 28
          },
          recentBookings: [
            { id: '123', museum: 'National Museum', user: 'John Doe', date: '2025-04-10', status: 'confirmed' },
            { id: '124', museum: 'Science Museum', user: 'Jane Smith', date: '2025-04-11', status: 'pending' },
            { id: '125', museum: 'Art Gallery', user: 'Sam Wilson', date: '2025-04-12', status: 'confirmed' },
          ]
        };
        
        // Simulating API delay
        setTimeout(() => {
          setStats(mockData.stats);
          setRecentBookings(mockData.recentBookings);
          setLoading(false);
        }, 800);
        
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, []);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<PeopleIcon fontSize="large" />}
            title="Total Users"
            value={stats.users}
            subtitle="Active accounts"
            bgColor="#EBF8FF"
            iconColor="#3182CE"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<MuseumIcon fontSize="large" />}
            title="Museums"
            value={stats.museums}
            subtitle="Across all states"
            bgColor="#F3E8FF"
            iconColor="#805AD5"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<EventIcon fontSize="large" />}
            title="Bookings"
            value={stats.bookings}
            subtitle="Total reservations"
            bgColor="#E6FFFA"
            iconColor="#38A169"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<ArticleIcon fontSize="large" />}
            title="News Articles"
            value={stats.news}
            subtitle="Published content"
            bgColor="#FEEBCB" 
            iconColor="#DD6B20"
          />
        </Grid>
      </Grid>
      
      {/* Recent Bookings */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recent Bookings
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell>Museum</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <TableRow 
                    key={booking.id}
                    hover
                  >
                    <TableCell>{booking.museum}</TableCell>
                    <TableCell>{booking.user}</TableCell>
                    <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        color={
                          booking.status === 'confirmed' ? 'success' : 
                          booking.status === 'pending' ? 'warning' : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No recent bookings found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;