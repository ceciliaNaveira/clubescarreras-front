import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0E2B40',   // tu primer color
    },
    secondary: {
      main: '#984916',   // segundo color
    },
    info: {
      main: '#6B818C',   // tercer color
    },
    warning: {
      main: '#404c70',   // cuarto color
    },
    success: {
      main: '#0E2B40',   // quinto color
    },
    background: {
      default: '#cccccc', // fondo principal
      paper: '#6B818C',   // fondo de tarjetas y appbar
    },
    text: {
      primary: '#ffffff', // texto principal
      secondary: '#6B818C', // texto secundario
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
