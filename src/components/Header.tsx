import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import { LinkButton } from "./LinkButton";
import { HeaderLogo } from "./HeaderLogo";
import { useUsuario } from "../context/UsuarioContext";

export const Header = () => {
  const navigate = useNavigate();
  const { usuario, setUsuario } = useUsuario();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleMenuClick = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    navigate("/login");
  };

  const esAdmin = usuario?.rolId === 1;

  console.log("Usuario en Header:", usuario);

  return (
    <AppBar position="static" sx={{ backgroundColor: "primary.main", height: 85 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
        }}
      >
        {/* Izquierda: enlaces */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "stretch" }}>
          <LinkButton href="/clubs" sx={{ height: "100%" }}>
            Clubes
          </LinkButton>
          <LinkButton href="/races" sx={{ height: "100%" }}>
            Carreras
          </LinkButton>
        </Box>

        {/* Centro: logo */}
        <HeaderLogo />

        {/* Derecha: saludo + iconos */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{ color: "white", fontWeight: 500, mr: 1 }}
          >
            {usuario && usuario.nombre
              ? `¡Hola, ${usuario.nombre}!`
              : "Únete a nuestra comunidad"}
          </Typography>

          {usuario ? (
            <>
              <IconButton
                sx={{ color: "text.primary" }}
                onClick={() => navigate("/perfil")}
              >
                <SettingsIcon />
              </IconButton>

              <IconButton
                sx={{ color: "text.primary" }}
                onClick={() => navigate("/favoritos")}
              >
                <FavoriteBorderOutlinedIcon />
              </IconButton>

              <IconButton sx={{ color: "text.primary" }} onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>

              {esAdmin && (
                <>
                  <IconButton
                    sx={{ color: "text.primary" }}
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
                    <MenuItem
                      onClick={() => handleMenuClick("/admin/comentarios")}
                    >
                      Gestionar Comentarios
                    </MenuItem>
                  </Menu>
                </>
              )}
            </>
          ) : (
            <>

              <IconButton
                sx={{ color: "text.primary" }}
                onClick={() => navigate("/login")}
              >
                <Person2OutlinedIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
