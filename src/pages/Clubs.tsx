// src/pages/Clubs.tsx
import { ListPage } from "../components/ListPage";

interface Club {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
}

const clubs: Club[] = [
  { id: "1", name: "Club Atletismo Coruña", lat: 43.3623, lng: -8.4115, description: "Entrenamientos para todas las edades en A Coruña." },
  { id: "2", name: "Vigo Runners", lat: 42.2408, lng: -8.7223, description: "Club urbano para corredores en Vigo." },
  { id: "3", name: "Lugo Trail", lat: 43.0047, lng: -7.5560, description: "Especializado en trail running en Lugo." },
  { id: "4", name: "Ourense Sprint", lat: 42.3438, lng: -7.8632, description: "Club para sprint y carreras cortas en Ourense." },
  { id: "5", name: "Pontevedra Marathon Club", lat: 42.4333, lng: -8.6444, description: "Club de maratón en Pontevedra." },
];

export const Clubs = () => {
  return (
    <ListPage
      title="Clubes Deportivos en Galicia"
      description="Descubre los clubes deportivos más destacados en Galicia."
      items={clubs.map(c => ({
        id: c.id,
        label: c.name,
        lat: c.lat,
        lng: c.lng,
        description: c.description
      }))}
      getDetailLink={(club) => `/clubs/${club.id}`}
    />
  );
};
