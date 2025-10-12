import { Box, Typography } from '@mui/material';
import { LinkButton } from './LinkButton'; // importa tu componente

interface SectionProps {
  title: string;
  text: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

export const Section = ({ title, text, image, buttonText, buttonLink }: SectionProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 4,
        p: 4,
        backgroundColor: 'background.paper',
        my: 4,
      }}
    >
      {/* Imagen */}
      <Box component="img" src={image} alt={title} sx={{ width: '40%', borderRadius: 2 }} />

      {/* Texto + botón */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {text}
        </Typography>
        <LinkButton href={buttonLink}>{buttonText}</LinkButton>
      </Box>
    </Box>
  );
};

