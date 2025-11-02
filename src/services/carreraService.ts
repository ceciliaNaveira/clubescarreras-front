export type Carrera = {
  carreraId: number;
  clubId?: number;
  localizacionId: number;
  nombre: string;
  descripcion?: string;
  fecha: string; 
  distanciaKm?: number;
  webOficial?: string;
  posterUrl?: string;
  clubNombre?: string;
  provincia?: string;
  municipio?: string;
};

const BASE_URL = "http://localhost:8080";

const mapCarrera = (c: any): Carrera => ({
  carreraId: c.carreraId,
  clubId: c.clubId,
  localizacionId: c.localizacionId,
  nombre: c.nombre,
  descripcion: c.descripcion,
  fecha: c.fecha,
  distanciaKm: c.distanciaKm,
  webOficial: c.webOficial,
  posterUrl: c.posterUrl,
  clubNombre: c.clubNombre,
  provincia: c.provincia,
  municipio: c.municipio,
});

// Listar todas las carreras
export const getCarreras = async (): Promise<Carrera[]> => {
  const res = await fetch(`${BASE_URL}/carreras`);
  if (!res.ok) throw new Error("Error al cargar carreras");
  const data = await res.json();
  return data.map(mapCarrera);
};

// Obtener carrera por ID
export const getCarreraById = async (id: number): Promise<Carrera> => {
  const res = await fetch(`${BASE_URL}/carreras/${id}`);
  if (!res.ok) throw new Error("Error al cargar carrera");
  return mapCarrera(await res.json());
};

// Crear o actualizar carrera
export const saveCarrera = async (carrera: Partial<Carrera>): Promise<Carrera> => {
  const url = carrera.carreraId ? `${BASE_URL}/carreras/${carrera.carreraId}` : `${BASE_URL}/carreras`;
  const method = carrera.carreraId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(carrera),
  });

  if (!res.ok) throw new Error("Error al guardar carrera");
  return mapCarrera(await res.json());
};

// Eliminar carrera
export const deleteCarrera = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/carreras/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar carrera");
};

// Buscar carreras por filtros opcionales
export const buscarCarreras = async (filtros: Partial<Carrera>): Promise<Carrera[]> => {
  const query = new URLSearchParams(filtros as any).toString();
  const res = await fetch(`${BASE_URL}/carreras/buscar?${query}`);
  if (!res.ok) throw new Error("Error al buscar carreras");
  const data = await res.json();
  return data.map(mapCarrera);
};
