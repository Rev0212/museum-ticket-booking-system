import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Museum-themed Material UI theme
const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#9c5700',
      light: '#c68642',
      dark: '#6b3900',
    },
    secondary: {
      main: '#2a6455',
      light: '#458976',
      dark: '#1a4035',
    },
    background: {
      default: '#f8f5f0',
      paper: '#fffbf2',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
