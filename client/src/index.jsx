import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Heritage-inspired color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#9c5700', // Rich amber/bronze - represents ancient artifacts
      light: '#c68642',
      dark: '#6b3900',
      contrastText: '#fff',
    },
    secondary: {
      main: '#2a6455', // Deep teal - represents historical patina
      light: '#458976',
      dark: '#1a4035',
      contrastText: '#fff',
    },
    background: {
      default: '#f8f5f0', // Parchment/aged paper color
      paper: '#fffbf2',
    },
    text: {
      primary: '#3d3427', // Rich earthy brown - aged text
      secondary: '#635b4e', // Softer brown for secondary text
    },
    divider: 'rgba(156, 87, 0, 0.12)',
    // Special accent colors
    error: {
      main: '#a63d40', // Brick red - common in historic Indian architecture
    },
    info: {
      main: '#1e5b8a', // Indigo blue - inspired by ancient Indian dyes
    },
    success: {
      main: '#4b7f52', // Heritage green - represents ancient gardens
    },
    warning: {
      main: '#d08c3c', // Amber gold - represents old gold artifacts
    },
  },
  typography: {
    fontFamily: [
      'Lora',
      'Garamond',
      'Cambria',
      'Times New Roman',
      'serif',
    ].join(','),
    h1: {
      fontFamily: 'Lora, serif',
      fontWeight: 600,
    },
    h2: {
      fontFamily: 'Lora, serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: 'Lora, serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: 'Lora, serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'Lora, serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: 'Lora, serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: 'Raleway, sans-serif',
    },
    body2: {
      fontFamily: 'Raleway, sans-serif',
    },
    button: {
      fontFamily: 'Raleway, sans-serif',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(to right, #9c5700, #8e5600, #81520e)',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            backgroundImage: 'linear-gradient(to bottom, #a66200, #9c5700)',
          },
          '&.MuiButton-containedSecondary': {
            backgroundImage: 'linear-gradient(to bottom, #2a6455, #265a4c)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(156, 87, 0, 0.08)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(156, 87, 0, 0.12)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        },
        elevation3: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

// Add Google Fonts link in the HTML head
const googleFontsLink = document.createElement('link');
googleFontsLink.rel = 'stylesheet';
googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Raleway:wght@300;400;500;600&display=swap';
document.head.appendChild(googleFontsLink);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);