// src/pages/admin/AdminEditUsuarioForm.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Typography, List, ListItem, ListItemText } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { TextInput } from "../../components/TextInput";
import { SelectInput } from "../../components/SelectInput";

import { type Usuario, getUsuarioById, saveUsuario, deleteUsuario } from "../../services/usuarioService";
import { type Rol, getRoles } from "../../services/rolService";
import {
  buscarComentarios,
  deleteComentario
} from "../../services/comentarioService";
import {
  getFavoritosClubByUsuario,
  deleteFavoritoClub
} from "../../services/favoritoClubService";
import {
  getFavoritosCarreraByUsuario,
  deleteFavoritoCarrera
} from "../../services/favoritoCarreraService";

export const AdminEditUsuarioForm = () => {
  const theme = useTheme();
  const { idUsuario } = useParams<{ idUsuario: string }>();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<Partial<Usuario>>({});
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);

  const [comentarios, setComentarios] = useState<any[]>([]);
  const [favoritosClub, setFavoritosClub] = useState<any[]>([]);
  const [favoritosCarrera, setFavoritosCarrera] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (idUsuario) {
          const u = await getUsuarioById(Number(idUsuario));
          setUsuario(u);

          const [coms, favClubs, favCarrs] = await Promise.all([
            buscarComentarios({ usuarioId: Number(idUsuario) }),
            getFavoritosClubByUsuario(Number(idUsuario)),
            getFavoritosCarreraByUsuario(Number(idUsuario))
          ]);
          setComentarios(coms);
          setFavoritosClub(favClubs);
          setFavoritosCarrera(favCarrs);
        }
        const allRoles = await getRoles();
        setRoles(allRoles);
      } catch (err) {
        console.error("Error cargando usuario:", err);
        alert("No se pudo cargar el usuario");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idUsuario]);

  const handleChange = (field: keyof Usuario, value: any) => {
    setUsuario(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!usuario.nombre || !usuario.email || !usuario.rolId) {
        alert("Nombre, email y rol son obligatorios");
        return;
      }
      await saveUsuario(usuario);
      alert("Usuario guardado correctamente");
      navigate("/admin/usuarios");
    } catch (err) {
      console.error("Error guardando usuario:", err);
      alert("Error al guardar usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAsociados = async () => {
    if (!idUsuario) return;
    if (!confirm("¿Seguro que quieres eliminar todos los comentarios y favoritos del usuario?")) return;

    try {
      setLoading(true);
      for (const c of comentarios) {
        const id = c.comentarioId; 
        if (id) await deleteComentario(id);
      }

      for (const f of favoritosClub) {
        const usuarioId = f.usuarioId;
        const clubId = f.clubId;
        if (usuarioId && clubId) await deleteFavoritoClub(usuarioId, clubId);
      }
      for (const f of favoritosCarrera) {
        const usuarioId = f.usuarioId;
        const carreraId = f.carrera?.carreraId; 
        if (usuarioId && carreraId) await deleteFavoritoCarrera(usuarioId, carreraId);
      }

      setComentarios([]);
      setFavoritosClub([]);
      setFavoritosCarrera([]);

      alert("Datos asociados eliminados correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar datos asociados");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUsuario = async () => {
    if (!idUsuario) return;
    if (comentarios.length || favoritosClub.length || favoritosCarrera.length) {
      alert("No se puede eliminar el usuario mientras tenga datos asociados.\nPrimero elimina comentarios y favoritos.");
      return;
    }
    if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;

    try {
      setLoading(true);
      await deleteUsuario(Number(idUsuario));
      alert("Usuario eliminado correctamente");
      navigate("/admin/usuarios");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar usuario");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando usuario...</p>;

  return (
    <Box sx={{ px: 4, mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: theme.palette.secondary.main }}
          onClick={() => navigate("/admin/usuarios")}
        >
          Volver
        </Button>
      </Box>

      {/* Usuario */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
        <h3 style={{ color: theme.palette.primary.main }}>Usuario</h3>

        <TextInput
          label="Nombre"
          value={usuario.nombre || ""}
          onChange={val => handleChange("nombre", val)}
        />

        <TextInput
          label="Email"
          value={usuario.email || ""}
          onChange={val => handleChange("email", val)}
        />

        <TextInput
          label="Contraseña"
          type="password"
          value={usuario.contraseña || ""}
          onChange={val => handleChange("contraseña", val)}
        />

        <SelectInput
          label="Rol"
          value={usuario.rolId || ""}
          onChange={val => handleChange("rolId", Number(val))}
          options={roles.map(r => ({ value: r.rolId, label: r.nombreRol }))}
        />
      </Box>

      {/* Datos asociados */}
      <Box sx={{ mb: 3, p: 2, color:"text.secondary", backgroundColor: "#fff", borderRadius: 2, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
        <h3 style={{ color: theme.palette.primary.main }}>Datos asociados</h3>

        {comentarios.length === 0 && favoritosClub.length === 0 && favoritosCarrera.length === 0 ? (
          <Typography>No hay comentarios ni favoritos asociados.</Typography>
        ) : (
          <>
            {/* Comentarios */}
            {comentarios.length > 0 && (
              <Box mb={2}>
                <Typography variant="subtitle1">Comentarios ({comentarios.length})</Typography>
                <List dense>
                  {comentarios.map(c => (
                    <ListItem key={`coment-${c.id_comentario ?? c.id}`}>
                      <ListItemText
                        primary=""
                        secondary={`Comentario: ${c.texto} | Club ID: ${c.clubId}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Favoritos Club */}
            {favoritosClub.length > 0 && (
              <Box mb={2}>
                <Typography variant="subtitle1">Favoritos de Club ({favoritosClub.length})</Typography>
                <List dense>
                  {favoritosClub.map(f => (
                    <ListItem key={`club-${f.usuarioId}-${f.clubId}`}>
                      <ListItemText
                        primary=""
                        secondary={`Club: ${f.clubNombre || `ID ${f.clubId}`} | Usuario ID: ${f.usuarioId}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Favoritos Carrera */}
            {favoritosCarrera.length > 0 && (
              <Box mb={2}>
                <Typography variant="subtitle1">Favoritos de Carrera ({favoritosCarrera.length})</Typography>
                <List dense>
                  {favoritosCarrera.map(f => (
                    <ListItem key={`carrera-${f.usuarioId}-${f.carrera?.carreraId}`}>
                      <ListItemText
                        primary=""
                        secondary={`Carrera: ${f.carrera?.nombre || `ID ${f.carrera?.carreraId}`} | Usuario ID: ${f.usuarioId}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Button variant="contained" color="secondary" onClick={handleDeleteAsociados}>
              Eliminar todos los datos asociados
            </Button>
          </>
        )}
      </Box>

      {/* Botones */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>Guardar</Button>
        <Button variant="contained" color="error" onClick={handleDeleteUsuario}>Eliminar usuario</Button>
      </Box>
    </Box>
  );
};
