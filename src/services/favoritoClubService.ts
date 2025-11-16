export type FavoritoClub = {
  usuarioId: number;
  usuarioNombre?: string;
  clubId: number;
  clubNombre?: string;
};

const BASE_URL = "http://localhost:8080/favoritos";

// Listar todos los favoritos 
export const getFavoritosClub = async (): Promise<FavoritoClub[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Error al cargar los favoritos de clubes");
  return res.json();
};

// Obtener los favoritos de un usuario 
export const getFavoritosClubByUsuario = async (usuarioId: number): Promise<FavoritoClub[]> => {
  const res = await fetch(`${BASE_URL}/usuario/${usuarioId}`);
  if (!res.ok) throw new Error("Error al cargar los favoritos del usuario");
  return res.json();
};

// Obtener los favoritos de un club 
export const getFavoritosClubByClub = async (clubId: number): Promise<FavoritoClub[]> => {
  const res = await fetch(`${BASE_URL}/club/${clubId}`);
  if (!res.ok) throw new Error("Error al cargar los favoritos del club");
  return res.json();
};

// Agregar un club a los favoritos del usuario 
export const addFavoritoClub = async (usuarioId: number, clubId: number): Promise<FavoritoClub> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuarioId, clubId }),
  });

  if (!res.ok) {
    if (res.status === 409) {
      return { usuarioId, clubId } as FavoritoClub;
    }
    throw new Error("Error al agregar favorito");
  }
  return res.json();
};

// Eliminar un club de los favoritos del usuario 
export const deleteFavoritoClub = async (usuarioId: number, clubId: number): Promise<void> => {
  const params = new URLSearchParams({ usuarioId: usuarioId.toString(), clubId: clubId.toString() });
  const res = await fetch(`${BASE_URL}?${params}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar favorito");
};

// Comprobar si un club ya está en favoritos 
export const isFavoritoClub = async (usuarioId: number, clubId: number): Promise<boolean> => {
  const favoritos = await getFavoritosClubByUsuario(usuarioId);
  return favoritos.some(f => f.clubId === clubId);
};

// Alternar favorito (añadir o quitar según corresponda) 
export const toggleFavoritoClub = async (usuarioId: number, clubId: number): Promise<boolean> => {
  const favoritos = await getFavoritosClubByUsuario(usuarioId);
  const existe = favoritos.some(f => f.clubId === clubId);

  if (existe) {
    await deleteFavoritoClub(usuarioId, clubId);
    return false;
  } else {
    await addFavoritoClub(usuarioId, clubId);
    return true;
  }
};
