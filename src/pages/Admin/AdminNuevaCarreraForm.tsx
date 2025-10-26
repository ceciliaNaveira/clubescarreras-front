import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { type Club, getClubs } from "../../services/clubService";
import { type Localizacion, saveLocalizacion } from "../../services/localizacionService";
import { type Carrera, saveCarrera } from "../../services/carreraService";

import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { TextInput } from "../../components/TextInput";
import { SelectInput } from "../../components/SelectInput";

export const AdminNuevaCarreraForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [carrera, setCarrera] = useState<Partial<Carrera>>({});
  const [localizacion, setLocalizacion] = useState<Partial<Localizacion>>({});
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar clubs
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const allClubs = await getClubs();
        setClubs(allClubs);
      } catch (err) {
        console.error(err);
        alert("Error al cargar los clubs");
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const handleCarreraChange = (field: string, value: any) => {
    setCarrera(prev => ({ ...prev, [field]: value }));
  };

  const handleLocalizacionChange = (field: string, value: any) => {
    setLocalizacion(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Guardar localización primero si no existe ID
      let locId = localizacion.localizacionId;
      if (!locId) {
        const locCreada = await saveLocalizacion(localizacion);
        locId = locCreada.localizacionId;
      }

      // Guardar carrera usando localizacionId
      const carreraToSave = {
        ...carrera,
        clubId: carrera.clubId || null,
        localizacionId: locId
      };

      await saveCarrera(carreraToSave);
      navigate("/admin/carreras");
    } catch (err) {
      console.error(err);
      alert("Error al guardar la carrera");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <Box sx={{ px: 4, mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: theme.palette.secondary.main }}
          onClick={() => navigate("/admin/carreras")}
        >
          Volver
        </Button>
      </Box>

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          p: 3,
          mb: 3,
        }}
      >
        <h2 style={{ color: theme.palette.primary.main }}>Nueva Carrera</h2>

        {/* Bloque Carrera */}
        <TextInput
          label="Nombre"
          value={carrera.nombre || ""}
          onChange={val => handleCarreraChange("nombre", val)}
          fullWidth
          required
        />

        <SelectInput
          label="Club"
          value={carrera.clubId || ""}
          onChange={val => handleCarreraChange("clubId", Number(val))}
          options={[{ value: "", label: "-- Sin club --" }, ...clubs.map(club => ({ value: club.idClub, label: club.nombre }))]}
          fullWidth
        />

        <TextInput
          label="Fecha"
          type="date"
          value={carrera.fecha ? carrera.fecha.toString() : ""}
          onChange={val => handleCarreraChange("fecha", val)}
        />

        <TextInput
          label="Distancia (km)"
          type="number"
          value={carrera.distanciaKm || ""}
          onChange={val => handleCarreraChange("distanciaKm", parseFloat(val))}
        />

        <TextInput
          label="Web oficial"
          value={carrera.webOficial || ""}
          onChange={val => handleCarreraChange("webOficial", val)}
        />

        <TextInput
          label="Descripción"
          value={carrera.descripcion || ""}
          onChange={val => handleCarreraChange("descripcion", val)}
          multiline
          rows={3}
        />

        {/* Bloque Localización */}
        <h3 style={{ color: theme.palette.primary.main }}>Localización</h3>
        <TextInput
          label="Provincia"
          value={localizacion.provincia || ""}
          onChange={val => handleLocalizacionChange("provincia", val)}
        />
        <TextInput
          label="Municipio"
          value={localizacion.municipio || ""}
          onChange={val => handleLocalizacionChange("municipio", val)}
        />
        <TextInput
          label="Código Postal"
          value={localizacion.codigoPostal || ""}
          onChange={val => handleLocalizacionChange("codigoPostal", val)}
        />
        <TextInput
          label="Dirección"
          value={localizacion.direccion || ""}
          onChange={val => handleLocalizacionChange("direccion", val)}
        />
        <TextInput
          label="Latitud"
          type="number"
          value={localizacion.latitud || ""}
          onChange={val => handleLocalizacionChange("latitud", parseFloat(val))}
        />
        <TextInput
          label="Longitud"
          type="number"
          value={localizacion.longitud || ""}
          onChange={val => handleLocalizacionChange("longitud", parseFloat(val))}
        />

        {/* Botones */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
          <Button variant="outlined" color="secondary" onClick={() => navigate("/admin/carreras")}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
