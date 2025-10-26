// AdminComentarios.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Comentario, getComentarios, deleteComentario } from "../../services/comentarioService";
import { AdminTable } from "../../components/AdminTable";

export const AdminComentarios = () => {
  const navigate = useNavigate();
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComentarios = async () => {
    setLoading(true);
    try {
      const allComentarios = await getComentarios();
      setComentarios(allComentarios);
    } catch (err) {
      console.error(err);
      setComentarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComentarios();
  }, []);

  const handleEliminarComentario = async (comentarioId: number) => {
    if (!confirm("¿Seguro que quieres eliminar este comentario?")) return;
    try {
      await deleteComentario(comentarioId);
      setComentarios(comentarios.filter(c => c.comentarioId !== comentarioId));
    } catch (err) {
      console.error(err);
      alert("NO SE PUDO ELIMINAR EL COMENTARIO");
    }
  };

  if (loading) return <p>Cargando comentarios...</p>;
  if (!comentarios.length) return <p>No hay comentarios disponibles</p>;

  return (
    <AdminTable
      columns={[
        { key: "usuarioNombre", label: "Usuario" },
        { key: "clubNombre", label: "Club" },
        { key: "texto", label: "Comentario" },
        { key: "fecha", label: "Fecha" },
        { key: "valoracion", label: "Valoración" },
      ]}
      data={comentarios}
      loading={loading}
      loadingMessage="Cargando comentarios..."
      emptyMessage="No hay comentarios disponibles"
      createLabel="Crear nuevo comentario"
      onCreate={() => navigate("/admin/comentarios/nuevo")}
      onDelete={(c) => handleEliminarComentario(c.comentarioId)}
    />
  );
};
