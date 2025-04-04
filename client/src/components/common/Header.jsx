import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container
} from '@mui/material';
import MuseumIcon from '@mui/icons-material/Museum';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logoutUser } = useContext(AuthContext);

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar>
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            <MuseumIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Indian Heritage Museums
            </Typography>
          </RouterLink>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button color="inherit" component={RouterLink} to="/">
              Home
            </Button>
            <Button color="inherit" component={RouterLink} to="/museums">
              Museums
            </Button>
            
            {isAuthenticated ? (
              <>
                <Button color="inherit" component={RouterLink} to="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" component={RouterLink} to="/bookings/new">
                  Book Tickets
                </Button>
                <Button color="inherit" component={RouterLink} to="/profile">
                  Profile
                </Button>
                <Button color="inherit" onClick={logoutUser}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="primary" variant="outlined" component={RouterLink} to="/login" sx={{ ml: 1 }}>
                  Login
                </Button>
                <Button color="primary" variant="contained" component={RouterLink} to="/register" sx={{ ml: 1 }}>
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;