import { useState, useEffect } from "react";
import { Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button, useTheme, List, ListItem, ListItemText } from "@mui/material";
import { BlueButton, OrangeButton } from "../components/CustomButton";
import { CustomTextField } from "../components/CustomTextField";
import { useUsuario } from "../context/UsuarioContext";
import { updateUsuario, deleteUsuario, loginUsuario } from "../services/usuarioService";
import { buscarComentarios, deleteComentario } from "../services/comentarioService";
import { getFavoritosClubByUsuario, deleteFavoritoClub } from "../services/favoritoClubService";
import { getFavoritosCarreraByUsuario, deleteFavoritoCarrera } from "../services/favoritoCarreraService";
import { useNavigate } from "react-router-dom";

export const Perfil = () => {
  const { usuario, setUsuario } = useUsuario();
  const navigate = useNavigate();
  const theme = useTheme();

  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [contraseñaActual, setContraseñaActual] = useState("");
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const [comentarios, setComentarios] = useState<any[]>([]);
  const [favoritosClub, setFavoritosClub] = useState<any[]>([]);
  const [favoritosCarrera, setFavoritosCarrera] = useState<any[]>([]);

  // Cargar datos asociados al usuario
  useEffect(() => {
    const fetchDatosAsociados = async () => {
      if (!usuario) return;
      setLoading(true);
      try {
        const [coms, favClubs, favCarrs] = await Promise.all([
          buscarComentarios({ usuarioId: usuario.usuarioId }),
          getFavoritosClubByUsuario(usuario.usuarioId),
          getFavoritosCarreraByUsuario(usuario.usuarioId)
        ]);
        setComentarios(coms);
        setFavoritosClub(favClubs);
        setFavoritosCarrera(favCarrs);
      } catch (err) {
        console.error(err);
        alert("Error al cargar comentarios y favoritos.");
      } finally {
        setLoading(false);
      }
    };
    fetchDatosAsociados();
  }, [usuario]);

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre);
      setEmail(usuario.email);
    }
  }, [usuario]);

  // Guardar cambios del perfil
  const handleGuardar = async () => {
    if (!usuario) {
      alert("Debes iniciar sesión para editar tu perfil.");
      return;
    }
    if (!contraseñaActual) {
      alert("Debes ingresar tu contraseña actual para guardar cambios.");
      return;
    }

    try {
      await loginUsuario(usuario.email, contraseñaActual);
    } catch {
      alert("❌ Contraseña actual incorrecta.");
      return;
    }

    const usuarioActualizado = {
      usuarioId: usuario.usuarioId,
      nombre,
      email,
      contraseña: nuevaContraseña || contraseñaActual,
      rolId: usuario.rolId,
    };

    try {
      const actualizado = await updateUsuario(usuario.usuarioId, usuarioActualizado);
      setUsuario(actualizado);
      localStorage.setItem("usuario", JSON.stringify(actualizado));
      alert("Datos actualizados correctamente.");
      setContraseñaActual("");
      setNuevaContraseña("");
    } catch (error) {
      console.error(error);
      alert("❌ Error al actualizar los datos.");
    }
  };

  // Eliminar datos asociados
  const handleDeleteAsociados = async () => {
    if (!usuario) return;
    if (!confirm("¿Seguro que quieres eliminar todos tus comentarios y favoritos?")) return;

    try {
      setLoading(true);

      for (const c of comentarios) {
        const id = c.comentarioId ?? c.id;
        if (id) await deleteComentario(id);
      }

      for (const f of favoritosClub) {
        const usuarioId = f.usuarioId ?? usuario.usuarioId;
        const clubId = f.clubId;
        if (usuarioId && clubId) await deleteFavoritoClub(usuarioId, clubId);
      }

      for (const f of favoritosCarrera) {
        const usuarioId = f.usuarioId ?? usuario.usuarioId;
        const carreraId = f.carreraId ?? f.carrera?.carreraId;
        if (usuarioId && carreraId) await deleteFavoritoCarrera(usuarioId, carreraId);
      }

      setComentarios([]);
      setFavoritosClub([]);
      setFavoritosCarrera([]);

      alert("Datos asociados eliminados correctamente.");
    } catch (error) {
      console.error(error);
      alert("❌ Error al eliminar datos asociados.");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar cuenta
  const handleEliminarCuenta = async () => {
    if (!usuario) return;
    if (comentarios.length || favoritosClub.length || favoritosCarrera.length) {
      alert("❌ Primero elimina tus comentarios y favoritos antes de borrar la cuenta.");
      return;
    }
    if (!confirm("¿Seguro que quieres eliminar tu cuenta?")) return;

    try {
      setLoading(true);
      await deleteUsuario(usuario.usuarioId);
      localStorage.removeItem("usuario");
      setUsuario(null);
      alert("Cuenta eliminada correctamente.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("❌ Error al eliminar la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return (
      <Typography sx={{ textAlign: "center", mt: 5 }}>
        Debes iniciar sesión para editar tu perfil.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 4,
        mb: 4,
        px: 2,
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          p: 4,
          width: 400,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: 3,
          backgroundColor: "background.paper",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
          Editar Perfil
        </Typography>

        <CustomTextField placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <CustomTextField placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <CustomTextField
          placeholder="Contraseña actual"
          type="password"
          value={contraseñaActual}
          onChange={(e) => setContraseñaActual(e.target.value)}
        />
        <CustomTextField
          placeholder="Nueva contraseña (opcional)"
          type="password"
          value={nuevaContraseña}
          onChange={(e) => setNuevaContraseña(e.target.value)}
        />

        <BlueButton fullWidth onClick={handleGuardar}>Guardar cambios</BlueButton>

        {(comentarios.length > 0 || favoritosClub.length > 0 || favoritosCarrera.length > 0) && (
        <Box sx={{ mt: 2, textAlign: "left" }}>
          {/* Comentarios */}
          {comentarios.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Tus comentarios</Typography>
              <List dense>
                {comentarios.map((c) => (
                  <ListItem key={c.id_comentario ?? c.id}>
                    <ListItemText primary={c.texto} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Favoritos */}
          {(favoritosClub.length > 0 || favoritosCarrera.length > 0) && (
            <Box>
              <Typography variant="subtitle1">Tus favoritos</Typography>

              {favoritosClub.length > 0 && (
                <List dense>
                  {favoritosClub.map((f) => (
                    <ListItem key={`club-${f.usuarioId}-${f.clubId}`}>
                      <ListItemText primary={f.clubNombre} />
                    </ListItem>
                  ))}
                </List>
              )}

              {favoritosCarrera.length > 0 && (
                <List dense>
                  {favoritosCarrera.map((f) => (
                    <ListItem key={`carrera-${f.usuarioId}-${f.carrera?.carreraId}`}>
                      <ListItemText primary={f.carrera?.nombre} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}

          <OrangeButton fullWidth onClick={handleDeleteAsociados}>
            Eliminar todos los datos asociados
          </OrangeButton>
        </Box>
      )}

        <OrangeButton
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => setOpenDialog(true)}
          disabled={comentarios.length > 0 || favoritosClub.length > 0 || favoritosCarrera.length > 0}
        >
          Eliminar cuenta
        </OrangeButton>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Eliminar cuenta</DialogTitle>
        <DialogContent>
          <Typography>¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button color="error" onClick={handleEliminarCuenta}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
