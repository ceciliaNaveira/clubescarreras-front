export type UsuarioRequest = {
  nombre: string;
  email: string;
  contraseña: string;
  rolId: number;
};

const BASE_URL = "http://localhost:8080";

// Listar todos los usuarios
export const getUsuarios = async (): Promise<any[]> => {
  const res = await fetch(`${BASE_URL}/usuarios`);
  if (!res.ok) throw new Error("Error al cargar usuarios");
  return res.json();
};

// Obtener usuario por ID
export const getUsuarioById = async (idUsuario: number): Promise<any> => {
  const res = await fetch(`${BASE_URL}/usuarios/${idUsuario}`);
  if (!res.ok) throw new Error("Error al cargar usuario");
  return res.json();
};

// Crear usuario
export const createUsuario = async (usuario: UsuarioRequest): Promise<any> => {
  const res = await fetch(`${BASE_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });

  if (!res.ok) throw new Error("Error al crear usuario");
  return res.json();
};

// Actualizar usuario por ID
export const updateUsuario = async (idUsuario: number, usuario: UsuarioRequest): Promise<any> => {
  const res = await fetch(`${BASE_URL}/usuarios/${idUsuario}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });

  if (!res.ok) throw new Error("Error al actualizar usuario");
  return res.json();
};

// Eliminar usuario por ID
export const deleteUsuario = async (idUsuario: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/usuarios/${idUsuario}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar usuario");
};
// Guardar usuario (crear o actualizar)
export const saveUsuario = async (usuario: Partial<UsuarioRequest> & { usuarioId?: number }): Promise<any> => {
  if (usuario.usuarioId) {
    // Actualizar
    return updateUsuario(usuario.usuarioId, usuario as UsuarioRequest);
  } else {
    // Crear
    return createUsuario(usuario as UsuarioRequest);
  }
};

// Login de usuario
export const loginUsuario = async (email: string, contraseña: string): Promise<any> => {
  const res = await fetch(`${BASE_URL}/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, contraseña }),
  });

  if (!res.ok) {
    throw new Error("Email o contraseña incorrectos");
  }

  return res.json(); // aquí recibes los datos del usuario logueado
};

// filtros opcionales: nombre, email, rolId
export const buscarUsuarios = async (filtros: Partial<UsuarioRequest> & { rolId?: number }): Promise<any[]> => {
  const query = new URLSearchParams(filtros as any).toString();
  const res = await fetch(`${BASE_URL}/usuarios/buscar?${query}`);
  if (!res.ok) throw new Error("Error al buscar usuarios");
  return res.json();
};
