import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

interface FiltroDiaSemanaProps {
  diaSemanaFiltro: string;
  setDiaSemanaFiltro: (value: string) => void;
  handleFiltro: () => void; 
  diasSemana: string[];
}

const FiltroDiaSemana: React.FC<FiltroDiaSemanaProps> = ({
  diaSemanaFiltro,
  setDiaSemanaFiltro,
  diasSemana,
}) => {
  return (
    <Box display="flex" alignItems="center" sx={{ gap: 1, width: "100%" }}>
      <FormControl variant="outlined" size="small" sx={{ flex: 1 }}>
        <InputLabel id="dia-semana-label">Filtrar por día de entrenamiento</InputLabel>
        <Select
          labelId="dia-semana-label"
          value={diaSemanaFiltro}
          onChange={(e) => setDiaSemanaFiltro(e.target.value)}
          label="Filtrar por día de entrenamiento"
          fullWidth
          sx={{
            color: 'text.secondary', 
            '& .MuiSelect-select': { color: 'text.secondary' },
          }}
          inputProps={{ 'aria-label': 'Filtrar por día de entrenamiento' }}
        >
          <MenuItem value="" sx={{ color: 'text.primary' }}>Todos</MenuItem>
          {diasSemana.map((d) => (
            <MenuItem key={d} value={d} sx={{ color: 'text.primary' }}>
              {d}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FiltroDiaSemana;
