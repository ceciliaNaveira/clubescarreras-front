import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";

export const CustomTextField = (props: TextFieldProps) => {
  return (
    <TextField
    fullWidth
    variant="outlined"
    {...props}
    sx={{
      "& .MuiInputBase-root": {
        backgroundColor: '#e0e0e0',
        borderRadius: "6px",
      },
      "& .MuiInputBase-input": {
        color: "#0E2B40",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#0E2B40",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#0E2B40",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#0E2B40",
      },
    }}
  />
);
};
