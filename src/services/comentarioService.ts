// comentarioService.ts

export type ComentarioRequest = {
  usuarioId: number;
  clubId: number;
  texto: string;
  valoracion: number; // 1 a 5
};

const BASE_URL = "http://localhost:8080";

// ==========================
// ENDPOINTS
// ==========================

// Listar todos los comentarios
export const getComentarios = async (): Promise<any[]> => {
  const res = await fetch(`${BASE_URL}/comentarios`);
  if (!res.ok) throw new Error("Error al cargar comentarios");
  return res.json();
};

// Obtener comentario por ID
export const getComentarioById = async (id: number): Promise<any> => {
  const res = await fetch(`${BASE_URL}/comentarios/${id}`);
  if (!res.ok) throw new Error("Error al cargar comentario");
  return res.json();
};

// Crear comentario
export const createComentario = async (comentario: ComentarioRequest): Promise<any> => {
  const res = await fetch(`${BASE_URL}/comentarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comentario),
  });

  if (!res.ok) throw new Error("Error al crear comentario");
  return res.json();
};

// Actualizar comentario por ID
export const updateComentario = async (id: number, comentario: ComentarioRequest): Promise<any> => {
  const res = await fetch(`${BASE_URL}/comentarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comentario),
  });

  if (!res.ok) throw new Error("Error al actualizar comentario");
  return res.json();
};

// Eliminar comentario por ID
export const deleteComentario = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/comentarios/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar comentario");
};
// Obtener comentarios de un club por su ID
export const getComentariosByClubId = async (clubId: number) => {
  return buscarComentarios({ clubId });
};
// ==========================
// BUSCAR COMENTARIOS POR FILTROS
// ==========================
// filtros opcionales: usuarioId, clubId
export const buscarComentarios = async (filtros: { usuarioId?: number; clubId?: number }): Promise<any[]> => {
  const query = new URLSearchParams(filtros as any).toString();
  const res = await fetch(`${BASE_URL}/comentarios/buscar?${query}`);
  if (!res.ok) throw new Error("Error al buscar comentarios");
  return res.json();
};
