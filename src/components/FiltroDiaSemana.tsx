import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

interface FiltroDiaSemanaProps {
  diaSemanaFiltro: string;
  setDiaSemanaFiltro: (value: string) => void;
  handleFiltro: () => void; // no necesario, pero lo dejamos para compatibilidad
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
          label="Filtrar día"
          fullWidth
        >
          <MenuItem value="">Todos</MenuItem>
          {diasSemana.map((d) => (
            <MenuItem key={d} value={d}>{d}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FiltroDiaSemana;
