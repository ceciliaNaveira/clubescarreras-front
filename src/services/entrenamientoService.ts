export type Entrenamiento = {
  entrenamientoId: number;
  clubId: number;
  diaSemana: string;
  lugarEntrenamiento: string;
  nivel: string;
  descripcion?: string;
};

const BASE_URL = "http://localhost:8080";

// Listar todos los entrenamientos 
export const getEntrenamientos = async (): Promise<Entrenamiento[]> => {
  const res = await fetch(`${BASE_URL}/entrenamientos`);
  if (!res.ok) throw new Error("Error al cargar entrenamientos");
  return await res.json();
};

// Obtener entrenamiento por ID 
export const getEntrenamientoById = async (id: number): Promise<Entrenamiento> => {
  const res = await fetch(`${BASE_URL}/entrenamientos/${id}`);
  if (!res.ok) throw new Error("Error al cargar entrenamiento");
  return await res.json();
};

// Buscar entrenamientos filtrando opcionalmente por club o día
export const buscarEntrenamientos = async (
  clubId?: number,
  diaSemana?: string
): Promise<Entrenamiento[]> => {
  const params: Record<string, string> = {};
  if (clubId) params.clubId = clubId.toString();
  if (diaSemana) params.diaSemana = diaSemana;

  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/entrenamientos/buscar${query ? `?${query}` : ""}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al buscar entrenamientos");
  return await res.json();
};

// Crear o actualizar entrenamiento 
export const saveEntrenamiento = async (ent: Partial<Entrenamiento>): Promise<Entrenamiento> => {
  const url = ent.entrenamientoId
    ? `${BASE_URL}/entrenamientos/${ent.entrenamientoId}`
    : `${BASE_URL}/entrenamientos`;
  const method = ent.entrenamientoId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ent),
  });

  if (!res.ok) throw new Error("Error al guardar entrenamiento");
  return await res.json();
};

// Eliminar entrenamiento 
export const deleteEntrenamiento = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/entrenamientos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar entrenamiento");
};

// Obtener entrenamientos de un club por su ID 
export const getEntrenamientosByClubId = async (clubId: number): Promise<Entrenamiento[]> => {
  return buscarEntrenamientos(clubId);
};
