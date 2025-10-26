import { useEffect, useState } from "react";
import type { Carrera } from "../../services/carreraService";
import { getCarreras, deleteCarrera } from "../../services/carreraService";
import { AdminTable } from "../../components/AdminTable";
import { useNavigate } from "react-router-dom";


export const AdminCarreras = () => {
  const navigate = useNavigate();

  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCarreras = async () => {
    setLoading(true);
    try {
      const allCarreras = await getCarreras();
      setCarreras(allCarreras);
    } catch (err) {
      console.error(err);
      setCarreras([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarreras();
  }, []);

  const handleEliminarCarrera = async (idCarrera: number) => {
    if (!confirm("¿Seguro que quieres eliminar esta carrera?")) return;
    try {
      await deleteCarrera(idCarrera);
      setCarreras(carreras.filter(c => c.carreraId !== idCarrera));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la carrera");
    }
  };

  if (loading) return <p>Cargando carreras...</p>;
  if (!carreras.length) return <p>No hay carreras disponibles</p>;

  return (
    <AdminTable
      columns={[
        { key: "nombre", label: "Nombre" },
        { key: "clubNombre", label: "Club", render: (c) => c.clubNombre || "-" },
        { key: "provincia", label: "Provincia" },
        { key: "municipio", label: "Municipio" },
      ]}
      data={carreras}
      loading={loading}
      loadingMessage="Cargando carreras..."
      emptyMessage="No hay carreras disponibles"
      createLabel="Crear nueva carrera"
      onCreate={() => navigate("/admin/carreras/nueva")}
      onEdit={(c) => navigate(`/admin/carreras/editar/${c.carreraId}`)}
      onDelete={(c) => handleEliminarCarrera(c.carreraId)}
    />
  );
};
