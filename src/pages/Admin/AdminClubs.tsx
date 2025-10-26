import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Club, getClubs, deleteClub } from "../../services/clubService";
import { type Localizacion, getLocalizacionById } from "../../services/localizacionService";
import { AdminTable } from "../../components/AdminTable";

export const AdminClubs = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const allClubs = await getClubs();
      const clubsWithLoc = await Promise.all(
        allClubs.map(async (c) => {
          const loc: Localizacion = await getLocalizacionById(c.localizacionId);
          return { ...c, localizacion: loc };
        })
      );
      setClubs(clubsWithLoc);
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

  const handleEliminarClub = async (clubId: number) => {
    if (!confirm("¿Seguro que quieres eliminar este club?")) return;
    try {
      await deleteClub(clubId);
      setClubs(clubs.filter((c) => c.clubId !== clubId));
    } catch (err) {
      console.error(err);
      alert(
      "NO SE PUDO ELIMINAR EL CLUB.\nEs posible que tenga entrenamientos u otros datos asociados.\nCOMPRUEBE EN EDITAR."
    );
    }
  };

  if (loading) return <p>Cargando clubes...</p>;
  if (!clubs.length) return <p>No hay clubes disponibles</p>;

  return (
    <AdminTable
      columns={[
        { key: "nombre", label: "Nombre" },
        { key: "provincia", label: "Provincia", render: (c) => c.localizacion?.provincia },
        { key: "municipio", label: "Municipio", render: (c) => c.localizacion?.municipio },
      ]}
      data={clubs}
      loading={loading}
      loadingMessage="Cargando clubes..."
      emptyMessage="No hay clubes disponibles"
      createLabel="Crear nuevo club"
      onCreate={() => navigate("/admin/clubs/nuevo")}
      onEdit={(c) => navigate(`/admin/clubs/editar/${c.clubId}`)}
      onDelete={(c) => handleEliminarClub(c.clubId)}
    />
  );
};