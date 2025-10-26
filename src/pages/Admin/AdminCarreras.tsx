import { useEffect, useState } from "react";
import type { Carrera } from "../../services/carreraService";
import { getCarreras, deleteCarrera } from "../../services/carreraService";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const AdminCarreras = () => {
  const theme = useTheme();
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCarreras = async () => {
    setLoading(true);
    try {
      const allCarreras = await getCarreras();
      setCarreras(allCarreras);
    } catch (err) {
      console.error(err);
      setCarreras([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarreras();
  }, []);

  const handleEliminarCarrera = async (idCarrera: number) => {
    if (!confirm("¿Seguro que quieres eliminar esta carrera?")) return;
    try {
      await deleteCarrera(idCarrera);
      setCarreras(carreras.filter(c => c.carreraId !== idCarrera));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la carrera");
    }
  };

  if (loading) return <p>Cargando carreras...</p>;
  if (!carreras.length) return <p>No hay carreras disponibles</p>;

  return (
    <Box sx={{ px: 4, mt: 2, mb:2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <button
          style={{
            padding: "8px 16px",
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
          onClick={() => (window.location.href = "/admin/carreras/nueva")}
        >
          Crear nueva carrera
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
        }}
      >
        <Box component="thead" sx={{ backgroundColor: theme.palette.primary.light, color:theme.palette.common.white }}>
          <Box component="tr">
            <Box component="th" sx={{ p: 2, textAlign: "left" }}>Nombre</Box>
            <Box component="th" sx={{ p: 2, textAlign: "left" }}>Club</Box>
            <Box component="th" sx={{ p: 2, textAlign: "left" }}>Provincia</Box>
            <Box component="th" sx={{ p: 2, textAlign: "left" }}>Municipio</Box>
            <Box component="th" sx={{ p: 2, textAlign: "left" }}>Acciones</Box>
          </Box>
        </Box>
        <Box component="tbody">
          {carreras.map(c => (
            <Box component="tr" key={c.carreraId} sx={{ borderBottom: "1px solid #ccc" }}>
              <Box component="td" sx={{ p: 2 }}>{c.nombre}</Box>
              <Box component="td" sx={{ p: 2 }}>{c.clubNombre || "-"}</Box>
              <Box component="td" sx={{ p: 2 }}>{c.provincia}</Box>
              <Box component="td" sx={{ p: 2 }}>{c.municipio}</Box>
              <Box component="td" sx={{ p: 2, display: "flex", gap: 1 }}>
                <button
                  style={{
                    padding: "4px 8px",
                    backgroundColor: theme.palette.success.main,
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                  onClick={() => (window.location.href = `/admin/carreras/editar/${c.carreraId}`)}
                >
                  Editar
                </button>
                <button
                  style={{
                    padding: "4px 8px",
                    backgroundColor: theme.palette.error.main,
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                  onClick={() => handleEliminarCarrera(c.carreraId)}
                >
                  Eliminar
                </button>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
