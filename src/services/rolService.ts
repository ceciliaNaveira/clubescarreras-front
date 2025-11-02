export type RolRequest = {
  nombreRol: string;
};

const BASE_URL = "http://localhost:8080";

// Listar todos los roles
export const getRoles = async (): Promise<any[]> => {
  const res = await fetch(`${BASE_URL}/roles`);
  if (!res.ok) throw new Error("Error al cargar roles");
  return res.json();
};

// Obtener rol por ID
export const getRolById = async (idRol: number): Promise<any> => {
  const res = await fetch(`${BASE_URL}/roles/${idRol}`);
  if (!res.ok) throw new Error("Error al cargar rol");
  return res.json();
};

// Crear rol
export const createRol = async (rol: RolRequest): Promise<any> => {
  const res = await fetch(`${BASE_URL}/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rol),
  });

  if (!res.ok) throw new Error("Error al crear rol");
  return res.json();
};

// Actualizar rol por ID
export const updateRol = async (idRol: number, rol: RolRequest): Promise<any> => {
  const res = await fetch(`${BASE_URL}/roles/${idRol}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rol),
  });

  if (!res.ok) throw new Error("Error al actualizar rol");
  return res.json();
};

// Eliminar rol por ID
export const deleteRol = async (idRol: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/roles/${idRol}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar rol");
};

// Permite búsqueda parcial o completa por nombreRol
export const buscarRoles = async (nombre: string): Promise<any[]> => {
  const query = new URLSearchParams({ nombre }).toString();
  const res = await fetch(`${BASE_URL}/roles/buscar?${query}`);
  if (!res.ok) throw new Error("Error al buscar roles");
  return res.json();
};
