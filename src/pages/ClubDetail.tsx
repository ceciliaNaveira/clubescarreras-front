import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import type { Club, Localizacion, Entrenamiento } from "../services/clubService";
import { getClubById, getLocalizacionById, getEntrenamientosByClubId } from "../services/clubService";
import TitleDescription from "../components/TitleDescription";

export const ClubDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClub = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const c: Club = await getClubById(Number(id));
        const loc: Localizacion = await getLocalizacionById(c.localizacionId);
        const entrenamientos: Entrenamiento[] = await getEntrenamientosByClubId(c.idClub);

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
      {/* Título y descripción */}
      <TitleDescription title={club.nombre} description={club.descripcion} />

      {/* Fila 1: Entrenamientos */}
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
                    <TableRow key={e.idEntrenamiento}>
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

      {/* Fila 2: Localización + Datos del club */}
      <Box sx={{ display: "flex", gap: 3, mt: 3, flexWrap: "wrap" }}>
        {/* Card: Localización */}
        {club.localizacion && (
          <Card sx={{ flex: 1, minWidth: 250 }}>
            <CardContent>
              <Typography variant="h6">Localización</Typography>
              <Typography>Dirección: {club.localizacion.direccion}</Typography>
              <Typography>{club.localizacion.municipio}, {club.localizacion.provincia} ({club.localizacion.codigoPostal})</Typography>
              <Typography>Lat/Lng: {club.localizacion.latitud}, {club.localizacion.longitud}</Typography>
            </CardContent>
          </Card>
        )}

        {/* Card: Datos del club */}
        <Card sx={{ flex: 1, minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6">Datos del club</Typography>
            <Typography>Contacto: {club.contacto}</Typography>
            <Typography>
              Web: <a href={club.web} target="_blank">{club.web}</a>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
