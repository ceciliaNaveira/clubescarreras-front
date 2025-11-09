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
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

  const toggleDrawer = (open: boolean) => () => setMobileOpen(open);

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "primary.main", height: 85 }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
        }}
      >
        {/* === IZQUIERDA === */}
        {!isMobile ? (
          <Box sx={{ display: "flex", gap: 2, alignItems: "stretch" }}>
            <LinkButton href="/clubs" sx={{ height: "100%" }}>
              Clubes
            </LinkButton>
            <LinkButton href="/races" sx={{ height: "100%" }}>
              Carreras
            </LinkButton>
          </Box>
        ) : (
          <IconButton
            sx={{ color: "white" }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* === CENTRO === */}
        <HeaderLogo />

        {/* === DERECHA === */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {!isMobile && (
            <Typography
              variant="subtitle1"
              sx={{ color: "white", fontWeight: 500, mr: 1 }}
            >
              {usuario && usuario.nombre
                ? `¡Hola, ${usuario.nombre}!`
                : "Únete a nuestra comunidad"}
            </Typography>
          )}

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
            <IconButton
              sx={{ color: "text.primary" }}
              onClick={() => navigate("/login")}
            >
              <Person2OutlinedIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* === DRAWER MÓVIL === */}
      <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            display: "flex",
            flexDirection: "column",
            p: 2,
            gap: 1,
          }}
          onClick={toggleDrawer(false)}
        >
          <List>
            <ListItem button onClick={() => navigate("/clubs")}>
              <ListItemText primary="Clubes" />
            </ListItem>
            <ListItem button onClick={() => navigate("/races")}>
              <ListItemText primary="Carreras" />
            </ListItem>

            {usuario ? (
              <>
                <ListItem button onClick={() => navigate("/perfil")}>
                  <ListItemText primary="Perfil" />
                </ListItem>
                <ListItem button onClick={() => navigate("/favoritos")}>
                  <ListItemText primary="Favoritos" />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                  <ListItemText primary="Cerrar sesión" />
                </ListItem>

                {esAdmin && (
                  <>
                    <ListItem
                      button
                      onClick={() => navigate("/admin/clubs")}
                    >
                      <ListItemText primary="Admin: Clubes" />
                    </ListItem>
                    <ListItem
                      button
                      onClick={() => navigate("/admin/carreras")}
                    >
                      <ListItemText primary="Admin: Carreras" />
                    </ListItem>
                    <ListItem
                      button
                      onClick={() => navigate("/admin/usuarios")}
                    >
                      <ListItemText primary="Admin: Usuarios" />
                    </ListItem>
                    <ListItem
                      button
                      onClick={() => navigate("/admin/comentarios")}
                    >
                      <ListItemText primary="Admin: Comentarios" />
                    </ListItem>
                  </>
                )}
              </>
            ) : (
              <ListItem button onClick={() => navigate("/login")}>
                <ListItemText primary="Iniciar sesión" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};
