import React, { useState, useEffect, useContext } from 'react';
import { BookingContext } from '../context/BookingContext';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  Button,
  CircularProgress,
  Avatar,
  Divider,
  TextField,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { fetchUserBookings, downloadTicketPDF } from '../utils/api';

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  marginBottom: theme.spacing(2)
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Dashboard = () => {
  const { user } = useContext(BookingContext);
  const history = useHistory();
  const [value, setValue] = useState(0);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (!user) {
      setLoading(false); // Stop loading if no user
      return;
    }
    
    setUserData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || ''
    });

    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Call fetchUserBookings without passing user.id
        const bookings = await fetchUserBookings();
        
        if (!bookings || bookings.length === 0) {
          setAllBookings([]);
          setUpcomingBookings([]);
          return;
        }
        
        // Store all bookings
        setAllBookings(bookings);
        
        // Filter for upcoming bookings
        const today = new Date();
        const upcoming = bookings.filter(booking => {
          const bookingDate = new Date(booking.visitDate || booking.date);
          return bookingDate >= today;
        });
        
        // Sort by date (nearest first)
        upcoming.sort((a, b) => new Date(a.visitDate || a.date) - new Date(b.visitDate || b.date));
        setUpcomingBookings(upcoming);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the user data
    console.log('Saving user data:', userData);
    // For now, just exit edit mode
    setEditMode(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Dashboard
      </Typography>

      <Paper elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="dashboard tabs">
            <Tab label="Profile" />
            <Tab label="Upcoming Bookings" />
            <Tab label="All Bookings" />
          </Tabs>
        </Box>

        {/* Profile Tab */}
        <TabPanel value={value} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ProfileAvatar src={user?.avatar || "/default-avatar.jpg"} alt={user?.name} />
              <Typography variant="h5" gutterBottom>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Member since: {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
              </Typography>
              {!editMode && (
                <Button 
                  startIcon={<EditIcon />} 
                  variant="outlined" 
                  onClick={() => setEditMode(true)}
                  sx={{ mt: 2 }}
                >
                  Edit Profile
                </Button>
              )}
            </Grid>

            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">User Information</Typography>
                    {editMode && (
                      <Box>
                        <Button 
                          startIcon={<SaveIcon />} 
                          variant="contained" 
                          color="primary"
                          onClick={handleSave}
                          sx={{ mr: 1 }}
                        >
                          Save
                        </Button>
                        <Button 
                          startIcon={<CancelIcon />} 
                          variant="outlined" 
                          color="secondary"
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    )}
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Full Name
                      </Typography>
                      {editMode ? (
                        <TextField
                          fullWidth
                          name="name"
                          value={userData.name}
                          onChange={handleInputChange}
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        <Typography variant="body1">{userData.name}</Typography>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Email
                      </Typography>
                      {editMode ? (
                        <TextField
                          fullWidth
                          name="email"
                          value={userData.email}
                          onChange={handleInputChange}
                          variant="outlined"
                          size="small"
                          type="email"
                        />
                      ) : (
                        <Typography variant="body1">{userData.email}</Typography>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Phone
                      </Typography>
                      {editMode ? (
                        <TextField
                          fullWidth
                          name="phone"
                          value={userData.phone}
                          onChange={handleInputChange}
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        <Typography variant="body1">{userData.phone || "Not provided"}</Typography>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Address
                      </Typography>
                      {editMode ? (
                        <TextField
                          fullWidth
                          name="address"
                          value={userData.address}
                          onChange={handleInputChange}
                          variant="outlined"
                          size="small"
                          multiline
                          rows={2}
                        />
                      ) : (
                        <Typography variant="body1">{userData.address || "Not provided"}</Typography>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Upcoming Bookings Tab */}
        <TabPanel value={value} index={1}>
          <Grid container spacing={3}>
            {/* Quick Actions Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      component={RouterLink}
                      to="/museums"
                    >
                      Browse Museums
                    </Button>
                    <Button 
                      variant="outlined"
                      component={RouterLink}
                      to="/booking"
                    >
                      Book Tickets
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Upcoming Visits Card */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Upcoming Visits
                  </Typography>
                  
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : upcomingBookings.length > 0 ? (
                    upcomingBookings.map((booking, index) => (
                      <Card key={booking._id || index} sx={{ mb: 2, bgcolor: '#f5f5f5' }}>
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                              <Typography variant="subtitle1">
                                {booking.museumName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Date: {new Date(booking.date).toLocaleDateString()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Tickets: {booking.tickets}
                              </Typography>
                              {booking.status && (
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: booking.status === 'confirmed' ? 'success.main' : 
                                          booking.status === 'pending' ? 'warning.main' : 'error.main'
                                  }}
                                >
                                  Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Typography>
                              )}
                            </Grid>
                            <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              <Button variant="outlined" size="small">
                                View Details
                              </Button>
                              <Button
                                size="small"
                                startIcon={<PictureAsPdfIcon />}
                                onClick={() => downloadTicketPDF(booking._id)}
                                sx={{ ml: 1 }}
                              >
                                PDF
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography>
                      You don't have any upcoming visits. Browse museums to book tickets!
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* All Bookings Tab */}
        <TabPanel value={value} index={2}>
          <Typography variant="h6" gutterBottom>
            Booking History
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : allBookings.length > 0 ? (
            allBookings.map((booking, index) => (
              <Card key={booking._id || index} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="subtitle1">
                        {booking.museumName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Date: {new Date(booking.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tickets: {booking.tickets}
                      </Typography>
                      {booking.status && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: booking.status === 'confirmed' ? 'success.main' : 
                                  booking.status === 'pending' ? 'warning.main' : 'error.main'
                          }}
                        >
                          Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Button variant="outlined" size="small">
                        View Details
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography>
              You haven't made any bookings yet.
            </Typography>
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Dashboard;