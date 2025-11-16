import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Usuario = {
  usuarioId?: number;
  nombre?: string;
  email?: string;
  rolId?: number;
  nombreRol?: string;
} | null;

type UsuarioContextType = {
  usuario: Usuario;
  setUsuario: (usuario: Usuario) => void;
};

const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

export const UsuarioProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario>(null);

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

export const useUsuario = () => {
  const context = useContext(UsuarioContext);
  if (!context) {
    throw new Error("useUsuario debe usarse dentro de UsuarioProvider");
  }
  return context;
};
