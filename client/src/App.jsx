import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import HomePage from './pages/HomePage';
import MuseumsPage from './pages/MuseumsPage'; // Import the new component
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';
import { Box } from '@mui/material';
import ChatBot from './components/chat/ChatBot';

const App = () => {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              minHeight: '100vh'  // Use full viewport height
            }}
          >
            <Header />
            <Box 
              component="main"
              sx={{ 
                flexGrow: 1,   // This makes the main content area grow to fill available space
                width: '100%'
              }}
            >
              <Switch>
                <Route path="/" exact component={HomePage} />
                <Route path="/museums" component={MuseumsPage} /> {/* Add the museums route */}
                <Route path="/login" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
                <PrivateRoute path="/dashboard" component={Dashboard} />
                <PrivateRoute path="/booking" component={BookingPage} />
                <PrivateRoute path="/profile" component={ProfilePage} />
              </Switch>
            </Box>
            <Footer />
            <ChatBot /> {/* Add this line */}
          </Box>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
};

export default App;