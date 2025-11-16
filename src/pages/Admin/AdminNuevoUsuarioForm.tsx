import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { type UsuarioRequest, saveUsuario } from "../../services/usuarioService";
import { type Rol, getRoles } from "../../services/rolService";

import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { TextInput } from "../../components/TextInput";
import { SelectInput } from "../../components/SelectInput";

export const AdminNuevoUsuarioForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<Partial<UsuarioRequest>>({});
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const allRoles = await getRoles();
        setRoles(allRoles);
      } catch (err) {
        console.error(err);
        alert("Error al cargar los roles");
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleUsuarioChange = (field: keyof UsuarioRequest, value: any) => {
    setUsuario(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!usuario.nombre || !usuario.email || !usuario.contraseña || !usuario.rolId) {
        alert("Debes completar todos los campos obligatorios");
        return;
      }

      await saveUsuario(usuario);
      navigate("/admin/usuarios");
    } catch (err) {
      console.error(err);
      alert("Error al guardar el usuario");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <Box sx={{ px: 4, mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: theme.palette.secondary.main }}
          onClick={() => navigate("/admin/usuarios")}
        >
          Volver
        </Button>
      </Box>

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          p: 3,
        }}
      >
        <h2 style={{ color: theme.palette.primary.main }}>Nuevo Usuario</h2>

        <TextInput
          label="Nombre"
          value={usuario.nombre || ""}
          onChange={val => handleUsuarioChange("nombre", val)}
          fullWidth
          required
        />

        <TextInput
          label="Email"
          type="email"
          value={usuario.email || ""}
          onChange={val => handleUsuarioChange("email", val)}
          fullWidth
          required
        />

        <TextInput
          label="Contraseña"
          type="password"
          value={usuario.contraseña || ""}
          onChange={val => handleUsuarioChange("contraseña", val)}
          fullWidth
          required
        />

        <SelectInput
          label="Rol"
          value={usuario.rolId || ""}
          onChange={val => handleUsuarioChange("rolId", Number(val))}
          options={roles.map(r => ({ value: r.rolId, label: r.nombreRol }))}
          fullWidth
          required
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
          <Button variant="outlined" color="secondary" onClick={() => navigate("/admin/usuarios")}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
