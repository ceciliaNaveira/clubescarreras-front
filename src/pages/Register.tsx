import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BlueButton, OrangeButton } from "../components/CustomButton";
import { CustomTextField } from "../components/CustomTextField";
import { saveUsuario } from "../services/usuarioService";

export const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    contraseña: "",
    confirmContraseña: ""
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.nombre || !form.email || !form.contraseña || !form.confirmContraseña) {
      alert("Rellene todos los campos");
      return;
    }
    if (form.contraseña !== form.confirmContraseña) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      await saveUsuario({
        nombre: form.nombre,
        email: form.email,
        contraseña: form.contraseña,
        rolId: 3 // siempre rol de usuario
      });
      alert("Usuario creado correctamente");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Error creando usuario");
    }
  };

  return (
    <Box sx={{ px: 2, py: 4, display: "flex", justifyContent: "center" }}>
      <Box sx={{ p: 4, width: 400, display: "flex", flexDirection: "column", gap: 3, borderRadius: 3, backgroundColor: "background.paper", textAlign: "center", boxShadow: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>Crear cuenta</Typography>

        <CustomTextField placeholder="Ingresa tu nombre de usuario" value={form.nombre} onChange={e => handleChange("nombre", e.target.value)} />
        <CustomTextField placeholder="Ingresa tu email" value={form.email} onChange={e => handleChange("email", e.target.value)} />
        <CustomTextField placeholder="Ingresa tu contraseña" type="password" value={form.contraseña} onChange={e => handleChange("contraseña", e.target.value)} />
        <CustomTextField placeholder="Confirma tu contraseña" type="password" value={form.confirmContraseña} onChange={e => handleChange("confirmContraseña", e.target.value)} />

        <BlueButton fullWidth onClick={handleSubmit}>Registrarse</BlueButton>

        <Typography sx={{ color: "text.primary", mt: 1 }}>
          ¿Ya tienes cuenta? <OrangeButton onClick={() => navigate("/login")}>Inicia sesión aquí</OrangeButton>
        </Typography>
      </Box>
    </Box>
  );
};
