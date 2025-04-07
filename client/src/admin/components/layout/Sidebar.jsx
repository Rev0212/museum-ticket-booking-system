import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider, Paper } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import MuseumIcon from '@mui/icons-material/Museum';
import ArticleIcon from '@mui/icons-material/Article';
import EventIcon from '@mui/icons-material/Event';

const Sidebar = () => {
  const history = useHistory();
  const location = useLocation();
  
  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/admin' },
    { text: 'Museums', icon: <MuseumIcon />, path: '/admin/museums' },
    { text: 'Events', icon: <EventIcon />, path: '/admin/events' },
    { text: 'News', icon: <ArticleIcon />, path: '/admin/news' },
    { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
  ];

  return (
    <Paper
      elevation={4}
      sx={{ 
        width: 240, 
        position: 'fixed',
        height: '100%',
        overflowY: 'auto',
        borderRadius: 0,
        bgcolor: 'white',
      }}
    >
      {/* Header area with primary color */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        p: 2.5,
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Museum Admin
        </Typography>
      </Box>
      
      <Divider />
      
      <Box sx={{ pt: 2 }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <ListItem 
                button
                key={item.text}
                onClick={() => history.push(item.path)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 1,
                  color: isActive ? 'primary.main' : 'text.primary',
                  bgcolor: isActive ? 'rgba(156, 87, 0, 0.08)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? 'primary.main' : 'text.secondary',
                    minWidth: 40 
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? '600' : 'normal'
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
      
      {/* Bottom section with subtle branding */}
      <Box sx={{ 
        position: 'absolute', 
        bottom: 0, 
        width: '100%', 
        p: 2,
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        textAlign: 'center'
      }}>
        <Typography variant="caption" color="text.secondary">
          Museum Management v1.0
        </Typography>
      </Box>
    </Paper>
  );
};

export default Sidebar;