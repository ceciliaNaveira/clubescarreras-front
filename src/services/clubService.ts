export type Localizacion = {
  idLocalizacion: number;
  provincia: string;
  municipio: string;
  codigoPostal?: string;
  direccion?: string;
  latitud: number;
  longitud: number;
};

export type Entrenamiento = {
  idEntrenamiento: number;
  clubId: number;
  diaSemana: string;
  lugarEntrenamiento: string;
  nivel: string;
  descripcion?: string;
};

export type Club = {
  idClub: number;
  nombre: string;
  descripcion?: string;
  contacto?: string;
  web?: string;
  localizacionId: number;
  localizacion?: Localizacion;
  entrenamientos?: Entrenamiento[];
};

const BASE_URL = "http://localhost:8080";

/** Mapear DTO de club */
const mapClub = (c: any): Club => ({
  idClub: c.clubId,
  nombre: c.nombre,
  descripcion: c.descripcion,
  contacto: c.contacto,
  web: c.web,
  localizacionId: c.localizacionId,
});

/** Listar todos los clubes */
export const getClubs = async (): Promise<Club[]> => {
  const response = await fetch(`${BASE_URL}/clubes`);
  if (!response.ok) throw new Error("Error al cargar clubes");
  const data = await response.json();
  return data.map(mapClub);
};

/** Obtener localización por ID */
export const getLocalizacionById = async (id: number): Promise<Localizacion> => {
  const response = await fetch(`${BASE_URL}/localizaciones/${id}`);
  if (!response.ok) throw new Error("Error al cargar localización");
  return await response.json();
};

/** Obtener entrenamientos filtrando opcionalmente por club y día */
export const getEntrenamientosByClubId = async (
  clubId?: number,
  diaSemana?: string
): Promise<Entrenamiento[]> => {
  const params: Record<string, string> = {};
  if (clubId && clubId > 0) params.clubId = clubId.toString();
  if (diaSemana) params.diaSemana = diaSemana;

  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/entrenamientos/buscar${query ? `?${query}` : ""}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Error al cargar entrenamientos");
  return await response.json();
};

/** Obtener un club por ID */
export const getClubById = async (id: number): Promise<Club> => {
  const response = await fetch(`${BASE_URL}/clubes/${id}`);
  if (!response.ok) throw new Error("Error al cargar club");
  const c = await response.json();
  return mapClub(c);
};
