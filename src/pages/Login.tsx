// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { BlueButton, OrangeButton } from "../components/CustomButton";
import { CustomTextField } from "../components/CustomTextField";
import { useUsuario } from "../context/UsuarioContext";
import { loginUsuario } from "../services/usuarioService";

export const Login = () => {
  const navigate = useNavigate();
  const { setUsuario } = useUsuario();
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      const usuario = await loginUsuario(email, contraseña);

      localStorage.setItem("usuario", JSON.stringify(usuario));
      setUsuario(usuario);

      navigate("/");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "background.default" }}>
      <Box sx={{ p: 4, width: 350, display: "flex", flexDirection: "column", gap: 2, borderRadius: 3, backgroundColor: "background.paper", textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>Iniciar sesión</Typography>

        <CustomTextField placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <CustomTextField placeholder="Contraseña" type="password" value={contraseña} onChange={e => setContraseña(e.target.value)} />

        {error && <Typography sx={{ color: "red" }}>{error}</Typography>}

        <BlueButton fullWidth onClick={handleLogin}>Entrar</BlueButton>

        <Typography sx={{ color: "text.primary", mt: 1 }}>
          ¿Todavía no estás registrado?{" "}
          <OrangeButton onClick={() => navigate("/register")}>Regístrate aquí</OrangeButton>
        </Typography>
      </Box>
    </Box>
  );
};
