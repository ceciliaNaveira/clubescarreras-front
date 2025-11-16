import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0E2B40',       
      contrastText: '#ffffff', 
    },
    secondary: {
      main: '#984916',      
      contrastText: '#ffffff', 
    },
    info: {
      main: '#6B818C',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#404c70', 
      contrastText: '#ffffff',
    },
    success: {
      main: '#0E2B40',
      contrastText: '#ffffff',
    },
    background: {
      default: '#e0e0e0',
      paper: '#34495e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#0E2B40',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
