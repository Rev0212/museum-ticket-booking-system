import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { useHistory } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';

const Header = () => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    history.push('/admin/login');
  };

  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={1}
      sx={{ bgcolor: 'white' }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>
        <IconButton 
          size="large"
          sx={{ mr: 1 }}
          aria-label="Toggle theme"
        >
          <Brightness4Icon />
        </IconButton>
        <Button 
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          size="small"
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;