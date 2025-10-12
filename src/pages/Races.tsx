// src/pages/Races.tsx
import { ListPage } from "../components/ListPage";

interface Race {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
}

const races: Race[] = [
  { id: "1", name: "Maratón de A Coruña", lat: 43.3623, lng: -8.4115, description: "Maratón anual con recorrido por el centro de la ciudad." },
  { id: "2", name: "Vigo Night Run", lat: 42.2408, lng: -8.7223, description: "Carrera nocturna de 5 km por Vigo, para todos los niveles." },
  { id: "3", name: "Lugo Trail", lat: 43.0047, lng: -7.5560, description: "Carrera de montaña en Lugo, con vistas espectaculares." },
  { id: "4", name: "Ourense 10K", lat: 42.3438, lng: -7.8632, description: "Carrera urbana de 10 km en Ourense." },
  { id: "5", name: "Pontevedra Run Fest", lat: 42.4333, lng: -8.6444, description: "Festival de carreras con distancias de 5K, 10K y media maratón." },
];

export const Races = () => {
  return (
    <ListPage
      title="Carreras en Galicia"
      description="Descubre las carreras populares más interesantes y participa en la que más te motive."
      items={races.map(r => ({
        id: r.id,
        label: r.name,
        lat: r.lat,
        lng: r.lng,
        description: r.description
      }))}
      getDetailLink={(race) => `/races/${race.id}`}
    />
  );
};
