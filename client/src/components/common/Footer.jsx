import React from 'react';
import { Box, Container, Typography, Link, Stack, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <Box component="footer" sx={{ 
      bgcolor: 'background.paper', 
      py: 3, 
      mt: 'auto',
      borderTop: 1,
      borderColor: 'divider'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Museum Ticket Booking System. All rights reserved.
          </Typography>
          
          <Stack direction="row" spacing={2}>
            <IconButton color="primary" aria-label="Facebook">
              <FacebookIcon />
            </IconButton>
            <IconButton color="primary" aria-label="Twitter">
              <TwitterIcon />
            </IconButton>
            <IconButton color="primary" aria-label="Instagram">
              <InstagramIcon />
            </IconButton>
            <IconButton color="primary" aria-label="LinkedIn">
              <LinkedInIcon />
            </IconButton>
          </Stack>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mt: 2,
          gap: 3,
          flexWrap: 'wrap'
        }}>
          <Link href="#" color="inherit" underline="hover">
            Privacy Policy
          </Link>
          <Link href="#" color="inherit" underline="hover">
            Terms of Service
          </Link>
          <Link href="#" color="inherit" underline="hover">
            Contact Us
          </Link>
          <Link href="#" color="inherit" underline="hover">
            FAQ
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;