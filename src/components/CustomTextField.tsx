// src/components/CustomTextField.tsx
import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";

export const CustomTextField = (props: TextFieldProps) => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          "& fieldset": {
            borderColor: "rgba(0,0,0,0.2)",
          },
          "&:hover fieldset": {
            borderColor: "primary.main",
          },
          "&.Mui-focused fieldset": {
            borderColor: "primary.main",
            borderWidth: 2,
          },
        },
        mb: 2,
      }}
      {...props}
    />
  );
};
