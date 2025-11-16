import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Button, Rating, MenuItem } from "@mui/material";
import { useUsuario } from "../context/UsuarioContext";
import { type ComentarioRequest, createComentario, updateComentario, getComentariosByClubId } from "../services/comentarioService";

type ClubCommentsProps = {
  clubId: number;
};

export const ClubComments = ({ clubId }: ClubCommentsProps) => {
  const { usuario } = useUsuario();
  const usuarioId = usuario?.usuarioId;
  const usuarioNombre = usuario?.nombre || "";

  const [comentarios, setComentarios] = useState<any[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState<Partial<ComentarioRequest>>({});
  const [loading, setLoading] = useState(true);
  const [comentarioExistente, setComentarioExistente] = useState<ComentarioRequest | null>(null);

  useEffect(() => {
    const fetchComentarios = async () => {
      setLoading(true);
      try {
        const coms = await getComentariosByClubId(clubId);
        setComentarios(coms);

        if (usuarioId) {
          const existente = coms.find(c => c.usuarioId === usuarioId);
          if (existente) {
            setComentarioExistente(existente);
            setNuevoComentario({
              texto: existente.texto,
              valoracion: existente.valoracion
            });
          }
        }
      } catch (err) {
        console.error("Error cargando comentarios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComentarios();
  }, [clubId, usuarioId]);

  const handleChange = (field: keyof ComentarioRequest, value: any) => {
    setNuevoComentario(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!nuevoComentario.texto || !nuevoComentario.valoracion) {
      alert("Rellene todos los campos obligatorios");
      return;
    }

    if (!usuarioId) {
      alert("Debe estar logueado para comentar");
      return;
    }

    const payload: ComentarioRequest = {
      usuarioId,
      clubId,
      texto: nuevoComentario.texto.trim(),
      valoracion: Number(nuevoComentario.valoracion),
    };

    try {
      if (comentarioExistente) {
        await updateComentario(comentarioExistente.comentarioId, payload);
        setComentarioExistente({
          ...comentarioExistente,
          texto: payload.texto,
          valoracion: payload.valoracion
        });
      } else {
        const nuevo = await createComentario(payload);
        setComentarioExistente(nuevo);
      }

      const updated = await getComentariosByClubId(clubId);
      setComentarios(updated);

      setNuevoComentario({
        texto: payload.texto,
        valoracion: payload.valoracion
      });
    } catch (err) {
      console.error("Error al crear/actualizar comentario:", err);
      alert("Error al crear/actualizar comentario");
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
      <Box 
        sx={{ 
          mb: 2, 
          display: "flex", 
          alignItems: "center", 
          gap: 1, 
          p: 2, 
          bgcolor: "background.paper", 
          borderRadius: 1, 
          boxShadow: 1 
        }}
      >
        <Typography component="p">Valoración media:</Typography>
        <Rating value={valoracionMedia} precision={0.5} readOnly aria-label={`Valoración media ${valoracionMedia} sobre 5`} />
        <Typography component="p">({comentarios.length} comentarios)</Typography>
      </Box>

      {/* Lista de comentarios */}
      {comentarios.map((c, index) => (
        <Card key={`${c.usuarioId}-${c.clubId}-${index}`} sx={{ mb: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" component="p">{c.usuarioNombre}</Typography>
            <Rating value={c.valoracion} readOnly size="small" aria-label={`Valoración del usuario ${c.usuarioNombre}: ${c.valoracion} sobre 5`} />
            <Typography component="p">{c.texto}</Typography>
          </CardContent>
        </Card>
      ))}

      {/* Formulario para nuevo comentario */}
    {usuarioId && (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{ color: "text.primary" }}
          >
            {comentarioExistente ? "Editar comentario" : "Añadir comentario"}
          </Typography>

          <TextField
            id="comentario-texto"
            label="Texto"
            value={nuevoComentario.texto || ""}
            onChange={e => handleChange("texto", e.target.value)}
            multiline
            rows={3}
            fullWidth
            sx={{ mt:2, mb: 1, input: { color: "text.primary" }, label: { color: "text.primary" } }}
            inputProps={{ "aria-required": true }}
          />

          <TextField
            id="comentario-valoracion"
            select
            label="Valoración"
            value={nuevoComentario.valoracion || ""}
            onChange={e => handleChange("valoracion", Number(e.target.value))}
            fullWidth
            size="small"
            sx={{ 
              mt:2,
              mb: 1, 
              input: { color: "text.primary" }, 
              label: { color: "text.primary" } 
            }}
            inputProps={{ "aria-required": true, "aria-label": "Valoración del comentario" }}
          >
            <MenuItem value="" disabled aria-label="Seleccione una valoración">
              Seleccione valoración
            </MenuItem>
            {[1, 2, 3, 4, 5].map(n => (
              <MenuItem key={n} value={n}>{n}</MenuItem>
            ))}
          </TextField>

          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleSubmit} 
            aria-label={comentarioExistente ? "Actualizar comentario" : "Guardar comentario"}
          >
            {comentarioExistente ? "Actualizar" : "Guardar"}
          </Button>
        </CardContent>
      </Card>
    )}
    </Box>
  );
};
