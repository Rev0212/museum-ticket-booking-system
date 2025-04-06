import React from 'react';
import { Box } from '@mui/material';
// Add this missing import
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = ({ children }) => {
  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh'
    }}>
      <Sidebar />
      <Box sx={{ 
        flexGrow: 1,
        ml: '240px', // Same width as sidebar
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Header />
        <Box sx={{ p: 3, flexGrow: 1, bgcolor: '#f5f5f5' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;