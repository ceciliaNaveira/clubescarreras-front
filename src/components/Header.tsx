// src/components/Header.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { LinkButton } from "./LinkButton";
import { HeaderLogo } from "./HeaderLogo";
import { useUsuario } from "../context/UsuarioContext";

export const Header = () => {
  const navigate = useNavigate();
  const { usuario, setUsuario } = useUsuario();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Abrir y cerrar menú admin
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleMenuClick = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'primary.main', height: 85 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>

        {/* Izquierda: enlaces */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
          <LinkButton href="/clubs" sx={{ height: '100%' }}>Clubes</LinkButton>
          <LinkButton href="/races" sx={{ height: '100%' }}>Carreras</LinkButton>
        </Box>

        {/* Centro: nombre del usuario + logo */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 500 }}>
            Hola, {usuario?.nombre || "Invitado"}
          </Typography>
          <HeaderLogo />
        </Box>

        {/* Derecha: iconos */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton sx={{ color: 'text.primary' }} onClick={usuario ? handleLogout : () => navigate("/login")}>
            <Person2OutlinedIcon />
          </IconButton>
          <IconButton sx={{ color: 'text.primary' }}>
            <FavoriteBorderOutlinedIcon />
          </IconButton>
          <IconButton sx={{ color: 'text.primary' }} onClick={handleMenuOpen}>
            <AdminPanelSettingsOutlinedIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleMenuClick("/admin/clubs")}>Gestionar Clubes</MenuItem>
            <MenuItem onClick={() => handleMenuClick("/admin/carreras")}>Gestionar Carreras</MenuItem>
            <MenuItem onClick={() => handleMenuClick("/admin/usuarios")}>Gestionar Usuarios</MenuItem>
            <MenuItem onClick={() => handleMenuClick("/admin/comentarios")}>Gestionar Comentarios</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
