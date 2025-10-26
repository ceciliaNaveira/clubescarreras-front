// src/context/UsuarioContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Definimos la estructura del usuario
export type Usuario = {
  usuarioId?: number;
  nombre?: string;
  email?: string;
  rolId?: number;
  nombreRol?: string;
} | null;

// Definimos lo que tendrá el contexto
type UsuarioContextType = {
  usuario: Usuario;
  setUsuario: (usuario: Usuario) => void;
};

// Creamos el contexto
const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

// Provider que envuelve toda la app
export const UsuarioProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario>(null);

  // Cargamos usuario de localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (stored) setUsuario(JSON.parse(stored));
  }, []);

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};

// Hook para usar el contexto más cómodamente
export const useUsuario = () => {
  const context = useContext(UsuarioContext);
  if (!context) {
    throw new Error("useUsuario debe usarse dentro de UsuarioProvider");
  }
  return context;
};
