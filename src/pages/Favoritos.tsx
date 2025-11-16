import { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from "@mui/material";
import { Link } from "react-router-dom";

import { getUsuarioActual } from "../services/authService";
import { getFavoritosClubByUsuario, deleteFavoritoClub } from "../services/favoritoClubService";
import { getFavoritosCarreraByUsuario, deleteFavoritoCarrera } from "../services/favoritoCarreraService";

export const Favoritos = () => {
  const usuario = getUsuarioActual();
  const [favoritosClubes, setFavoritosClubes] = useState<any[]>([]);
  const [favoritosCarreras, setFavoritosCarreras] = useState<any[]>([]);

  useEffect(() => {
    if (!usuario) return;

    const fetchFavoritos = async () => {
      try {
        const clubes = await getFavoritosClubByUsuario(usuario.usuarioId);
        const carreras = await getFavoritosCarreraByUsuario(usuario.usuarioId);
        setFavoritosClubes(clubes);
        setFavoritosCarreras(carreras);
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
      }
    };

    fetchFavoritos();
  }, [usuario]);

  const handleEliminarClub = async (clubId: number) => {
    if (!usuario) return;
    try {
      await deleteFavoritoClub(usuario.usuarioId, clubId);
      setFavoritosClubes(prev => prev.filter(f => f.clubId !== clubId));
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
    }
  };

  const handleEliminarCarrera = async (carreraId: number) => {
    if (!usuario) return;
    try {
      await deleteFavoritoCarrera(usuario.usuarioId, carreraId);
      setFavoritosCarreras(prev => prev.filter(f => f.carrera.carreraId !== carreraId));
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
    }
  };

  if (!usuario) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">⚠️ Debes iniciar sesión para ver tus favoritos.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom color="text.secondary">Mis Favoritos</Typography>

      {/* --- CLUBES FAVORITOS --- */}
      <Typography variant="h5" sx={{ mt: 3, mb: 2 }} color="text.secondary">Clubes favoritos</Typography>
      {favoritosClubes.length === 0 ? (
        <Typography variant="body1" color="text.secondary">No tienes clubes favoritos aún.</Typography>
      ) : (
        <Grid container spacing={2}>
          {favoritosClubes.map(f => (
            <Grid item xs={12} sm={6} md={4} key={f.clubId}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{f.clubNombre}</Typography>
                  <Typography variant="body2" color="text.primary">
                    {f.clubDescripcion || "Sin descripción"}
                  </Typography>
                </CardContent>
                <CardActions>               
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ backgroundColor: 'primary.main', color: 'white' }}
                    component={Link}
                    to={`/clubs/${f.clubId}`}
                  >
                    Visitar
                  </Button>
                  <Button 
                    size="small" 
                    variant="contained"
                    onClick={() => handleEliminarClub(f.clubId)} 
                    sx={{ backgroundColor: 'secondary.main', color: 'white' }}
                  >
                    Quitar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* --- CARRERAS FAVORITAS --- */}
      <Typography variant="h5" sx={{ mt: 5, mb: 2 }} color="text.secondary">Carreras favoritas</Typography>
      {favoritosCarreras.length === 0 ? (
        <Typography variant="body1" color="text.secondary">No tienes carreras favoritas aún.</Typography>
      ) : (
        <Grid container spacing={2}>
          {favoritosCarreras.map(f => (
            <Grid item xs={12} sm={6} md={4} key={f.carrera.carreraId}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{f.carrera.nombre}</Typography>
                  <Typography variant="body2" color="text.primary">
                    {f.carrera.descripcion || "Sin descripción"}
                  </Typography>
                </CardContent>
                <CardActions> 
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ backgroundColor: 'primary.main', color: 'white' }}
                    component={Link}
                    to={`/races/${f.carrera.carreraId}`}
                  >
                    Visitar
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ backgroundColor: 'secondary.main', color: 'white' }}
                    onClick={() => handleEliminarCarrera(f.carrera.carreraId)}
                  >
                    Quitar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
