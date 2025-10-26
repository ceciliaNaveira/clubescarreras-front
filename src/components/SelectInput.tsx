import { TextField, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type SelectInputProps = {
  label: string;
  value: any;
  onChange: (value: any) => void;
  options: { value: any; label: string }[];
};

export const SelectInput = ({ label, value, onChange, options }: SelectInputProps) => {
  const theme = useTheme();
  return (
    <TextField
      fullWidth
      select
      label={label}
      value={value}
      onChange={e => onChange(e.target.value)}
      InputProps={{ sx: { color: theme.palette.primary.main, backgroundColor: "#fff", borderRadius: 2 } }}
      InputLabelProps={{ sx: { color: theme.palette.primary.main } }}
      sx={{ mb: 2 }}
    >
      {options.map(opt => (
        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
      ))}
    </TextField>
  );
};
