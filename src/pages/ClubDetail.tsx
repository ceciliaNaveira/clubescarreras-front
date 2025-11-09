import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { type Club, getClubById } from "../services/clubService";
import { type Localizacion, getLocalizacionById } from "../services/localizacionService";
import { type Entrenamiento, getEntrenamientosByClubId } from "../services/entrenamientoService";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import TitleDescription from "../components/TitleDescription";
import { ClubComments } from "../components/ClubComments";
import { FavoriteButton } from "../components/FavoriteButton";

export const ClubDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<Club & { entrenamientos?: Entrenamiento[]; localizacion?: Localizacion } | null>(null);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    Lunes: 1,
    Martes: 2,
    Miércoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sábado: 6,
    Domingo: 7,
  };

  return (
    <Box sx={{ px: isMobile ? 2 : 4, py: 3 }}>
      {/* Título y botón favorito */}
      <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 2 : 0 }}>
        <TitleDescription
          title={club.nombre}
          description={club.descripcion}
          titleVariant={isMobile ? "h5" : "h4"}
        />
        <FavoriteButton tipo="club" id={club.clubId} />
      </Box>

      {/* Entrenamientos */}
      {club.entrenamientos && club.entrenamientos.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant={isMobile ? "subtitle1" : "h6"} component="h3">
              Entrenamientos
            </Typography>

            {isMobile ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                {club.entrenamientos
                  .sort((a, b) => {
                    const diaA = diaOrden[a.diaSemana] || 0;
                    const diaB = diaOrden[b.diaSemana] || 0;
                    if (diaA !== diaB) return diaA - diaB;
                    return a.hora.localeCompare(b.hora);
                  })
                  .map(e => (
                    <Card key={e.entrenamientoId} sx={{ p: 2, backgroundColor: "background.default" }}>
                      <Typography component="p"><strong>Día:</strong> {e.diaSemana}</Typography>
                      <Typography component="p"><strong>Hora:</strong> {e.hora?.substring(0, 5)}</Typography>
                      <Typography component="p"><strong>Lugar:</strong> {e.lugarEntrenamiento}</Typography>
                      <Typography component="p"><strong>Nivel:</strong> {e.nivel}</Typography>
                      {e.descripcion && <Typography component="p"><strong>Descripción:</strong> {e.descripcion}</Typography>}
                    </Card>
                  ))}
              </Box>
            ) : (
              <Table size="small" aria-label="Tabla de entrenamientos">
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
                        <TableCell component="th" scope="row">{e.diaSemana}</TableCell>
                        <TableCell>{e.hora?.substring(0, 5)}</TableCell>
                        <TableCell>{e.lugarEntrenamiento}</TableCell>
                        <TableCell>{e.nivel}</TableCell>
                        <TableCell>{e.descripcion}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Comentarios y localización */}
      <Grid container spacing={3} sx={{ mt: 3, flexDirection: isMobile ? "column" : "row" }}>
        {/* Comentarios */}
        <Grid item xs={12} md sx={{ flexGrow: 1, minWidth: 0 }}>
          <ClubComments clubId={club.clubId} />
        </Grid>

        {/* Localización y datos del club */}
        <Grid item xs={12} md="auto" sx={{ width: isMobile ? "100%" : 250 }}>
          {club.localizacion && (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant={isMobile ? "subtitle1" : "h6"} component="h3">
                  Localización
                </Typography>
                <Typography component="p">Dirección: {club.localizacion.direccion}</Typography>
                <Typography component="p">
                  {club.localizacion.municipio}, {club.localizacion.provincia} ({club.localizacion.codigoPostal})
                </Typography>
                <Typography component="p">
                  Lat/Lng: {club.localizacion.latitud}, {club.localizacion.longitud}
                </Typography>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent>
              <Typography variant={isMobile ? "subtitle1" : "h6"} component="h3">
                Datos del club
              </Typography>
              <Typography component="p">Contacto: {club.contacto}</Typography>
              <Typography component="p">
                Web:{" "}
                <Box 
                  component="a"
                  href={club.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: 'text.primary', textDecoration: 'underline' }}
                >
                  {club.web}
                </Box>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
