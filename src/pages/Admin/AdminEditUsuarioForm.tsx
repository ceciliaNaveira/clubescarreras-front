// src/pages/admin/AdminEditUsuarioForm.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { TextInput } from "../../components/TextInput";
import { SelectInput } from "../../components/SelectInput";

import { type Usuario, getUsuarioById, saveUsuario } from "../../services/usuarioService";
import { type Rol, getRoles } from "../../services/rolService";

export const AdminEditUsuarioForm = () => {
  const theme = useTheme();
  const { idUsuario } = useParams<{ idUsuario: string }>();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<Partial<Usuario>>({});
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (idUsuario) {
          const u = await getUsuarioById(Number(idUsuario));
          setUsuario(u);
        }
        const allRoles = await getRoles();
        setRoles(allRoles);
      } catch (err) {
        console.error("Error cargando usuario:", err);
        alert("No se pudo cargar el usuario");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idUsuario]);

  const handleChange = (field: keyof Usuario, value: any) => {
    setUsuario(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!usuario.nombre || !usuario.email || !usuario.rolId) {
        alert("Nombre, email y rol son obligatorios");
        return;
      }
      await saveUsuario(usuario);
      alert("Usuario guardado correctamente");
      navigate("/admin/usuarios");
    } catch (err) {
      console.error("Error guardando usuario:", err);
      alert("Error al guardar usuario");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando usuario...</p>;

  return (
    <Box sx={{ px: 4, mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: theme.palette.secondary.main }}
          onClick={() => navigate("/admin/usuarios")}
        >
          Volver
        </Button>
      </Box>

      {/* --- Usuario --- */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
        <h3 style={{ color: theme.palette.primary.main }}>Usuario</h3>

        <TextInput
          label="Nombre"
          value={usuario.nombre || ""}
          onChange={val => handleChange("nombre", val)}
        />

        <TextInput
          label="Email"
          value={usuario.email || ""}
          onChange={val => handleChange("email", val)}
        />

        <TextInput
          label="Contraseña"
          type="password"
          value={usuario.contraseña || ""}
          onChange={val => handleChange("contraseña", val)}
        />

        <SelectInput
          label="Rol"
          value={usuario.rolId || ""}
          onChange={val => handleChange("rolId", Number(val))}
          options={roles.map(r => ({ value: r.rolId, label: r.nombreRol }))}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>Guardar</Button>
      </Box>
    </Box>
  );
};
