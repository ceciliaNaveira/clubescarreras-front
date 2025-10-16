import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { type Club } from "../services/clubService";

import { getClubs } from "../services/clubService"; // Usaremos getClubsByDiaSemana si quieres filtrar, pero aquí solo un club

export const ClubDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchClub = async () => {
    setLoading(true);
    try {
      // Obtener todos los clubes y filtrar por ID (porque no tenemos getClubById en el service)
      const clubs = await getClubs();
      const found = clubs.find(c => c.idClub.toString() === id);
      setClub(found ?? null);
      console.log("Club encontrado:", found);
    } catch (err) {
      console.error("Error al cargar club:", err);
      setClub(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClub();
  }, [id]);

  if (loading) return <p>Cargando club...</p>;
  if (!club) return <p>No se encontró el club</p>;

  return (
    <div>
      <h1>{club.nombre}</h1>
      <p>{club.descripcion}</p>
      <p>
        Contacto: {club.contacto} | Web: <a href={club.web}>{club.web}</a>
      </p>
      <p>
        Localización: {club.localizacion.provincia}, {club.localizacion.municipio} (
        {club.localizacion.codigoPostal})<br/>
        Dirección: {club.localizacion.direccion}
      </p>

      {club.entrenamientos && club.entrenamientos.length > 0 && (
        <>
          <h2>Entrenamientos</h2>
          <ul>
            {club.entrenamientos.map(e => (
              <li key={e.idEntrenamiento}>
                {e.diaSemana} - {e.lugarEntrenamiento} - {e.nivel} <br/>
                {e.descripcion}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
