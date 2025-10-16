export type Club = {
  idClub: number;
  nombre: string;
  descripcion?: string;
  contacto?: string;
  web?: string;
  localizacion: {
    idLocalizacion: number;
    provincia: string;
    municipio: string;
    codigoPostal?: string;
    direccion?: string;
    latitud: number;
    longitud: number;
  };
  entrenamientos?: {
    idEntrenamiento: number;
    diaSemana: string;
    lugarEntrenamiento: string;
    nivel: string;
    descripcion?: string;
  }[];
};

const BASE_URL = "http://localhost:8080";

/** Listar todos los clubes */
export const getClubs = async (): Promise<Club[]> => {
  const response = await fetch(`${BASE_URL}/clubes`);
  if (!response.ok) throw new Error("Error al cargar clubes");
  return response.json();
};

/** Buscar clubes por filtros opcionales */
export const getClubsByDiaSemana = async (diaSemana?: string): Promise<Club[]> => {
  let url = `${BASE_URL}/clubes`;
  if (diaSemana) {
    const params = new URLSearchParams({ diaSemana });
    url = `${BASE_URL}/clubes/buscar?${params.toString()}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error("Error al buscar clubes");
  return response.json();
};
