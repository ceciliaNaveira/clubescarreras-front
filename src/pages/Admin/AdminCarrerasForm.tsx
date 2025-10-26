import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { type Club, getClubs } from "../../services/clubService";
import { type Localizacion, getLocalizacionById } from "../../services/localizacionService";

import { type Carrera, getCarreraById, saveCarrera } from "../../services/carreraService";

import { Box, TextField, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";


export const AdminCarrerasForm = () => {
  const theme = useTheme();
  const { idCarrera } = useParams<{ idCarrera: string }>();
  const navigate = useNavigate();

  const [carrera, setCarrera] = useState<Partial<Carrera>>({});
  const [localizacion, setLocalizacion] = useState<Partial<Localizacion>>({});
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allClubs = await getClubs();
        setClubs(allClubs);

        if (idCarrera) {
          const c = await getCarreraById(Number(idCarrera));
          setCarrera(c);

          if (c.localizacionId) {
            const loc = await getLocalizacionById(c.localizacionId);
            setLocalizacion(loc);
          }
        }
      } catch (err) {
        console.error(err);
        alert("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idCarrera]);

  const handleCarreraChange = (field: string, value: any) => {
    setCarrera(prev => ({ ...prev, [field]: value }));
  };

  const handleLocalizacionChange = (field: string, value: any) => {
    setLocalizacion(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Combinar carrera con la localización
      const carreraToSave = { ...carrera, localizacion: localizacion };
      await saveCarrera(carreraToSave);
      navigate("/admin/carreras");
    } catch (err) {
      console.error(err);
      alert("Error al guardar la carrera");
    }
  };

  const inputSx = { color: theme.palette.primary.main };
  const labelSx = { color: theme.palette.primary.main };

  if (loading) return <p>Cargando...</p>;

  return (
    <Box sx={{ px: 4, mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <button
          style={{
            padding: "8px 16px",
            backgroundColor: theme.palette.secondary.main,
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
          onClick={() => navigate("/admin/carreras")}
        >
          Volver
        </button>
      </Box>

      <Box
        component="table"
        sx={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          color: theme.palette.primary.main,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          borderRadius: 2,
          overflow: "hidden",
          mb: 3,
        }}
      >
        <Box component="thead" sx={{ backgroundColor: theme.palette.primary.light, color: theme.palette.common.white }}>
          <Box component="tr">
            <Box component="th" sx={{ p: 2, textAlign: "left" }} colSpan={2}>
              Carrera
            </Box>
          </Box>
        </Box>

        <Box component="tbody">
          {/* Nombre */}
          <Box component="tr" sx={{ borderBottom: "1px solid #ccc" }}>
            <Box component="td" sx={{ p: 2, fontWeight: "bold" }}>Nombre</Box>
            <Box component="td" sx={{ p: 2 }}>
              <TextField
                fullWidth
                value={carrera.nombre || ""}
                onChange={e => handleCarreraChange("nombre", e.target.value)}
                InputProps={{ sx: inputSx }}
                InputLabelProps={{ sx: labelSx }}
              />
            </Box>
          </Box>

          {/* Club */}
          <Box component="tr" sx={{ borderBottom: "1px solid #ccc" }}>
            <Box component="td" sx={{ p: 2, fontWeight: "bold" }}>Club</Box>
            <Box component="td" sx={{ p: 2 }}>
              <TextField
                fullWidth
                select
                value={carrera.clubId || ""}
                onChange={e => handleCarreraChange("clubId", Number(e.target.value))}
                InputProps={{ sx: inputSx }}
                InputLabelProps={{ sx: labelSx }}
              >
                <MenuItem value="">-- Sin club --</MenuItem>
                {clubs.map(club => (
                  <MenuItem key={club.idClub} value={club.idClub}>
                    {club.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          {/* Localización editable */}
          <Box component="tr" sx={{ borderBottom: "1px solid #ccc" }}>
            <Box component="td" sx={{ p: 2, fontWeight: "bold" }}>Provincia</Box>
            <Box component="td" sx={{ p: 2 }}>
              <TextField
                fullWidth
                value={localizacion.provincia || ""}
                onChange={e => handleLocalizacionChange("provincia", e.target.value)}
                InputProps={{ sx: inputSx }}
                InputLabelProps={{ sx: labelSx }}
              />
            </Box>
          </Box>

          <Box component="tr" sx={{ borderBottom: "1px solid #ccc" }}>
            <Box component="td" sx={{ p: 2, fontWeight: "bold" }}>Municipio</Box>
            <Box component="td" sx={{ p: 2 }}>
              <TextField
                fullWidth
                value={localizacion.municipio || ""}
                onChange={e => handleLocalizacionChange("municipio", e.target.value)}
                InputProps={{ sx: inputSx }}
                InputLabelProps={{ sx: labelSx }}
              />
            </Box>
          </Box>

          <Box component="tr" sx={{ borderBottom: "1px solid #ccc" }}>
            <Box component="td" sx={{ p: 2, fontWeight: "bold" }}>Código Postal</Box>
            <Box component="td" sx={{ p: 2 }}>
              <TextField
                fullWidth
                value={localizacion.codigoPostal || ""}
                onChange={e => handleLocalizacionChange("codigoPostal", e.target.value)}
                InputProps={{ sx: inputSx }}
                InputLabelProps={{ sx: labelSx }}
              />
            </Box>
          </Box>

          <Box component="tr" sx={{ borderBottom: "1px solid #ccc" }}>
            <Box component="td" sx={{ p: 2, fontWeight: "bold" }}>Dirección</Box>
            <Box component="td" sx={{ p: 2 }}>
              <TextField
                fullWidth
                value={localizacion.direccion || ""}
                onChange={e => handleLocalizacionChange("direccion", e.target.value)}
                InputProps={{ sx: inputSx }}
                InputLabelProps={{ sx: labelSx }}
              />
            </Box>
          </Box>

          <Box component="tr" sx={{ borderBottom: "1px solid #ccc" }}>
            <Box component="td" sx={{ p: 2, fontWeight: "bold" }}>Latitud</Box>
            <Box component="td" sx={{ p: 2 }}>
              <TextField
                fullWidth
                type="number"
                value={localizacion.latitud || ""}
                onChange={e => handleLocalizacionChange("latitud", parseFloat(e.target.value))}
                InputProps={{ sx: inputSx }}
                InputLabelProps={{ sx: labelSx }}
              />
            </Box>
          </Box>

          <Box component="tr" sx={{ borderBottom: "1px solid #ccc" }}>
            <Box component="td" sx={{ p: 2, fontWeight: "bold" }}>Longitud</Box>
            <Box component="td" sx={{ p: 2 }}>
              <TextField
                fullWidth
                type="number"
                value={localizacion.longitud || ""}
                onChange={e => handleLocalizacionChange("longitud", parseFloat(e.target.value))}
                InputProps={{ sx: inputSx }}
                InputLabelProps={{ sx: labelSx }}
              />
            </Box>
          </Box>

          {/* Fecha */}
          <Box component="tr" sx={{ borderBottom: "1px solid #ccc" }}>
            <Box component="td" sx={{ p: 2, fontWeight: "bold" }}>Fecha</Box>
            <Box component="td" sx={{ p: 2 }}>
              <TextField
                fullWidth
                type="date"
                value={carrera.fecha ? carrera.fecha.toString() : ""}
                onChange={e => handleCarreraChange("fecha", e.target.value)}
                InputProps={{ sx: inputSx }}
                InputLabelProps={{ sx: labelSx }}
              />
            </Box>
          </Box>

          {/* Distancia */}
          <Box component="tr" sx={{ borderBottom: "1px solid #ccc" }}>
            <Box component="td" sx={{ p: 2, fontWeight: "bold" }}>Distancia (km)</Box>
            <Box component="td" sx={{ p: 2 }}>
              <TextField
                fullWidth
                type="number"
                value={carrera.distanciaKm || ""}
                onChange={e => handleCarreraChange("distanciaKm", parseFloat(e.target.value))}
                InputProps={{ sx: inputSx }}
                InputLabelProps={{ sx: labelSx }}
              />
            </Box>
          </Box>

          {/* Web */}
          <Box component="tr" sx={{ borderBottom: "1px solid #ccc" }}>
            <Box component="td" sx={{ p: 2, fontWeight: "bold" }}>Web oficial</Box>
            <Box component="td" sx={{ p: 2 }}>
              <TextField
                fullWidth
                value={carrera.webOficial || ""}
                onChange={e => handleCarreraChange("webOficial", e.target.value)}
                InputProps={{ sx: inputSx }}
                InputLabelProps={{ sx: labelSx }}
              />
            </Box>
          </Box>

          {/* Descripción */}
          <Box component="tr" sx={{ borderBottom: "1px solid #ccc" }}>
            <Box component="td" sx={{ p: 2, fontWeight: "bold" }}>Descripción</Box>
            <Box component="td" sx={{ p: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={carrera.descripcion || ""}
                onChange={e => handleCarreraChange("descripcion", e.target.value)}
                InputProps={{ sx: inputSx }}
                InputLabelProps={{ sx: labelSx }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 2 }}>
        <button
          style={{
            padding: "8px 16px",
            backgroundColor: theme.palette.secondary.main,
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
          onClick={() => navigate("/admin/carreras")}
        >
          Cancelar
        </button>
        <button
          style={{
            padding: "8px 16px",
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
          onClick={handleSubmit}
        >
          Guardar
        </button>
      </Box>
    </Box>
  );
};
