import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { UsuarioProvider } from './context/UsuarioContext'; 

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UsuarioProvider> {/* <- envolver la App */}
        <App />
      </UsuarioProvider>
    </ThemeProvider>
  </React.StrictMode>
);
