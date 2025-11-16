import { type Localizacion, saveLocalizacion } from "./localizacionService";
import { type Entrenamiento } from "./entrenamientoService";

export type Club = {
  clubId: number;
  nombre: string;
  descripcion?: string;
  contacto?: string;
  web?: string;
  idLocalizacion: number;
  localizacion?: Localizacion;
  entrenamientos?: Entrenamiento[];
};

const BASE_URL = "http://localhost:8080";

//Listar todos los clubes
export const getClubs = async (): Promise<Club[]> => {
  const response = await fetch(`${BASE_URL}/clubes`);
  if (!response.ok) throw new Error("Error al cargar clubes");
  return await response.json();
};

//Obtener un club por ID 
export const getClubById = async (id: number): Promise<Club> => {
  const response = await fetch(`${BASE_URL}/clubes/${id}`);
  if (!response.ok) throw new Error("Error al cargar club");
  return await response.json();
};

//Crear o actualizar club (con localización incluida si la hay) 
export const saveClub = async (club: Partial<Club>): Promise<Club> => {
  let idLocalizacion = club.idLocalizacion;

  if (club.localizacion) {
    const loc = await saveLocalizacion(club.localizacion);
    idLocalizacion = loc.idLocalizacion;
  }

  const url = club.clubId
    ? `${BASE_URL}/clubes/${club.clubId}`
    : `${BASE_URL}/clubes`;
  const method = club.clubId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...club, idLocalizacion }),
  });

  if (!res.ok) throw new Error("Error al guardar club");
  return await res.json();
};

// Eliminar un club por ID
export const deleteClub = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/clubes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar el club");
};
