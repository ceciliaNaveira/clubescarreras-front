import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BlueButton, OrangeButton } from "../components/CustomButton";
import { CustomTextField } from "../components/CustomTextField";

export const Login = () => {
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
          width: 350,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: 3,
          backgroundColor: "background.paper",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
          Iniciar sesión
        </Typography>

        {/* Campos de formulario con el nuevo componente */}
        <CustomTextField placeholder="Ingresa tu nombre de usuario" />
        <CustomTextField placeholder="Ingresa tu contraseña" type="password" />

        {/* Botones */}
        <BlueButton fullWidth onClick={() => alert("Login")}>
          Entrar
        </BlueButton>

        <Typography sx={{ color: "text.primary", mt: 1 }}>
          ¿Todavía no estás registrado?{" "}
          <OrangeButton onClick={() => navigate("/register")}>
            Regístrate aquí
          </OrangeButton>
        </Typography>
      </Box>
    </Box>
  );
};
