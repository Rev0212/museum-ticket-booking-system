import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="70vh"
    >
      <CircularProgress size={60} color="primary" />
      <Typography variant="h6" color="textSecondary" style={{ marginTop: '1rem' }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;