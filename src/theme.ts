import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1e263e',   // tu primer color
    },
    secondary: {
      main: '#9b3d12',   // segundo color
    },
    info: {
      main: '#2d3856',   // tercer color
    },
    warning: {
      main: '#404c70',   // cuarto color
    },
    success: {
      main: '#9976aa',   // quinto color
    },
    background: {
      default: '#cccccc', // fondo principal
      paper: '#1e263e',   // fondo de tarjetas y appbar
    },
    text: {
      primary: '#ffffff', // texto principal
      secondary: '#cccccc', // texto secundario
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
