// Guarda los datos del usuario actual en localStorage 
export const setUsuarioActual = (usuario: any): void => {
  localStorage.setItem("usuario", JSON.stringify(usuario));
};

// Obtiene el usuario actual (si hay sesión iniciada)
export const getUsuarioActual = (): any | null => {
  const data = localStorage.getItem("usuario");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

// Elimina la sesión del usuario (logout)
export const logoutUsuario = (): void => {
  localStorage.removeItem("usuario");
};
