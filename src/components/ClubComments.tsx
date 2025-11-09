import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Button, Rating, MenuItem } from "@mui/material";

import { type ComentarioRequest, createComentario, getComentariosByClubId } from "../services/comentarioService";

type ClubCommentsProps = {
  clubId: number;
  usuarioId: number; // usuario logueado
  usuarioNombre: string; // nombre para mostrar
};

export const ClubComments = ({ clubId, usuarioId, usuarioNombre }: ClubCommentsProps) => {
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState<Partial<ComentarioRequest>>({});
  const [loading, setLoading] = useState(true);

  // Cargar comentarios
  useEffect(() => {
    const fetchComentarios = async () => {
      setLoading(true);
      try {
        const coms = await getComentariosByClubId(clubId);
        setComentarios(coms);
      } catch (err) {
        console.error(err);
        alert("Error cargando comentarios");
      } finally {
        setLoading(false);
      }
    };
    fetchComentarios();
  }, [clubId]);

  const handleChange = (field: keyof ComentarioRequest, value: any) => {
    setNuevoComentario(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!nuevoComentario.texto || !nuevoComentario.valoracion) {
      alert("Rellene todos los campos obligatorios");
      return;
    }

    try {
      await createComentario({
        ...nuevoComentario,
        clubId,
        usuarioId,
        usuarioNombre
      } as ComentarioRequest);
      const updated = await getComentariosByClubId(clubId);
      setComentarios(updated);
      setNuevoComentario({});
    } catch (err) {
      console.error(err);
      alert("Error al crear comentario");
    }
  };

  const valoracionMedia =
    comentarios.length > 0
      ? comentarios.reduce((acc, c) => acc + c.valoracion, 0) / comentarios.length
      : 0;

  if (loading) return <p>Cargando comentarios...</p>;

  return (
    <Box>
      {/* Valoración media */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography>Valoración media:</Typography>
        <Rating value={valoracionMedia} precision={0.5} readOnly />
        <Typography>({comentarios.length} comentarios)</Typography>
      </Box>

      {/* Lista de comentarios */}
      {comentarios.map(c => (
        <Card key={c.id} sx={{ mb: 1 }}>
          <CardContent>
            <Typography variant="subtitle2">{c.usuarioNombre}</Typography>
            <Rating value={c.valoracion} readOnly size="small" />
            <Typography>{c.texto}</Typography>
          </CardContent>
        </Card>
      ))}

      {/* Formulario para nuevo comentario */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="subtitle1">Añadir comentario</Typography>

          <TextField
            label="Texto"
            value={nuevoComentario.texto || ""}
            onChange={e => handleChange("texto", e.target.value)}
            multiline
            rows={3}
            fullWidth
            sx={{ mb: 1 }}
          />

          <TextField
            select
            label="Valoración"
            value={nuevoComentario.valoracion || ""}
            onChange={e => handleChange("valoracion", Number(e.target.value))}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            SelectProps={{
                MenuProps: {
                anchorOrigin: {
                    vertical: "bottom", // fuerza a abrir hacia abajo
                    horizontal: "left",
                },
                transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                },
                },
            }}
            >
            <MenuItem value="" disabled>Seleccione valoración</MenuItem>
            {[1, 2, 3, 4, 5].map(n => (
                <MenuItem key={n} value={n}>{n}</MenuItem>
            ))}
            </TextField>

          <Button variant="contained" fullWidth onClick={handleSubmit}>Guardar</Button>
        </CardContent>
      </Card>
    </Box>
  );
};
