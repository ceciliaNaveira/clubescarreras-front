import { useState, useEffect } from "react";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";

import { getUsuarioActual } from "../services/authService";
import { isFavoritoCarrera, toggleFavoritoCarrera } from "../services/favoritoCarreraService";
import { isFavoritoClub, toggleFavoritoClub } from "../services/favoritoClubService";

interface FavoriteButtonProps {
  tipo: "club" | "carrera";
  id: number;
}

export const FavoriteButton = ({ tipo, id }: FavoriteButtonProps) => {
  const [isFavorito, setIsFavorito] = useState(false);
  const [cargando, setCargando] = useState(true);
  const usuario = getUsuarioActual();

  useEffect(() => {
    const fetchFavorito = async () => {
      if (!usuario) {
        setCargando(false);
        return;
      }

      try {
        let favorito = false;
        if (tipo === "club") {
          favorito = await isFavoritoClub(usuario.usuarioId, id);
        } else {
          favorito = await isFavoritoCarrera(usuario.usuarioId, id);
        }
        setIsFavorito(favorito);
      } catch (err) {
        console.error("Error comprobando favorito:", err);
      } finally {
        setCargando(false);
      }
    };

    fetchFavorito();
  }, [usuario, tipo, id]);

  const handleToggle = async () => {
    if (!usuario) {
      alert("Debes iniciar sesión para marcar favoritos.");
      return;
    }

    try {
      let nuevoEstado: boolean = isFavorito;

      if (tipo === "club") {
        nuevoEstado = await toggleFavoritoClub(usuario.usuarioId, id);
      } else {
        nuevoEstado = await toggleFavoritoCarrera(usuario.usuarioId, id);
      }

      // Si hubo error al agregar (409), mantenemos rojo si ya existía
      setIsFavorito(nuevoEstado ?? true);
    } catch (err) {
      console.error("Error al cambiar favorito:", err);
      alert("No se pudo actualizar el favorito. Inténtalo de nuevo.");
    }
  };

  return (
    <IconButton
      onClick={handleToggle}
      sx={{ color: isFavorito ? "red" : "gray" }}
      aria-label="Favorito"
      disabled={cargando} // Evita clicks mientras carga
    >
      {isFavorito ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
    </IconButton>
  );
};
