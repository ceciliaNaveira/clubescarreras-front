import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

interface TitleDescriptionProps {
  title: string;
  description: string;
}

const TitleDescription: React.FC<TitleDescriptionProps> = ({ title, description }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ px: 2 }}>
      {/* Título principal accesible */}
      <Typography
        variant="h4"
        component="h2"  // semántica adecuada
        sx={{
          fontWeight: 700,
          color: "text.secondary", // mejor contraste
          fontSize: isMobile ? "1.5rem" : "2rem",
          textAlign: "left",
          lineHeight: 1.2
        }}
      >
        {title}
      </Typography>

      {/* Descripción asociada */}
      <Typography
        component="p"
        sx={{
          color: "text.secondary",
          maxWidth: "100%",   // no limitar demasiado
          textAlign: "left",  // lectura más natural
          fontSize: isMobile ? "0.9rem" : "1rem",
          mt: 1,
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};

export default TitleDescription;
