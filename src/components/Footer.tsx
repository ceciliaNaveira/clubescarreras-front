import { Box, Typography } from "@mui/material";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 0.5, // padding vertical
        textAlign: "center",
        backgroundColor: "primary.main",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Typography sx={{ fontSize: "1rem", color: "text.primary" }}>
        Hecho por Cecilia Naveira 2025
      </Typography>
    </Box>
  );
};

