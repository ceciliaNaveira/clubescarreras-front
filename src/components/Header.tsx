// src/components/Header.tsx
import { AppBar, Toolbar, Box, IconButton } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import Logo from '../assets/logo_proyecto.png';
import { LinkButton } from './LinkButton';

export const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'primary.main', height: 60 }}>
      <Toolbar 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          px: 2, 
        }}
      >
        {/* Izquierda: enlaces como botones */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
          <LinkButton href="/clubes" sx={{ height: '100%' }}>Clubes</LinkButton>
          <LinkButton href="/carreras" sx={{ height: '100%' }}>Carreras</LinkButton>
        </Box>

        {/* Centro: logo */}
        <Box component="img" src={Logo} alt="Logo" sx={{ height: 50 }} />

        {/* Derecha: iconos */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="secondary">
            <Person2OutlinedIcon />
          </IconButton>
          <IconButton color="secondary">
            <FavoriteBorderOutlinedIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

