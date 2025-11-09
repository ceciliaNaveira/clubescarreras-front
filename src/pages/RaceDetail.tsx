import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { type Carrera, getCarreraById } from "../services/carreraService";
import { type Localizacion, getLocalizacionById } from "../services/localizacionService";
import posterCarrera from "../assets/CartelCarrera.png"
import { FavoriteButton } from "../components/FavoriteButton";

import {
  Box,
  Card,
  CardContent,
  Typography
} from "@mui/material";
import TitleDescription from "../components/TitleDescription";

export const RaceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [carrera, setCarrera] = useState<Carrera | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarrera = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Obtener datos de la carrera
        const c: Carrera = await getCarreraById(Number(id));

        // Obtener la localización asociada
        const loc: Localizacion = await getLocalizacionById(c.localizacionId);

        // Guardar todo junto en el estado
        setCarrera({ ...c, localizacion: loc });
      } catch (err) {
        console.error("Error al cargar detalles de la carrera:", err);
        setCarrera(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCarrera();
  }, [id]);

  if (loading) return <p>Cargando detalles de la carrera...</p>;
  if (!carrera) return <p>Carrera no encontrada</p>;

  return (
    <Box sx={{ px: 4, py: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <TitleDescription title={carrera.nombre} description={carrera.descripcion} />
        <FavoriteButton tipo="carrera" id={carrera.carreraId} />
      </Box>

      {/* Información principal */}
      <Box sx={{ display: "flex", gap: 3, mt: 3, flexWrap: "wrap" }}>
        <Card sx={{ flex: 1, minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Detalles de la carrera</Typography>
            <Typography>Fecha: {carrera.fecha}</Typography>
            {carrera.distanciaKm && <Typography>Distancia: {carrera.distanciaKm} km</Typography>}
            {carrera.clubNombre && <Typography>Organiza: {carrera.clubNombre}</Typography>}
            {carrera.webOficial && (
              <Typography>
                Web:{" "}
                <a 
                  href={carrera.webOficial} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: "#fff", textDecoration: "underline" }} // texto blanco
                >
                  {carrera.webOficial}
                </a>
              </Typography>
            )}
            <Box sx={{ mt: 2 }}>
              <img
                src={posterCarrera}
                alt={`Cartel de ${carrera.nombre}`}
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Localización */}
        {carrera.localizacion && (
          <Card sx={{ flex: 1, minWidth: 250 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Localización</Typography>
              <Typography>Dirección: {carrera.localizacion.direccion}</Typography>
              <Typography>
                {carrera.localizacion.municipio}, {carrera.localizacion.provincia} ({carrera.localizacion.codigoPostal})
              </Typography>
              <Typography>
                Lat/Lng: {carrera.localizacion.latitud}, {carrera.localizacion.longitud}
              </Typography>

              {/* Mapa embebido */}
              <Box sx={{ mt: 2 }}>
                <iframe
                  title="Mapa de localización"
                  width="100%"
                  height="250"
                  style={{ border: 0, borderRadius: 8 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${carrera.localizacion.latitud},${carrera.localizacion.longitud}&hl=es&z=14&output=embed`}
                ></iframe>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};
