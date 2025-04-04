import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BookIcon from '@mui/icons-material/Book';
import DashboardIcon from '@mui/icons-material/Dashboard';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Book Tickets', path: '/booking', icon: <BookIcon /> },
    { text: 'Profile', path: '/profile', icon: <AccountCircleIcon /> }
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ConfirmationNumberIcon sx={{ mr: 1 }} /> Museum Tickets
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.text} 
            component={RouterLink} 
            to={item.path}
            sx={{ 
              textAlign: 'center',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              {item.icon}
              <ListItemText primary={item.text} />
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Container maxWidth="lg">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              color: 'inherit',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ConfirmationNumberIcon sx={{ mr: 1 }} />
            Museum Ticket Booking
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex' }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  sx={{ mx: 1 }}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </Container>
      
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;