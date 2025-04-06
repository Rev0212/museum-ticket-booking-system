import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import MuseumIcon from '@mui/icons-material/Museum';
import ArticleIcon from '@mui/icons-material/Article';
import EventIcon from '@mui/icons-material/Event';

const Sidebar = () => {
  return (
    <Box 
      sx={{ 
        width: 240, 
        bgcolor: '#1a237e', 
        color: 'white',
        position: 'fixed',
        height: '100%',
        overflowY: 'auto'
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold">
          Museum Admin
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      <List>
        {[
          { text: 'Dashboard', icon: <HomeIcon />, path: '/admin' },
          { text: 'Museums', icon: <MuseumIcon />, path: '/admin/museums' },
          { text: 'Events', icon: <EventIcon />, path: '/admin/events' },
          { text: 'News', icon: <ArticleIcon />, path: '/admin/news' },
          { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
        ].map((item) => (
          <ListItem 
            button
            key={item.text}
            component={NavLink}
            to={item.path}
            activeStyle={{
              backgroundColor: 'rgba(255,255,255,0.2)',
            }}
            sx={{
              mx: 1,
              borderRadius: 1,
              mb: 0.5,
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;