import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BlueButton, OrangeButton } from "../components/CustomButton";
import { CustomTextField } from "../components/CustomTextField";

export const Register = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          p: 4,
          width: 400,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          borderRadius: 3,
          backgroundColor: "background.paper",
          textAlign: "center",
        }}
      >
        {/* Título */}
        <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
          Crear cuenta
        </Typography>

        {/* Formulario con label flotante y placeholder */}
        <CustomTextField placeholder="Ingresa tu nombre de usuario" />
        <CustomTextField placeholder="Ingresa tu email" />
        <CustomTextField placeholder="Ingresa tu contraseña" type="password" />
        <CustomTextField placeholder="Confirma tu contraseña" type="password" />

        {/* Botón de registro */}
        <BlueButton fullWidth onClick={() => alert("Registro enviado")}>
          Registrarse
        </BlueButton>

        {/* Enlace a login */}
        <Typography sx={{ color: "text.primary", mt: 1 }}>
          ¿Ya tienes cuenta?{" "}
          <OrangeButton onClick={() => navigate("/login")}>
            Inicia sesión aquí
          </OrangeButton>
        </Typography>
      </Box>
    </Box>
  );
};
