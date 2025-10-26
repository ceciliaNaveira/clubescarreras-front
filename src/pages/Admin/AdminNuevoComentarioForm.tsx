// AdminNuevoComentarioForm.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { TextInput } from "../../components/TextInput";
import { SelectInput } from "../../components/SelectInput";

import { type Club, getClubs } from "../../services/clubService";
import { type UsuarioRequest, getUsuarios } from "../../services/usuarioService";
import { type ComentarioRequest, createComentario } from "../../services/comentarioService";
import { getRoles } from "../../services/rolService";

export const AdminNuevoComentarioForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [comentario, setComentario] = useState<Partial<ComentarioRequest>>({});
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Cargar clubs
        const allClubs = await getClubs();
        setClubs(allClubs);

        // Cargar usuarios y filtrar admin
        const usuarios = await getUsuarios();
        const roles = await getRoles();
        const adminRole = roles.find(r => r.nombreRol.toLowerCase() === "admin");

        if (adminRole) {
          const adminUsuario = usuarios.find(u => u.rolId === adminRole.rolId);
          if (adminUsuario) {
            // Preseleccionamos automáticamente el admin
            setComentario(prev => ({ ...prev, usuarioId: adminUsuario.usuarioId }));
          }
        }
      } catch (err) {
        console.error(err);
        alert("Error cargando datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field: keyof ComentarioRequest, value: any) => {
    setComentario(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!comentario.usuarioId || !comentario.clubId || !comentario.texto || !comentario.valoracion) {
        alert("Rellene todos los campos obligatorios");
        return;
      }

      await createComentario(comentario as ComentarioRequest);
      alert("Comentario creado correctamente");
      navigate("/admin/comentarios");
    } catch (err) {
      console.error(err);
      alert("Error al crear comentario");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <Box sx={{ px: 4, mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: theme.palette.secondary.main }}
          onClick={() => navigate("/admin/comentarios")}
        >
          Volver
        </Button>
      </Box>

      <Box sx={{ width: "100%", backgroundColor: "#fff", borderRadius: 2, boxShadow: "0 2px 6px rgba(0,0,0,0.1)", p: 3 }}>
        <h2 style={{ color: theme.palette.primary.main }}>Nuevo Comentario</h2>

        {/* Usuario admin fijo */}
        <TextInput
          label="Usuario (Admin)"
          value="Cecilia Naveira"
          disabled
          fullWidth
        />

        {/* Seleccionar club */}
        <SelectInput
          label="Club"
          value={comentario.clubId || ""}
          onChange={val => handleChange("clubId", Number(val))}
          options={clubs.map(c => ({ value: c.clubId, label: c.nombre }))}
          fullWidth
        />

        {/* Texto del comentario */}
        <TextInput
          label="Texto"
          value={comentario.texto || ""}
          onChange={val => handleChange("texto", val)}
          multiline
          rows={3}
          fullWidth
        />

        {/* Valoración */}
        <TextInput
          label="Valoración (1-5)"
          type="number"
          value={comentario.valoracion || ""}
          onChange={val => handleChange("valoracion", Number(val))}
          fullWidth
        />

        {/* Botones */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
          <Button variant="outlined" color="secondary" onClick={() => navigate("/admin/comentarios")}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
