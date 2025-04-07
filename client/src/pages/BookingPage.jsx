import React, { useContext, useState, useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';
import { AuthContext } from '../context/AuthContext';
import BookingForm from '../components/booking/BookingForm';
import PaymentProcess from '../components/booking/PaymentProcess';
import TicketConfirmation from '../components/booking/TicketConfirmation';
import { Container, Box, Stepper, Step, StepLabel, Paper, Typography, Alert } from '@mui/material';
import { getMuseumById } from '../utils/api';
import { format } from 'date-fns';

const BookingPage = () => {
    const { user } = useContext(AuthContext);
    const history = useHistory();
    const location = useLocation();
    const { museumId } = useParams();
    const [error, setError] = useState('');
    
    // Properly structured booking data
    const [bookingData, setBookingData] = useState({
        museum: null,
        visitDate: null,
        tickets: [
            // Each ticket will have: { type: 'adult|child|senior', quantity: Number, price: Number }
        ],
        totalAmount: 0,
        contactInfo: {
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || ''
        },
        paymentMethod: 'credit_card'
    });
    
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    // Redirect to login if not authenticated
    useEffect(() => {
        if (!user) {
            history.push({
                pathname: '/login',
                state: { from: location.pathname }
            });
        }
    }, [user, history, location]);

    // Fetch museum data if museumId is provided
    useEffect(() => {
        const fetchMuseum = async () => {
            if (museumId) {
                try {
                    setLoading(true);
                    setError('');
                    const museumData = await getMuseumById(museumId);
                    
                    if (!museumData) {
                        setError('Museum not found');
                        return;
                    }
                    
                    setBookingData(prev => ({
                        ...prev,
                        museum: museumData
                    }));
                } catch (error) {
                    console.error('Error fetching museum:', error);
                    setError('Failed to load museum information. Please try again.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchMuseum();
    }, [museumId]);

    // Handle data more robustly between steps
    const handleNextStep = (updatedData) => {
        if (updatedData) {
            setBookingData(prev => {
                const newData = { ...prev };
                
                // Copy all fields except special handling for date
                Object.keys(updatedData).forEach(key => {
                    if (key !== 'visitDate') {
                        newData[key] = updatedData[key];
                    }
                });
                
                // Special handling for visitDate to ensure it's valid
                if (updatedData.visitDate) {
                    // Convert Date object to string format
                    if (updatedData.visitDate instanceof Date) {
                        if (!isNaN(updatedData.visitDate.getTime())) {
                            newData.visitDate = updatedData.visitDate.toISOString().split('T')[0];
                        } else {
                            console.error('Invalid date object in updatedData:', updatedData.visitDate);
                            // Set default date (tomorrow) if invalid
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            newData.visitDate = tomorrow.toISOString().split('T')[0];
                        }
                    } else if (typeof updatedData.visitDate === 'string') {
                        // Validate string date
                        const tempDate = new Date(updatedData.visitDate);
                        if (!isNaN(tempDate.getTime())) {
                            newData.visitDate = updatedData.visitDate;
                        } else {
                            console.error('Invalid date string in updatedData:', updatedData.visitDate);
                            // Set default date
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            newData.visitDate = tomorrow.toISOString().split('T')[0];
                        }
                    } else {
                        console.error('Unknown date format in updatedData:', updatedData.visitDate);
                        // Set default date
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        newData.visitDate = tomorrow.toISOString().split('T')[0];
                    }
                }
                
                return newData;
            });
        }
        
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const steps = [
        'Booking Details',
        'Payment',
        'Confirmation'
    ];

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}
            
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                    Book Museum Tickets
                </Typography>
                
                <Stepper activeStep={step - 1} alternativeLabel sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                
                {step === 1 && (
                    <BookingForm 
                        bookingData={bookingData} 
                        setBookingData={setBookingData} 
                        loading={loading}
                        onNext={handleNextStep} 
                    />
                )}
                {step === 2 && (
                    <PaymentProcess 
                        bookingData={bookingData} 
                        setBookingData={setBookingData}
                        onNext={handleNextStep} 
                        onPrevious={handlePreviousStep} 
                    />
                )}
                {step === 3 && (
                    <TicketConfirmation 
                        bookingData={bookingData} 
                        onPrevious={handlePreviousStep}
                        directData={true}
                    />
                )}
            </Paper>
        </Container>
    );
};

export default BookingPage;