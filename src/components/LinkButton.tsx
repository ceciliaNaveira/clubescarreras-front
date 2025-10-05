// src/components/LinkButton.tsx
import { Button } from '@mui/material';
import type { SxProps, Theme } from '@mui/system';


interface LinkButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  sx?: SxProps<Theme>; // para estilos extra si quieres
}

export const LinkButton = ({ children, href, onClick, sx }: LinkButtonProps) => {
  return (
    <Button
      variant="outlined"
      href={href}
      onClick={onClick}
      sx={{
        color: 'text.primary',
        borderColor: 'secondary.main',
        '&:hover': {
          backgroundColor: 'secondary.main',
          color: 'white',
          borderColor: 'secondary.main',
        },
        minWidth: '80px',
        textTransform: 'none',
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

