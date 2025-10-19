import React from "react";
import { TextField } from "@mui/material";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
  return (
    <TextField
      label="Buscar por nombre..."
      variant="outlined"
      size="small"
      fullWidth
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export default SearchBar;
