import React, { useContext, useEffect } from 'react';
import { Container, Grid, Box, Typography, Paper } from '@mui/material';
import ProfileDetails from '../components/profile/ProfileDetails';
import CurrentBookings from '../components/profile/CurrentBookings';
import BookingHistory from '../components/profile/BookingHistory';
import { AuthContext } from '../context/AuthContext';
import { BookingContext } from '../context/BookingContext';

const ProfilePage = () => {
  const { user: authUser } = useContext(AuthContext);
  const { setUser: setBookingUser } = useContext(BookingContext);
  
  // Sync user between contexts
  useEffect(() => {
    if (authUser) {
      setBookingUser(authUser);
    }
  }, [authUser, setBookingUser]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Profile
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ProfileDetails />
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <CurrentBookings />
          </Paper>
          <Paper sx={{ p: 2 }}>
            <BookingHistory />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;