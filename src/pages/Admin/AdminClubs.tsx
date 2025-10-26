import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Club, getClubs, deleteClub } from "../../services/clubService";
import { type Localizacion, getLocalizacionById } from "../../services/localizacionService";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const AdminClubs = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const allClubs = await getClubs();
      const clubsWithLoc = await Promise.all(
        allClubs.map(async (c) => {
          const loc: Localizacion = await getLocalizacionById(c.localizacionId);
          return { ...c, localizacion: loc };
        })
      );
      setClubs(clubsWithLoc);
    } catch (err) {
      console.error(err);
      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleEliminarClub = async (clubId: number) => {
    if (!confirm("¿Seguro que quieres eliminar este club?")) return;
    try {
      await deleteClub(clubId);
      setClubs(clubs.filter((c) => c.clubId !== clubId));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el club");
    }
  };

  if (loading) return <p>Cargando clubes...</p>;
  if (!clubs.length) return <p>No hay clubes disponibles</p>;

  return (
    <Box sx={{ px: 4, mt: 2, mb: 2 }}>
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
          onClick={() => navigate("/admin/clubs/nuevo")}
        >
          Crear nuevo club
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
        <Box component="thead" sx={{ backgroundColor: theme.palette.primary.light, color: theme.palette.common.white }}>
          <Box component="tr">
            <Box component="th" sx={{ p: 2, textAlign: "left" }}>Nombre</Box>
            <Box component="th" sx={{ p: 2, textAlign: "left" }}>Provincia</Box>
            <Box component="th" sx={{ p: 2, textAlign: "left" }}>Municipio</Box>
            <Box component="th" sx={{ p: 2, textAlign: "left" }}>Acciones</Box>
          </Box>
        </Box>
        <Box component="tbody">
          {clubs.map((c) => (
            <Box component="tr" key={c.clubId} sx={{ borderBottom: "1px solid #ccc" }}>
              <Box component="td" sx={{ p: 2 }}>{c.nombre}</Box>
              <Box component="td" sx={{ p: 2 }}>{c.localizacion?.provincia}</Box>
              <Box component="td" sx={{ p: 2 }}>{c.localizacion?.municipio}</Box>
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
                  onClick={() => navigate(`/admin/clubs/editar/${c.clubId}`)}
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
                  onClick={() => handleEliminarClub(c.clubId)}
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
