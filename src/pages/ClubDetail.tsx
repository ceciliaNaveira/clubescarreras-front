// src/pages/ClubDetail.tsx
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const clubsData = [
  { id: "1", name: "Club Atletismo Coruña", description: "Entrenamientos para todas las edades en A Coruña." },
  { id: "2", name: "Vigo Runners", description: "Club urbano para corredores en Vigo." },
  { id: "3", name: "Lugo Trail", description: "Especializado en trail running en Lugo." },
  { id: "4", name: "Ourense Sprint", description: "Club para sprint y carreras cortas en Ourense." },
  { id: "5", name: "Pontevedra Marathon Club", description: "Club de maratón en Pontevedra." },
];

export const ClubDetail = () => {
  const { id } = useParams();
  const club = clubsData.find(c => c.id === id);

  if (!club) return <Typography sx={{ p: 4 }}>Club no encontrado</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">{club.name}</Typography>
      <Typography sx={{ mt: 2 }}>{club.description}</Typography>
    </Box>
  );
};
