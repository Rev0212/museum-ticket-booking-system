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
import EventForm from './components/events/EventForm';
import EventRegistration from './components/events/EventRegistration';
import EventCalendar from './components/events/EventCalendar';
import EventDetailPage from './pages/EventDetailPage';
import EventsPage from './pages/EventsPage';
import EventRegistrationDetailPage from './pages/EventRegistrationDetailPage';

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
                  <Route path="/login" component={LoginPage} />} />
                  <Route path="/register" component={RegisterPage} />
                  <PrivateRoute path="/dashboard" component={Dashboard} />
                  <PrivateRoute path="/profile" component={ProfilePage} />
                  <PrivateRoute path="/bookings/new/:museumId?" component={BookingPage} />
                  <PrivateRoute path="/bookings/new/:museumId?" component={BookingPage} />
                  {/* New routes for events */}
                  <PrivateRoute path="/events/create" component={() => <EventForm onSuccess={() => history.push('/events')} />} />
                  <PrivateRoute path="/events/:eventId/register" component={EventRegistration} />> history.push('/events')} />} />
                  <PrivateRoute path="/events/calendar" component={EventCalendar} />istration} />
                  <Route path="/events/:eventId" component={EventDetailPage} />r} />
                  <Route path="/events" component={EventsPage} />DetailPage} />
                  <Route path="/events" component={EventsPage} />
                  {/* New routes for event registrations */}
                  <PrivateRoute path="/event-registrations/:id" component={EventRegistrationDetailPage} />
                  <Route path="/event-registrations/:id" component={EventRegistrationDetailPage} />
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