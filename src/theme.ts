import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0E2B40',       // tu primer color
      contrastText: '#ffffff', // texto sobre botones primarios
    },
    secondary: {
      main: '#984916',       // segundo color
      contrastText: '#ffffff', // texto sobre botones secundarios
    },
    info: {
      main: '#6B818C',       // tercer color
      contrastText: '#ffffff',
    },
    warning: {
      main: '#404c70',       // cuarto color
      contrastText: '#ffffff',
    },
    success: {
      main: '#0E2B40',       // quinto color
      contrastText: '#ffffff',
    },
    background: {
      default: '#e0e0e0',    // fondo general más claro para mejor contraste
      paper: '#34495e',      // fondo de tarjetas y appbar más oscuro para resaltar texto
    },
    text: {
      primary: '#ffffff',    // texto principal sobre fondos oscuros
      secondary: '#0E2B40', // texto secundario sobre fondo paper
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
