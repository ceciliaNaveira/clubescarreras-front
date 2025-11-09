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
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // md = 960px

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
        alt={title}
        sx={{
          width: isMobile ? "100%" : "40%",
          maxHeight: isMobile ? 300 : "none",
          objectFit: "cover",
          borderRadius: 2,
          order: isMobile ? -1 : 0, // opcional: pon la imagen arriba en móvil
        }}
      />

      {/* Texto + botón */}
      <Box sx={{ flex: 1 }}>
        <Typography
          variant={isMobile ? "h4" : "h2"}
          sx={{ mb: 2, fontWeight: 600 }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            fontSize: isMobile ? "0.95rem" : "1rem",
            lineHeight: 1.6,
          }}
        >
          {text}
        </Typography>
        <LinkButton href={buttonLink}>{buttonText}</LinkButton>
      </Box>
    </Box>
  );
};
