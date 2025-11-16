import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { type Club, getClubById, saveClub } from "../../services/clubService";
import {
  type Entrenamiento,
  getEntrenamientosByClubId,
  saveEntrenamiento,
  deleteEntrenamiento,
} from "../../services/entrenamientoService";
import { type Localizacion, getLocalizacionById, saveLocalizacion } from "../../services/localizacionService";

import { Box, TextField, MenuItem, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { TextInput } from "../../components/TextInput";
import { SelectInput } from "../../components/SelectInput";

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const NIVELES = ["Iniciación", "Intermedio", "Avanzado"];

export const AdminEditClubForm = () => {
  const theme = useTheme();
  const { idClub } = useParams<{ idClub: string }>();
  const navigate = useNavigate();

  const [club, setClub] = useState<Partial<Club>>({});
  const [localizacion, setLocalizacion] = useState<Partial<Localizacion>>({});
  const [entrenamientos, setEntrenamientos] = useState<Entrenamiento[]>([]);
  const [originalEntrenamientos, setOriginalEntrenamientos] = useState<Entrenamiento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!idClub) return;
      setLoading(true);
      try {
        const data = await getClubById(Number(idClub));
        setClub(data);

        const loc = await getLocalizacionById(data.localizacionId);
        setLocalizacion(loc);

        const entrenamientosData = await getEntrenamientosByClubId(data.clubId);
        setEntrenamientos(entrenamientosData);
        setOriginalEntrenamientos(entrenamientosData);
      } catch (err) {
        console.error("Error cargando club:", err);
        alert("No se pudo cargar el club");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idClub]);

  const handleClubChange = (field: keyof Club, value: any) =>
    setClub(prev => ({ ...prev, [field]: value }));

  const handleLocChange = (field: keyof Localizacion, value: any) =>
    setLocalizacion(prev => ({ ...prev, [field]: value }));

  const handleEntrenamientoChange = (index: number, field: keyof Entrenamiento, value: any) => {
    const nuevos = [...entrenamientos];
    nuevos[index] = { ...nuevos[index], [field]: value };
    setEntrenamientos(nuevos);
  };

  const addEntrenamiento = () =>
    setEntrenamientos(prev => [
      ...prev,
      {
        clubId: club.clubId!,
        diaSemana: "",
        hora: "10:00",
        lugarEntrenamiento: "",
        nivel: "",
        descripcion: "",
      } as Entrenamiento,
    ]);

  const removeEntrenamiento = (index: number) =>
    setEntrenamientos(prev => prev.filter((_, i) => i !== index));

  const handleSaveAll = async () => {
    try {
      setLoading(true);

      const savedLoc = await saveLocalizacion(localizacion);
      setLocalizacion(savedLoc);

      const payloadClub = { ...club, localizacionId: savedLoc.localizacionId };
      const savedClub = await saveClub(payloadClub);
      setClub(savedClub);

      const currentIds = entrenamientos.map(e => e.entrenamientoId).filter(Boolean);
      for (const ent of originalEntrenamientos) {
        if (ent.entrenamientoId && !currentIds.includes(ent.entrenamientoId)) {
          await deleteEntrenamiento(ent.entrenamientoId);
        }
      }

      for (const ent of entrenamientos) {
        const horaFormateada = ent.hora?.length === 5 ? `${ent.hora}:00` : ent.hora;
        const payloadEnt: Partial<Entrenamiento> = {
          ...ent,
          clubId: savedClub.clubId!,
          hora: horaFormateada,
        };
        await saveEntrenamiento(payloadEnt);
      }
      const entrenamientosActualizados = await getEntrenamientosByClubId(savedClub.clubId!);
      setEntrenamientos(entrenamientosActualizados);
      setOriginalEntrenamientos(entrenamientosActualizados);

      alert("Todo guardado correctamente");
      navigate("/admin/clubs");
    } catch (err) {
      console.error("Error guardando todo:", err);
      alert("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando club...</p>;

  const textFieldProps = { InputProps: { sx: { color: theme.palette.primary.main } } };
  const inputStyle = { width: "100%", borderRadius: 4, backgroundColor: "#fff" };

  return (
    <Box sx={{ px: 4, mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: theme.palette.secondary.main }}
          onClick={() => window.location.href = "/admin/clubs"}
        >
          Volver
        </Button>
      </Box>

      {/* Club */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
        <h3 style={{ color: theme.palette.primary.main }}>Club</h3>
        {["nombre", "descripcion", "contacto", "web"].map((field, idx) => (
          <TextInput
            key={idx}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            value={(club as any)[field] || ""}
            onChange={val => handleClubChange(field as keyof Club, val)}
            multiline={field === "descripcion"}
            rows={field === "descripcion" ? 3 : 1}
          />
        ))}
      </Box>

      {/* Localización */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
        <h3 style={{ color: theme.palette.primary.main }}>Localización</h3>
        {["provincia", "municipio", "codigoPostal", "direccion"].map((field, idx) => (
          <TextInput
            key={idx}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            value={(localizacion as any)[field] || ""}
            onChange={val => handleLocChange(field as keyof Localizacion, val)}
          />
        ))}
        {["latitud", "longitud"].map((field, idx) => (
          <TextInput
            key={idx}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            type="number"
            value={(localizacion as any)[field] || ""}
            onChange={val => handleLocChange(field as keyof Localizacion, parseFloat(val))}
          />
        ))}
      </Box>

      {/* Entrenamientos */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <h3 style={{ color: theme.palette.primary.main }}>Entrenamientos</h3>
          <Button variant="contained" color="primary" onClick={addEntrenamiento}>Añadir</Button>
        </Box>

        {entrenamientos.map((e, idx) => (
          <Box key={e.entrenamientoId || idx} sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto", gap: 1, mb: 2 }}>
            
            <SelectInput
              label="Día"
              value={e.diaSemana}
              onChange={val => handleEntrenamientoChange(idx, "diaSemana", val)}
              options={DIAS_SEMANA.map(d => ({ value: d, label: d }))}
            />

            <TextInput
              label="Hora"
              type="time"
              value={e.hora || "10:00"}
              onChange={val => handleEntrenamientoChange(idx, "hora", val)}
            />

            <SelectInput
              label="Nivel"
              value={e.nivel}
              onChange={val => handleEntrenamientoChange(idx, "nivel", val)}
              options={NIVELES.map(n => ({ value: n, label: n }))}
            />

            <TextInput
              label="Lugar"
              value={e.lugarEntrenamiento}
              onChange={val => handleEntrenamientoChange(idx, "lugarEntrenamiento", val)}
            />

            <TextInput
              label="Descripción"
              value={e.descripcion || ""}
              onChange={val => handleEntrenamientoChange(idx, "descripcion", val)}
            />

            <Button
              variant="contained"
              color="error"
              onClick={() => removeEntrenamiento(idx)}
              sx={{
                height: 40,
                minWidth: 100,
                paddingInline: 2,
                textTransform: "none"
              }}
            >
              Eliminar
            </Button>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSaveAll}>Guardar</Button>
      </Box>
    </Box>
  );
};