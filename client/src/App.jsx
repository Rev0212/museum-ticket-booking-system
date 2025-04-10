import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import HomePage from './pages/HomePage';
import MuseumsPage from './pages/MuseumsPage';
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

// Admin imports
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/Dashboard';
import MuseumsManagement from './admin/pages/MuseumsManagement';
import NewsManagement from './admin/pages/NewsManagement';
import UserManagement from './admin/pages/UserManagement';
import AdminLayout from './admin/components/layout/adminLayout';

// Admin Route Component
const AdminRoute = ({ component: Component, ...rest }) => {
  const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user && user.role === 'admin';
  };

  return (
    <Route
      {...rest}
      render={props =>
        isAdmin() ? (
          <AdminLayout>
            <Component {...props} />
          </AdminLayout>
        ) : (
          <Redirect to="/admin/login" />
        )
      }
    />
  );
};

const App = () => {
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
            <Switch>
              {/* Admin Routes */}
              <Route path="/admin/login" component={AdminLogin} />
              <AdminRoute path="/admin" exact component={AdminDashboard} />
              <AdminRoute path="/admin/museums" component={MuseumsManagement} />
              <AdminRoute path="/admin/news" component={NewsManagement} />
              <AdminRoute path="/admin/users" component={UserManagement} />

              {/* User Routes */}
              <Route path="/" exact>
                <>
                  <Header />
                  <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
                    <HomePage />
                  </Box>
                  <Footer />
                  <ChatBot />
                </>
              </Route>
              <Route path="/museums">
                <>
                  <Header />
                  <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
                    <MuseumsPage />
                  </Box>
                  <Footer />
                  <ChatBot />
                </>
              </Route>
              <Route path="/login">
                <>
                  <Header />
                  <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
                    <LoginPage />
                  </Box>
                  <Footer />
                </>
              </Route>
              <Route path="/register">
                <>
                  <Header />
                  <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
                    <RegisterPage />
                  </Box>
                  <Footer />
                </>
              </Route>
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <PrivateRoute path="/booking" component={BookingPage} />
              <PrivateRoute path="/profile" component={ProfilePage} />
            </Switch>
          </Box>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
};

export default App;