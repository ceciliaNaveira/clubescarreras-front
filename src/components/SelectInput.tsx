import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type SelectInputProps = {
  label: string;
  value: any;
  onChange: (value: any) => void;
  options: { value: any; label: string }[];
  required?: boolean;
  helperText?: string;
};

export const SelectInput = ({
  label,
  value,
  onChange,
  options,
  required = false,
  helperText = "Seleccione una opción",
}: SelectInputProps) => {
  const theme = useTheme();
  const id = `select-input-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <FormControl fullWidth sx={{ mb: 2 }} required={required}>
      {/* Label correctamente asociado */}
      <InputLabel
        id={`${id}-label`}
        sx={{ color: theme.palette.primary.main }}
      >
        {label}
      </InputLabel>

      {/* Select accesible */}
      <Select
        labelId={`${id}-label`}
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-required={required}
        aria-describedby={`${id}-helper-text`}
        sx={{
          color: theme.palette.text.primary,
          backgroundColor: "#fff",
          borderRadius: 2,
        }}
      >
        {/* Placeholder para accesibilidad */}
        <MenuItem value="">
          <em>{helperText}</em>
        </MenuItem>

        {options.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>

      {/* Helper text accesible */}
      <FormHelperText id={`${id}-helper-text`}>
        {helperText}
      </FormHelperText>
    </FormControl>
  );
};
