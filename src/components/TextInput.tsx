import { TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type TextInputProps = {
  label: string;
  value: any;
  onChange: (value: any) => void;
  type?: string;
};

export const TextInput = ({ label, value, onChange, type = "text" }: TextInputProps) => {
  const theme = useTheme();
  return (
    <TextField
      fullWidth
      label={label}
      type={type}
      value={value}
      onChange={e => onChange(type === "number" ? parseFloat(e.target.value) : e.target.value)}
      InputProps={{ sx: { color: theme.palette.primary.main, backgroundColor: "#fff", borderRadius: 2 } }}
      InputLabelProps={{ sx: { color: theme.palette.primary.main } }}
      sx={{ mb: 2 }}
    />
  );
};
