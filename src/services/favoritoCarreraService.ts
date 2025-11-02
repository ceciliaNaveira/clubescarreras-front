const BASE_URL = "http://localhost:8080/favoritos-carrera";

// Devuelve los favoritos de carreras de un usuario (con id, nombre y descripción)
export const getFavoritosCarreraByUsuario = async (usuarioId: number) => {
  const res = await fetch(`${BASE_URL}/usuario/${usuarioId}`);
  if (!res.ok) throw new Error("Error al cargar favoritos del usuario");

  const data = await res.json();

  // Mantener la estructura esperada en el frontend
  return data.map((f: any) => ({
    carrera: {
      carreraId: f.carrera.carreraId,
      nombre: f.carrera.nombre,
      descripcion: f.carrera.descripcion
    }
  }));
};

// Añade un favorito de carrera
export const addFavoritoCarrera = async (usuarioId: number, carreraId: number) => {
  const res = await fetch(`${BASE_URL}?usuarioId=${usuarioId}&carreraId=${carreraId}`, {
    method: "POST",
  });

  if (res.status === 409) {
    // Ya existe, no lanzamos error
    return null;
  }

  if (!res.ok) throw new Error("Error al agregar favorito");
  return res.json();
};

// Elimina un favorito de carrera
export const deleteFavoritoCarrera = async (usuarioId: number, carreraId: number) => {
  const res = await fetch(`${BASE_URL}?usuarioId=${usuarioId}&carreraId=${carreraId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar favorito");
};

// Comprueba si una carrera es favorita para un usuario
export const isFavoritoCarrera = async (usuarioId: number, carreraId: number) => {
  const favoritos = await getFavoritosCarreraByUsuario(usuarioId);
  return favoritos.some(f => f.carrera.carreraId === carreraId);
};

// Alterna el estado de favorito
export const toggleFavoritoCarrera = async (usuarioId: number, carreraId: number) => {
  const esFavorito = await isFavoritoCarrera(usuarioId, carreraId);

  if (esFavorito) {
    await deleteFavoritoCarrera(usuarioId, carreraId);
    return false;
  } else {
    await addFavoritoCarrera(usuarioId, carreraId);
    return true;
  }
};
