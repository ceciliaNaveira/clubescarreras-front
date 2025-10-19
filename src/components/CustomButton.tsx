import Button from "@mui/material/Button";
import type { ButtonProps } from "@mui/material/Button";

import { styled } from "@mui/material/styles";

export const BlueButton = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: theme.palette.primary.main, // azul oscuro del tema
  color: "#fff",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark ?? "#0b1f2e",
  },
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 600,
}));

export const OrangeButton = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main, // naranja del tema
  color: "#fff",
  "&:hover": {
    backgroundColor: theme.palette.secondary.dark ?? "#7a3a10",
  },
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 600,
}));
