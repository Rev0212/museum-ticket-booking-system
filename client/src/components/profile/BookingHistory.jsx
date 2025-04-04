import React, { useEffect, useContext } from 'react';
import { BookingContext } from '../../context/BookingContext';
import { fetchUserBookings } from '../../utils/api';
import { Typography, Box, List, ListItem, Paper, Divider, CircularProgress, Alert } from '@mui/material';

const BookingHistory = () => {
    const { user, bookings, setBookings, loading, setLoading } = useContext(BookingContext);
    const [error, setError] = React.useState('');

    useEffect(() => {
        const fetchBookingHistory = async () => {
            try {
                setLoading(true);
                // Call without user ID
                const response = await fetchUserBookings();
                setBookings(response);
                setError('');
            } catch (error) {
                console.error("Error fetching booking history:", error);
                setError("Failed to load booking history. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchBookingHistory();
        }
    }, [user, setBookings, setLoading]);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Your Booking History
            </Typography>
            
            {bookings && bookings.length > 0 ? (
                <Paper elevation={2}>
                    <List>
                        {bookings.map((booking, index) => (
                            <React.Fragment key={booking._id || index}>
                                <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                                    <Typography variant="h6">{booking.museumName}</Typography>
                                    <Typography variant="body1">
                                        Date: {new Date(booking.date).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body1">
                                        Tickets: {booking.tickets}
                                    </Typography>
                                    <Typography variant="body1">
                                        Status: {booking.status}
                                    </Typography>
                                </ListItem>
                                {index < bookings.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            ) : (
                <Typography variant="body1">No booking history found.</Typography>
            )}
        </Box>
    );
};

export default BookingHistory;