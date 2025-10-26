import { useState } from "react";
import { Box, TextField, MenuItem, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { type Club, saveClub } from "../../services/clubService";
import { type Localizacion, saveLocalizacion } from "../../services/localizacionService";
import { type Entrenamiento, saveEntrenamiento } from "../../services/entrenamientoService";

import { TextInput } from "../../components/TextInput";
import { SelectInput } from "../../components/SelectInput";

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const niveles = ["Iniciación", "Intermedio", "Avanzado"];

export const AdminNuevoClubForm = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const [club, setClub] = useState<Partial<Club>>({
    nombre: "",
    descripcion: "",
    contacto: "",
    web: "",
    localizacion: { provincia: "", municipio: "", latitud: 0, longitud: 0 } as Localizacion,
    entrenamientos: [] as Entrenamiento[],
  });

  // --- Cambios en club, localización y entrenamientos ---
  const handleChange = (field: keyof Club, value: any) => setClub({ ...club, [field]: value });
  const handleLocChange = (field: keyof Localizacion, value: any) => {
    setClub({ ...club, localizacion: { ...club.localizacion, [field]: value } });
  };
  const handleEntrenamientoChange = (idx: number, field: keyof Entrenamiento, value: any) => {
    const entrenamientos = [...(club.entrenamientos || [])];
    entrenamientos[idx] = { ...entrenamientos[idx], [field]: value };
    setClub({ ...club, entrenamientos });
  };

  const addEntrenamiento = () => {
    const entrenamientos = [
      ...(club.entrenamientos || []),
      { diaSemana: "", hora: "10:00", lugarEntrenamiento: "", nivel: "", descripcion: "", clubId: 0 } as Entrenamiento
    ];
    setClub({ ...club, entrenamientos });
  };

  const removeEntrenamiento = (idx: number) => {
    const entrenamientos = [...(club.entrenamientos || [])];
    entrenamientos.splice(idx, 1);
    setClub({ ...club, entrenamientos });
  };

  // --- Submit del formulario ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // --- Validaciones ---
      if (!club.nombre) {
        alert("El nombre del club es obligatorio");
        setLoading(false);
        return;
      }
      const loc = club.localizacion;
      if (!loc?.provincia || !loc.municipio) {
        alert("Provincia y municipio de la localización son obligatorios");
        setLoading(false);
        return;
      }

      // --- Guardar localización ---
      console.log("Localización a enviar:", loc);
      const savedLoc = await saveLocalizacion(loc);
      console.log("Localización guardada:", savedLoc);

      // --- Guardar club ---
      const clubToSend = {
        nombre: club.nombre,
        descripcion: club.descripcion,
        contacto: club.contacto,
        web: club.web,
        localizacionId: savedLoc.localizacionId,
      };
      console.log("Club limpio a enviar:", clubToSend);
      const savedClub = await saveClub(clubToSend);
      console.log("Club guardado:", savedClub);

      // --- Guardar entrenamientos ---
      if (club.entrenamientos?.length) {
        for (const ent of club.entrenamientos) {
          // Convertir hora a formato HH:mm:ss para Spring Boot
          let horaStr = "";
          if (typeof ent.hora === "string") {
            horaStr = ent.hora.length === 5 ? `${ent.hora}:00` : ent.hora;
          }
          const entrenamientoToSend = {
            ...ent,
            clubId: savedClub.clubId!,
            hora: horaStr,
          };
          console.log("Entrenamiento a enviar:", entrenamientoToSend);
          const savedEnt = await saveEntrenamiento(entrenamientoToSend);
          console.log("Entrenamiento guardado:", savedEnt);
        }
      }

      alert("Club y entrenamientos guardados correctamente");
      window.location.href = "/admin/clubs";
    } catch (err) {
      console.error("Error en handleSubmit:", err);
      alert("Error al guardar club o entrenamientos");
    } finally {
      setLoading(false);
    }
  };

    return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      {/* Botón Volver arriba a la derecha */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: theme.palette.secondary.main }}
          onClick={() => window.location.href = "/admin/clubs"}
        >
          Volver
        </Button>
      </Box>

      {/* Formulario */}
      <Box
        component="form"
        sx={{
          maxWidth: 800,
          mx: "auto",
          mt: 4,
          p: 3,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
        onSubmit={handleSubmit}
      >
        <h2 style={{ color: theme.palette.primary.main }}>Nuevo Club</h2>

        {/* --- Datos Club --- */}
        <TextInput
          label="Nombre"
          value={club.nombre}
          onChange={val => handleChange("nombre", val)}
          required
        />
        <TextInput
          label="Descripción"
          value={club.descripcion}
          onChange={val => handleChange("descripcion", val)}
          multiline
          rows={3}
        />
        <TextInput label="Contacto" value={club.contacto} onChange={val => handleChange("contacto", val)} />
        <TextInput label="Web" value={club.web} onChange={val => handleChange("web", val)} />

        {/* --- Localización --- */}
        <h3 style={{ color: theme.palette.primary.main }}>Localización</h3>
        <TextInput
          label="Provincia"
          value={club.localizacion?.provincia || ""}
          onChange={val => handleLocChange("provincia", val)}
          required
        />
        <TextInput
          label="Municipio"
          value={club.localizacion?.municipio || ""}
          onChange={val => handleLocChange("municipio", val)}
          required
        />
        <TextInput
          label="Dirección"
          value={club.localizacion?.direccion || ""}
          onChange={val => handleLocChange("direccion", val)}
        />
        <TextInput
          label="Código Postal"
          value={club.localizacion?.codigoPostal || ""}
          onChange={val => handleLocChange("codigoPostal", val)}
        />
        <TextInput
          label="Latitud"
          type="number"
          value={club.localizacion?.latitud || ""}
          onChange={val => handleLocChange("latitud", parseFloat(val))}
        />
        <TextInput
          label="Longitud"
          type="number"
          value={club.localizacion?.longitud || ""}
          onChange={val => handleLocChange("longitud", parseFloat(val))}
        />

        {/* --- Entrenamientos --- */}
        <h3 style={{ color: theme.palette.primary.main }}>Entrenamientos</h3>
        {club.entrenamientos?.map((ent, idx) => (
          <Box key={idx} sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 1 }}>
            <SelectInput
              label="Día de la semana"
              value={ent.diaSemana || ""}
              onChange={val => handleEntrenamientoChange(idx, "diaSemana", val)}
              options={diasSemana.map(d => ({ value: d, label: d }))}
            />
            <TextInput
              label="Hora"
              type="time"
              value={ent.hora || "10:00"}
              onChange={val => handleEntrenamientoChange(idx, "hora", val)}
            />
            <TextInput
              label="Lugar"
              value={ent.lugarEntrenamiento || ""}
              onChange={val => handleEntrenamientoChange(idx, "lugarEntrenamiento", val)}
            />
            <SelectInput
              label="Nivel"
              value={ent.nivel || ""}
              onChange={val => handleEntrenamientoChange(idx, "nivel", val)}
              options={niveles.map(n => ({ value: n, label: n }))}
            />
            <TextInput
              label="Descripción"
              value={ent.descripcion || ""}
              onChange={val => handleEntrenamientoChange(idx, "descripcion", val)}
              multiline
              rows={2}
            />
            <Button color="error" variant="outlined" onClick={() => removeEntrenamiento(idx)}>
              Eliminar
            </Button>
          </Box>
        ))}
        <Button variant="contained" color="secondary" onClick={addEntrenamiento} sx={{ mb: 2 }}>
          Agregar Entrenamiento
        </Button>

        {/* --- Botones --- */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => window.location.href = "/admin/clubs"}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};