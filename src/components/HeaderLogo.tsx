import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";

export const HeaderLogo = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="h1" // Esto define el encabezado principal
      onClick={() => navigate("/")}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        cursor: "pointer",
        "&:hover": { opacity: 0.8 },
        fontSize: 0, // Oculta texto visual dentro del h1 para que solo se vea la imagen y el span
      }}
    >
      <Box
        component="img"
        src={Logo}
        alt="Bule, ven - Logo" // texto descriptivo accesible
        sx={{ height: 85 }}
      />
      <Box
        component="span"
        sx={{
          fontFamily: '"Avenir Next Heavy Italic", AvenirNext, sans-serif',
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 32,
          color: "text.primary",
          letterSpacing: 1,
          ml: 1,
        }}
      >
        Bule, ven
      </Box>
    </Box>
  );
};
