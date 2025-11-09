import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { LinkButton } from "./LinkButton";

interface SectionProps {
  title: string;
  text: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

export const Section = ({
  title,
  text,
  image,
  buttonText,
  buttonLink,
}: SectionProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: isMobile ? 2 : 4,
        p: isMobile ? 2 : 4,
        backgroundColor: "background.paper",
        my: 4,
        textAlign: isMobile ? "center" : "left",
      }}
    >
      {/* Imagen */}
      <Box
        component="img"
        src={image}
        alt="" // Evita redundancia con el título visible
        sx={{
          width: isMobile ? "100%" : "40%",
          maxHeight: isMobile ? 300 : "none",
          objectFit: "cover",
          borderRadius: 2,
          order: isMobile ? -1 : 0,
        }}
      />

      {/* Texto + botón */}
      <Box sx={{ flex: 1 }}>
        <Typography
          variant={isMobile ? "h4" : "h2"}
          component="h2" // asegura jerarquía semántica correcta
          sx={{ mb: 2, fontWeight: 600 }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 3,
            fontSize: "1rem", // tamaño mínimo accesible
            lineHeight: 1.6,
          }}
        >
          {text}
        </Typography>

        <LinkButton href={buttonLink} aria-label={buttonText}>
          {buttonText}
        </LinkButton>
      </Box>
    </Box>
  );
};
