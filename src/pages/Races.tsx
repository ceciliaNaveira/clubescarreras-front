import { useEffect, useState } from "react";
import { Box, TextField } from "@mui/material";

import { type Carrera, getCarreras } from "../services/carreraService";
import { type Localizacion, getLocalizacionById } from "../services/localizacionService";
import SearchBar from "../components/SearchBar";
import TitleDescription from "../components/TitleDescription";
import { ListPage } from "../components/ListPage";

export const Races = () => {
  const [carreras, setCarreras] = useState<(Carrera & { localizacion?: Localizacion })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [distanciaFiltro, setDistanciaFiltro] = useState<string>("");
  const [ordenFecha, setOrdenFecha] = useState<"asc" | "desc">("asc");

  const fetchCarreras = async () => {
    setLoading(true);
    try {
      const allCarreras = await getCarreras();

      const carrerasWithLoc = await Promise.all(
        allCarreras.map(async (c) => {
          try {
            const loc = await getLocalizacionById(c.localizacionId);
            return { ...c, localizacion: loc };
          } catch {
            return { ...c, localizacion: undefined };
          }
        })
      );

      setCarreras(carrerasWithLoc);
    } catch (err) {
      console.error("Error al cargar carreras", err);
      setCarreras([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarreras();
  }, []);

  if (loading) return <p>Cargando carreras...</p>;
  if (!carreras.length) return <p>No hay carreras disponibles</p>;

  let filteredCarreras = carreras.filter((c) => {
    const matchName = c.nombre?.toLowerCase().includes(search.toLowerCase()) ?? false;
    const matchDistancia =
      !distanciaFiltro || (c.distanciaKm && c.distanciaKm <= Number(distanciaFiltro));
    return matchName && matchDistancia;
  });

  filteredCarreras = filteredCarreras.sort((a, b) => {
    const fechaA = new Date(a.fecha).getTime();
    const fechaB = new Date(b.fecha).getTime();
    return ordenFecha === "asc" ? fechaA - fechaB : fechaB - fechaA;
  });

  return (
    <div>
      {/* Título y descripción */}
      <Box sx={{ px: 2, mt: 2, mb: 2 }}>
        <TitleDescription
          title="Carreras en Galicia"
          description="Descubre las carreras populares más interesantes y participa en la que más te motive."
        />
      </Box>

      {/* Buscador + filtros */}
      <Box sx={{ px: 4, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
        {/* Buscador por nombre */}
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <SearchBar search={search} setSearch={setSearch} />
        </Box>

        {/* Filtro por distancia */}
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <TextField
            label="Distancia máxima (km)"
            variant="outlined"
            size="small"
            fullWidth
            type="number"
            value={distanciaFiltro}
            onChange={(e) => setDistanciaFiltro(e.target.value)}
          />
        </Box>

        {/* Ordenar por fecha */}
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <TextField
            select
            label="Ordenar por fecha"
            value={ordenFecha}
            onChange={(e) => setOrdenFecha(e.target.value as "asc" | "desc")}
            SelectProps={{ native: true }}
            fullWidth
            size="small"
            InputProps={{ sx: { height: 40, py: 0.8 , color:"#0E2B40"} }}
          >
            <option value="asc">Más próximas</option>
            <option value="desc">Más lejanas</option>
          </TextField>
        </Box>
      </Box>

      {/* Lista y mapa */}
      <ListPage
        title=""
        description=""
        items={filteredCarreras.map((c) => ({
          id: c.carreraId.toString(),
          label: c.nombre ?? "Sin nombre",
          lat: c.localizacion?.latitud ?? 0,
          lng: c.localizacion?.longitud ?? 0,
          description: `${c.distanciaKm ?? "-"} km | ${new Date(c.fecha).toLocaleDateString("es-ES")}`,
        }))}
        getDetailLink={(carrera) => `/races/${carrera.id}`}
        search={search}
      />
    </div>
  );
};
