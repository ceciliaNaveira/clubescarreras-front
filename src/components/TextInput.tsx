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
      InputLabelProps={{
        shrink: type === "date" || type === "time" ? true : undefined, 
      }}
      sx={{
        mb: 2,
         "& .MuiInputBase-input": {
          color: theme.palette.primary.main,
        },
        "& .MuiInputBase-root": {
          color: theme.palette.primary.main,
          backgroundColor: "transparent",
          borderRadius: 2,
        },
        "& .MuiInputLabel-root": {
          color: theme.palette.primary.main,
        },
      }}
    />
  );
};
