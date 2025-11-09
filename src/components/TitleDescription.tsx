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
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "text.primary",
          fontSize: isMobile ? "1.5rem" : "2rem",
          textAlign: "left",
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          color: "text.secondary",
          maxWidth: 1000,
          textAlign: "center",
          fontSize: isMobile ? "0.9rem" : "1rem",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};

export default TitleDescription;
