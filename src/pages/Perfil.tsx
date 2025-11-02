// src/pages/Perfil.tsx
import { useState, useEffect } from "react";
import { Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { BlueButton, OrangeButton } from "../components/CustomButton";
import { CustomTextField } from "../components/CustomTextField";
import { useUsuario } from "../context/UsuarioContext";
import { updateUsuario, deleteUsuario, loginUsuario } from "../services/usuarioService";
import { useNavigate } from "react-router-dom";

export const Perfil = () => {
  const { usuario, setUsuario } = useUsuario();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [contraseñaActual, setContraseñaActual] = useState("");
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre);
      setEmail(usuario.email);
    }
  }, [usuario]);

  const handleGuardar = async () => {
    try {
      setMensaje("");

      if (!usuario) {
        setMensaje("Debes iniciar sesión para editar tu perfil.");
        return;
      }

      // Validar contraseña actual antes de cambiar algo
      if (contraseñaActual) {
        try {
          await loginUsuario(usuario.email, contraseñaActual);
        } catch {
          setMensaje("❌ Contraseña actual incorrecta.");
          return;
        }
      } else {
        setMensaje("⚠️ Debes ingresar tu contraseña actual para guardar cambios.");
        return;
      }

      // Crear objeto con los datos actualizados
      const usuarioActualizado = {
        nombre,
        email,
        contraseña: nuevaContraseña || contraseñaActual, // si no cambia, se mantiene
        rolId: usuario.rolId,
      };

      const actualizado = await updateUsuario(usuario.id_usuario, usuarioActualizado);

      setUsuario(actualizado);
      localStorage.setItem("usuario", JSON.stringify(actualizado));

      setMensaje("✅ Datos actualizados correctamente.");
      setContraseñaActual("");
      setNuevaContraseña("");
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al actualizar los datos.");
    }
  };

  // Eliminar cuenta
  const handleEliminar = async () => {
    try {
      if (!usuario) return;

      await deleteUsuario(usuario.id_usuario);

      // limpiar sesión
      localStorage.removeItem("usuario");
      setUsuario(null);
      setOpenDialog(false);
      navigate("/login");
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al eliminar la cuenta.");
    }
  };

  if (!usuario) {
    return (
      <Typography sx={{ textAlign: "center", mt: 5 }}>
        Debes iniciar sesión para editar tu perfil.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          p: 4,
          width: 400,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: 3,
          backgroundColor: "background.paper",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
          Editar Perfil
        </Typography>

        <CustomTextField placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <CustomTextField placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <CustomTextField
          placeholder="Contraseña actual"
          type="password"
          value={contraseñaActual}
          onChange={(e) => setContraseñaActual(e.target.value)}
        />
        <CustomTextField
          placeholder="Nueva contraseña (opcional)"
          type="password"
          value={nuevaContraseña}
          onChange={(e) => setNuevaContraseña(e.target.value)}
        />

        {mensaje && (
          <Typography sx={{ color: mensaje.includes("Error") || mensaje.includes("❌") ? "red" : "green", mt: 1 }}>
            {mensaje}
          </Typography>
        )}

        <BlueButton fullWidth onClick={handleGuardar}>Guardar cambios</BlueButton>

        <OrangeButton fullWidth onClick={() => setOpenDialog(true)}>Eliminar cuenta</OrangeButton>
      </Box>

      {/* Diálogo de confirmación */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Eliminar cuenta</DialogTitle>
        <DialogContent>
          <Typography>¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button color="error" onClick={handleEliminar}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
