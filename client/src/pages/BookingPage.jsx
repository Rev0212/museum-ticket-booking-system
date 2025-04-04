import React, { useContext, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';
import { AuthContext } from '../context/AuthContext';
import BookingForm from '../components/booking/BookingForm';
import PaymentProcess from '../components/booking/PaymentProcess';
import TicketConfirmation from '../components/booking/TicketConfirmation';
import { Container, Box, Stepper, Step, StepLabel, Paper, Typography } from '@mui/material';
import { getMuseumById } from '../utils/api';

const BookingPage = () => {
    const { bookingData, updateBookingData } = useContext(BookingContext);
    const { user } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [museum, setMuseum] = useState(null);
    const [loading, setLoading] = useState(false);
    const { museumId } = useParams();
    const history = useHistory();

    // Fetch museum data if museumId is provided
    useEffect(() => {
        const fetchMuseum = async () => {
            if (museumId) {
                try {
                    setLoading(true);
                    const museumData = await getMuseumById(museumId);
                    setMuseum(museumData);
                    // Update booking data with museum info
                    updateBookingData({
                        ...bookingData,
                        museum: museumData
                    });
                } catch (error) {
                    console.error('Error fetching museum:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchMuseum();
    }, [museumId, updateBookingData]);

    const handleNextStep = () => {
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
                        setBookingData={updateBookingData} 
                        preselectedMuseum={museum}
                        loading={loading}
                        onNext={handleNextStep} 
                    />
                )}
                {step === 2 && (
                    <PaymentProcess 
                        bookingData={bookingData} 
                        onNext={handleNextStep} 
                        onPrevious={handlePreviousStep} 
                    />
                )}
                {step === 3 && (
                    <TicketConfirmation 
                        bookingData={bookingData} 
                        onPrevious={handlePreviousStep}
                        // Pass directData prop to indicate this is not from URL params
                        directData={true}
                    />
                )}
            </Paper>
        </Container>
    );
};

export default BookingPage;