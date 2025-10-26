// src/pages/admin/AdminUsuarios.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Usuario, getUsuarios, deleteUsuario } from "../../services/usuarioService";
import { type Rol, getRoles } from "../../services/rolService";
import { AdminTable } from "../../components/AdminTable";

export const AdminUsuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const [allUsuarios, allRoles] = await Promise.all([getUsuarios(), getRoles()]);
      setUsuarios(allUsuarios);
      setRoles(allRoles);
    } catch (err) {
      console.error(err);
      setUsuarios([]);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleEliminarUsuario = async (usuarioId: number) => {
    if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;
    try {
      await deleteUsuario(usuarioId);
      setUsuarios(usuarios.filter((u) => u.usuarioId !== usuarioId));
    } catch (err) {
      console.error(err);
      alert("NO SE PUDO ELIMINAR EL USUARIO.\nEs posible que tenga datos asociados.");
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;
  if (!usuarios.length) return <p>No hay usuarios disponibles</p>;

  return (
    <AdminTable
      columns={[
        { key: "nombre", label: "Nombre" },
        { key: "email", label: "Email" },
        {
          key: "rol",
          label: "Rol",
          render: (u) => roles.find((r) => r.rolId === u.rolId)?.nombreRol ?? "",
        },
      ]}
      data={usuarios}
      loading={loading}
      loadingMessage="Cargando usuarios..."
      emptyMessage="No hay usuarios disponibles"
      createLabel="Crear nuevo usuario"
      onCreate={() => navigate("/admin/usuarios/nuevo")}
      onEdit={(u) => navigate(`/admin/usuarios/editar/${u.usuarioId}`)}
      onDelete={(u) => handleEliminarUsuario(u.usuarioId)}
    />
  );
};
