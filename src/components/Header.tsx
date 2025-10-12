import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Box, IconButton } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import { LinkButton } from './LinkButton';
import { HeaderLogo } from "./HeaderLogo";

export const Header = () => {
  const navigate = useNavigate();
  return (
    <AppBar position="static" sx={{ backgroundColor: 'primary.main', height: 85 }}>
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
          <LinkButton href="/clubs" sx={{ height: '100%' }}>Clubes</LinkButton>
          <LinkButton href="/races" sx={{ height: '100%' }}>Carreras</LinkButton>
        </Box>

        {/* Centro: logo */}
        <Box>
          <HeaderLogo />
        </Box>

        {/* Derecha: iconos */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            sx={{ color: 'text.primary' }}
            onClick={() => navigate("/login")}
            >
            <Person2OutlinedIcon />
          </IconButton>
          <IconButton sx={{ color: 'text.primary' }}>
            <FavoriteBorderOutlinedIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

