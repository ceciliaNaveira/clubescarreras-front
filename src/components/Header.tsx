import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { LinkButton } from './LinkButton';
import { HeaderLogo } from "./HeaderLogo";

export const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    handleMenuClose();
  };

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

        {/* Derecha: iconos (usuario, favorito, admin) */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton 
            sx={{ color: 'text.primary' }}
            onClick={() => navigate("/login")}
          >
            <Person2OutlinedIcon />
          </IconButton>
          <IconButton sx={{ color: 'text.primary' }}>
            <FavoriteBorderOutlinedIcon />
          </IconButton>
          <IconButton 
            sx={{ color: 'text.primary' }} 
            onClick={handleMenuOpen}
          >
            <AdminPanelSettingsOutlinedIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleMenuClick("/admin/clubs")}>
              Gestionar Clubes
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick("/admin/carreras")}>
              Gestionar Carreras
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick("/admin/usuarios")}>
              Gestionar Usuarios
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick("/admin/comentarios")}>
              Gestionar Comentarios
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
