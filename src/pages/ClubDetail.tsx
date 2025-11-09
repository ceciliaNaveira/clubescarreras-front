import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { type Club, getClubById } from "../services/clubService";
import { type Localizacion, getLocalizacionById } from "../services/localizacionService";
import { type Entrenamiento, getEntrenamientosByClubId } from "../services/entrenamientoService";
import { Box, Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, Grid } from "@mui/material";
import TitleDescription from "../components/TitleDescription";
import { ClubComments } from "../components/ClubComments";
import { FavoriteButton } from "../components/FavoriteButton";

export const ClubDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<Club & { entrenamientos?: Entrenamiento[]; localizacion?: Localizacion } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClub = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const c: Club = await getClubById(Number(id));
        const loc: Localizacion = await getLocalizacionById(c.localizacionId);
        const entrenamientos: Entrenamiento[] = await getEntrenamientosByClubId(c.clubId);

        setClub({ ...c, localizacion: loc, entrenamientos });
      } catch (err) {
        console.error(err);
        setClub(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [id]);

  if (loading) return <p>Cargando detalles del club...</p>;
  if (!club) return <p>Club no encontrado</p>;

  const diaOrden: Record<string, number> = {
    "Lunes": 1, "Martes": 2, "Miércoles": 3,
    "Jueves": 4, "Viernes": 5, "Sábado": 6, "Domingo": 7
  };

  return (
    <Box sx={{ px: 4, py: 3 }}>
      {/* Título y botón favorito */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <TitleDescription title={club.nombre} description={club.descripcion} /> 
        <FavoriteButton tipo="club" id={club.clubId} />
      </Box>

      {/* Entrenamientos arriba, ocupando todo el ancho */}
      {club.entrenamientos && club.entrenamientos.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6">Entrenamientos</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Día</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Lugar</TableCell>
                  <TableCell>Nivel</TableCell>
                  <TableCell>Descripción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {club.entrenamientos
                  .sort((a, b) => {
                    const diaA = diaOrden[a.diaSemana] || 0;
                    const diaB = diaOrden[b.diaSemana] || 0;
                    if (diaA !== diaB) return diaA - diaB;
                    return a.hora.localeCompare(b.hora);
                  })
                  .map(e => (
                    <TableRow key={e.entrenamientoId}>
                      <TableCell>{e.diaSemana}</TableCell>
                      <TableCell>{e.hora?.substring(0,5)}</TableCell>
                      <TableCell>{e.lugarEntrenamiento}</TableCell>
                      <TableCell>{e.nivel}</TableCell>
                      <TableCell>{e.descripcion}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Comentarios y datos/localización en columnas */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Comentarios - ocupa el resto */}
        <Grid item xs={12} md sx={{ flexGrow: 1, minWidth: 0 }}>
          <ClubComments clubId={club.clubId} />
        </Grid>

        {/* Columna derecha - ancho fijo */}
        <Grid item xs={12} md="auto" sx={{ width: 250 }}>
          {club.localizacion && (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Localización</Typography>
                <Typography>Dirección: {club.localizacion.direccion}</Typography>
                <Typography>{club.localizacion.municipio}, {club.localizacion.provincia} ({club.localizacion.codigoPostal})</Typography>
                <Typography>Lat/Lng: {club.localizacion.latitud}, {club.localizacion.longitud}</Typography>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent>
              <Typography variant="h6">Datos del club</Typography>
              <Typography>Contacto: {club.contacto}</Typography>
              <Typography>Web: <a href={club.web} target="_blank">{club.web}</a></Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
