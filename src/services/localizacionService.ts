export type Localizacion = {
  localizacionId: number; 
  provincia: string;
  municipio: string;
  codigoPostal?: string;
  direccion?: string;
  latitud: number;
  longitud: number;
};

const BASE_URL = "http://localhost:8080";

/** Listar todas las localizaciones */
export const getLocalizaciones = async (): Promise<Localizacion[]> => {
  const response = await fetch(`${BASE_URL}/localizaciones`);
  if (!response.ok) throw new Error("Error al cargar localizaciones");
  return await response.json();
};

/** Obtener localización por ID */
export const getLocalizacionById = async (id: number): Promise<Localizacion> => {
  const response = await fetch(`${BASE_URL}/localizaciones/${id}`);
  if (!response.ok) throw new Error("Error al cargar localización");
  return await response.json();
};

/** Crear o actualizar localización */
export const saveLocalizacion = async (loc: Partial<Localizacion>): Promise<Localizacion> => {
  const url = loc.localizacionId
    ? `${BASE_URL}/localizaciones/${loc.localizacionId}`
    : `${BASE_URL}/localizaciones`;
  const method = loc.localizacionId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loc),
  });

  if (!res.ok) throw new Error("Error al guardar localización");
  return await res.json();
};

/** Eliminar una localización */
export const deleteLocalizacion = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/localizaciones/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar localización");
};
