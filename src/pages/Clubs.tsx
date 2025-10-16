import { useEffect, useState } from "react";
import { ListPage } from "../components/ListPage";
import { type Club, getClubs, getClubsByDiaSemana } from "../services/clubService";

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export const Clubs = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [diaSemanaFiltro, setDiaSemanaFiltro] = useState<string>("");

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const data = diaSemanaFiltro
        ? await getClubsByDiaSemana(diaSemanaFiltro)
        : await getClubs();
      console.log("Clubs recibidos:", data);
      setClubs(data ?? []);
    } catch (err) {
      console.error("Error al cargar clubes:", err);
      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs(); // Cargar todos los clubes al inicio
  }, []);

  const handleFiltro = () => {
    fetchClubs();
  };

  if (loading) return <p>Cargando clubes...</p>;
  if (!clubs || clubs.length === 0) return <p>No hay clubes disponibles</p>;

  return (
    <div>
      <h1>Clubes Deportivos en Galicia</h1>
      <p>Descubre los clubes deportivos más destacados en Galicia.</p>

      <div style={{ marginBottom: "1rem" }}>
        <label>Filtrar por día de la semana: </label>
        <select value={diaSemanaFiltro} onChange={e => setDiaSemanaFiltro(e.target.value)}>
          <option value="">Todos</option>
          {DIAS_SEMANA.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <button style={{ marginLeft: "1rem" }} onClick={handleFiltro}>Filtrar</button>
      </div>

      <ListPage
        title=""
        description=""
        items={clubs.map(c => ({
          id: c.idClub.toString(),
          label: c.nombre ?? "Sin nombre",
          lat: c.localizacion.latitud,
          lng: c.localizacion.longitud,
          description: c.descripcion ?? "",
        }))}
        getDetailLink={club => `/clubs/${club.id}`}
      />
    </div>
  );
};
