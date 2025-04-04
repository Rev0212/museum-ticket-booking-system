import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import PrivateRoute from './components/common/PrivateRoute';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import BookingPage from './pages/BookingPage';
import MuseumsPage from './pages/MuseumsPage';
import { Box } from '@mui/material';

// This component wraps the whole app to make sure auth state is checked
function AuthCheck({ children }) {
  const { loadUser } = useContext(AuthContext);
  
  useEffect(() => {
    loadUser();
  }, [loadUser]);
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              minHeight: '100vh'
            }}
          >
            <AuthCheck>
              <Header />
              <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
                <Switch>
                  <Route exact path="/" component={HomePage} />
                  <Route path="/museums" component={MuseumsPage} />
                  <Route path="/login" component={LoginPage} />
                  <Route path="/register" component={RegisterPage} />
                  <PrivateRoute path="/dashboard" component={Dashboard} />
                  <PrivateRoute path="/profile" component={ProfilePage} />
                  <PrivateRoute path="/bookings/new/:museumId?" component={BookingPage} />
                </Switch>
              </Box>
              <Footer />
            </AuthCheck>
          </Box>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;