import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const BookingContext = createContext();

// Create a provider component
export const BookingProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bookingData, setBookingData] = useState({});
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to handle user login
  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Function to handle user logout
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <BookingContext.Provider 
      value={{ 
        bookingData, 
        updateBookingData: setBookingData, 
        user, 
        setUser,
        loginUser,
        logoutUser,
        bookings,
        setBookings,
        loading,
        setLoading
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Create a custom hook
export const useBooking = () => useContext(BookingContext);

// Export the context itself
export { BookingContext };