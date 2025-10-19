import { useEffect, useState } from "react";
import type { Club, Localizacion, Entrenamiento } from "../services/clubService";
import { getClubs, getLocalizacionById, getEntrenamientosByClubId } from "../services/clubService";
import SearchBar from "../components/SearchBar";
import FiltroDiaSemana from "../components/FiltroDiaSemana";
import TitleDescription from "../components/TitleDescription";
import { Box } from "@mui/material";
import { ListPage } from "../components/ListPage";

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export const Clubs = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [diaSemanaFiltro, setDiaSemanaFiltro] = useState<string>("");

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const allClubs = await getClubs();

      const clubsWithDetails = await Promise.all(
        allClubs.map(async c => {
          const entrenamientos = await getEntrenamientosByClubId(c.idClub);
          const loc: Localizacion = await getLocalizacionById(c.localizacionId);
          return { ...c, entrenamientos, localizacion: loc };
        })
      );

      setClubs(clubsWithDetails);
    } catch (err) {
      console.error(err);
      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  if (loading) return <p>Cargando clubes...</p>;
  if (!clubs.length) return <p>No hay clubes disponibles</p>;

  // Filtrado combinado por búsqueda y día de entrenamiento
  const filteredClubs = clubs.filter(c => {
    const matchName = c.nombre?.toLowerCase().includes(search.toLowerCase()) ?? false;
    const matchDia =
      !diaSemanaFiltro ||
      (c.entrenamientos?.some(e => e.diaSemana === diaSemanaFiltro) ?? false);
    return matchName && matchDia;
  });

  return (
    <div>
      {/* Título y descripción */}
      <Box sx={{ px: 2, mt: 2, mb: 2 }}>
        <TitleDescription
          title="Clubes entrenamiento Galicia"
          description="Encuentra clubes donde preparar tu próxima carrera"
        />
      </Box>

      {/* Buscador + filtro por día */}
      <Box sx={{ px: 4, display: "flex", gap: 2, alignItems: "center"}}>
        <Box sx={{ flex: 1 }}>
          <SearchBar search={search} setSearch={setSearch} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <FiltroDiaSemana
            diaSemanaFiltro={diaSemanaFiltro}
            setDiaSemanaFiltro={setDiaSemanaFiltro}
            handleFiltro={() => {}} // ya no es necesario
            diasSemana={DIAS_SEMANA}
          />
        </Box>
      </Box>

      {/* Lista y mapa */}
      <ListPage
        title=""
        description=""
        items={filteredClubs.map(c => ({
          id: c.idClub.toString(),
          label: c.nombre ?? "Sin nombre",
          lat: c.localizacion?.latitud ?? 0,
          lng: c.localizacion?.longitud ?? 0,
          description: c.descripcion ?? "",
        }))}
        getDetailLink={club => `/clubs/${club.id}`}
        search={search} 
      />
    </div>
  );
};
