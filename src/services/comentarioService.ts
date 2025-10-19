// src/services/comentarioService.ts

export type Comentario = {
  idComentario: number;
  usuario: string;
  texto: string;
  fecha: string;
  idClub: number;
};

// Usar variable de entorno para backend
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export const getComentariosByClubId = async (idClub: number): Promise<Comentario[]> => {
  const params = new URLSearchParams({ idClub: idClub.toString() });
  const response = await fetch(`${BASE_URL}/comentarios/buscar?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Error al obtener comentarios: ${response.statusText}`);
  }

  return response.json(); // aquí sí recibimos JSON
};

// Otros endpoints opcionales
export const createComentario = async (comentario: Partial<Comentario>) => {
  const response = await fetch(`${BASE_URL}/comentarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comentario),
  });
  if (!response.ok) throw new Error("Error al crear comentario");
  return response.json();
};

export const updateComentario = async (id: number, comentario: Partial<Comentario>) => {
  const response = await fetch(`${BASE_URL}/comentarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comentario),
  });
  if (!response.ok) throw new Error("Error al actualizar comentario");
  return response.json();
};

export const deleteComentario = async (id: number) => {
  const response = await fetch(`${BASE_URL}/comentarios/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Error al eliminar comentario");
  return response.json();
};
