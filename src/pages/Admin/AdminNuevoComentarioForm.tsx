import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { type Club, getClubs } from "../../services/clubService";
import { type ComentarioRequest, createComentario } from "../../services/comentarioService";
import { useUsuario } from "../../context/UsuarioContext";

export const AdminNuevoComentarioForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { usuario } = useUsuario();

  const [comentario, setComentario] = useState<Partial<ComentarioRequest>>({});
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      try {
        const allClubs = await getClubs();
        setClubs(allClubs);
      } catch (err) {
        console.error(err);
        alert("Error cargando clubs");
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const handleChange = (field: keyof ComentarioRequest, value: any) => {
    setComentario(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!usuario) {
      alert("No hay usuario logueado");
      return;
    }

    const usuarioId = usuario.usuarioId;
    const clubId = Number(comentario.clubId);
    const texto = comentario.texto?.trim() || "";
    const valoracion = Number(comentario.valoracion);

    if (!usuarioId || !clubId || !texto || isNaN(valoracion)) {
      alert("Rellene todos los campos obligatorios");
      return;
    }

    if (valoracion < 1 || valoracion > 5) {
      alert("La valoración debe ser un número entre 1 y 5");
      return;
    }

    const payload: ComentarioRequest = {
      usuarioId,
      clubId,
      texto,
      valoracion,
    };

    try {
      await createComentario(payload);
      alert("Comentario creado correctamente");
      navigate("/admin/comentarios");
    } catch (err: any) {
      console.error(err);
      alert(`Error al crear comentario: ${err.message}`);
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

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          p: 3,
        }}
      >
        <h2 style={{ color: theme.palette.primary.main }}>Nuevo Comentario</h2>

        {/* Usuario logueado */}
        <TextField
          label="Usuario"
          value={usuario?.nombre || ""}
          disabled
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: theme.palette.primary.main } }}
          InputProps={{ style: { color: theme.palette.primary.main } }}
        />

        {/* Seleccionar club */}
        <TextField
          select
          label="Club"
          value={comentario.clubId || ""}
          onChange={e => handleChange("clubId", Number(e.target.value))}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: theme.palette.primary.main } }}
          InputProps={{ style: { color: theme.palette.primary.main } }}
        >
          <MenuItem value="" disabled sx={{ color: "#fff" }}>Seleccione un club</MenuItem>
          {clubs.map(c => (
            <MenuItem key={c.clubId} value={c.clubId} sx={{ color: "#fff" }}>
              {c.nombre}
            </MenuItem>
          ))}
        </TextField>

        {/* Texto del comentario */}
        <TextField
          label="Texto"
          value={comentario.texto || ""}
          onChange={e => handleChange("texto", e.target.value)}
          multiline
          rows={3}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: theme.palette.primary.main } }}
          InputProps={{ style: { color: theme.palette.primary.main } }}
        />

        {/* Valoración */}
        <TextField
          select
          label="Valoración"
          value={comentario.valoracion || ""}
          onChange={e => handleChange("valoracion", Number(e.target.value))}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ style: { color: theme.palette.primary.main } }}
          InputProps={{ style: { color: theme.palette.primary.main } }}
        >
          <MenuItem value="" disabled sx={{ color: "#fff" }}>Seleccione valoración</MenuItem>
          {[1, 2, 3, 4, 5].map(n => (
            <MenuItem key={n} value={n} sx={{ color: "#fff" }}>
              {n}
            </MenuItem>
          ))}
        </TextField>

        {/* Botones */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
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
