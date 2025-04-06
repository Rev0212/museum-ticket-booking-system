import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import Header from './Header';
import Footer from './Footer';
import ChatBot from '../chat/ChatBot';
import { Box } from '@mui/material';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props => {
        if (loading) {
          return <LoadingSpinner />;
        }
        
        if (!isAuthenticated) {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location }
              }}
            />
          );
        }
        
        return (
          <>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
              <Component {...props} />
            </Box>
            <Footer />
            <ChatBot />
          </>
        );
      }}
    />
  );
};

export default PrivateRoute;