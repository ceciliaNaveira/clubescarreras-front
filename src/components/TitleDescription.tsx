import React from "react";
import { Box, Typography } from "@mui/material";

// Definimos los tipos de las props
interface TitleDescriptionProps {
  title: string;
  description: string;
}

const TitleDescription: React.FC<TitleDescriptionProps> = ({ title, description }) => {
  return (
    <Box sx={{ px: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
        {title}
      </Typography>
      <Typography sx={{ color: "text.secondary", maxWidth: 1000, textAlign: "center" }}>
        {description}
      </Typography>
    </Box>
  );
};

export default TitleDescription;
