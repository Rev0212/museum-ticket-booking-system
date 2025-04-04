import React, { useEffect, useContext, useState } from 'react';
import { BookingContext } from '../../context/BookingContext';
import { fetchUserBookings } from '../../utils/api';
import { Typography, Box, Card, CardContent, Grid, CircularProgress, Alert } from '@mui/material';

const CurrentBookings = () => {
    const { user } = useContext(BookingContext);
    const [currentBookings, setCurrentBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCurrentBookings = async () => {
            try {
                setLoading(true);
                const allBookings = await fetchUserBookings();
                
                // Filter for current bookings (bookings with dates in the future)
                const now = new Date();
                const current = allBookings.filter(booking => {
                    const bookingDate = new Date(booking.date);
                    return bookingDate >= now;
                });
                
                setCurrentBookings(current);
                setError(null);
            } catch (err) {
                console.error("Error fetching current bookings:", err);
                setError("Failed to load your current bookings. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchCurrentBookings();
        }
    }, [user]);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Your Upcoming Bookings
            </Typography>
            
            {currentBookings.length > 0 ? (
                <Grid container spacing={2}>
                    {currentBookings.map((booking) => (
                        <Grid item xs={12} sm={6} md={4} key={booking._id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {booking.museumName}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                    </Typography>
                                    <Typography variant="body2">
                                        Tickets: {booking.tickets}
                                    </Typography>
                                    <Typography variant="body2">
                                        Status: {booking.status}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1">You don't have any upcoming bookings.</Typography>
            )}
        </Box>
    );
};

export default CurrentBookings;