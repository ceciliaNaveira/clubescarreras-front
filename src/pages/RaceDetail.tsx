// src/pages/RaceDetail.tsx
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const racesData = [
  { id: "1", name: "Maratón de A Coruña", description: "Maratón anual con recorrido por el centro de la ciudad." },
  { id: "2", name: "Vigo Night Run", description: "Carrera nocturna de 5 km por Vigo, para todos los niveles." },
  { id: "3", name: "Lugo Trail", description: "Carrera de montaña en Lugo, con vistas espectaculares." },
  { id: "4", name: "Ourense 10K", description: "Carrera urbana de 10 km en Ourense." },
  { id: "5", name: "Pontevedra Run Fest", description: "Festival de carreras con distancias de 5K, 10K y media maratón." },
];

export const RaceDetail = () => {
  const { id } = useParams();
  const race = racesData.find(r => r.id === id);

  if (!race) return <Typography>Carrera no encontrada</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">{race.name}</Typography>
      <Typography sx={{ mt: 2 }}>{race.description}</Typography>
    </Box>
  );
};

