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

  // Cargar comentarios del club
  useEffect(() => {
    const fetchComentarios = async () => {
      setLoading(true);
      try {
        const coms = await getComentariosByClubId(clubId);
        setComentarios(coms);
        console.log("Comentarios cargados:", coms);

        // Buscar comentario del usuario logueado
        if (usuarioId) {
          const existente = coms.find(c => c.usuarioId === usuarioId);
          if (existente) {
            setComentarioExistente(existente);
            setNuevoComentario({
              texto: existente.texto,
              valoracion: existente.valoracion
            });
            console.log("Comentario existente del usuario:", existente);
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
    console.log(`Campo cambiado: ${field} =>`, value);
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

  console.log("Comentario a enviar:", payload);

  try {
    if (comentarioExistente) {
      console.log("Actualizando comentario existente...");
      // Usar comentarioId en lugar de id
      await updateComentario(comentarioExistente.comentarioId, payload);

      // Mantener comentarioExistente actualizado
      setComentarioExistente({
        ...comentarioExistente,
        texto: payload.texto,
        valoracion: payload.valoracion
      });
    } else {
      console.log("Creando nuevo comentario...");
      const nuevo = await createComentario(payload);
      // Guardar el nuevo comentario con su comentarioId devuelto por el backend
      setComentarioExistente(nuevo);
    }

    // Recargar la lista de comentarios
    const updated = await getComentariosByClubId(clubId);
    setComentarios(updated);

    // Mantener los datos en el formulario para posible edición
    setNuevoComentario({
      texto: payload.texto,
      valoracion: payload.valoracion
    });

    console.log("Comentarios actualizados:", updated);
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
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography>Valoración media:</Typography>
        <Rating value={valoracionMedia} precision={0.5} readOnly />
        <Typography>({comentarios.length} comentarios)</Typography>
      </Box>

      {/* Lista de comentarios */}
      {comentarios.map((c, index) => (
        <Card key={`${c.usuarioId}-${c.clubId}-${index}`} sx={{ mb: 1 }}>
          <CardContent>
            <Typography variant="subtitle2">{c.usuarioNombre}</Typography>
            <Rating value={c.valoracion} readOnly size="small" />
            <Typography>{c.texto}</Typography>
          </CardContent>
        </Card>
      ))}

      {/* Formulario para nuevo comentario */}
      {usuarioId && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="subtitle1">
              {comentarioExistente ? "Editar comentario" : "Añadir comentario"}
            </Typography>

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
            >
              <MenuItem value="" disabled>Seleccione valoración</MenuItem>
              {[1, 2, 3, 4, 5].map(n => (
                <MenuItem key={n} value={n}>{n}</MenuItem>
              ))}
            </TextField>

            <Button variant="contained" fullWidth onClick={handleSubmit}>
              {comentarioExistente ? "Actualizar" : "Guardar"}
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
