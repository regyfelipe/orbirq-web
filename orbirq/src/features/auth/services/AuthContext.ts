import { createContext, useContext } from "react";

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  username?: string;
};

export type AuthContextType = {
  usuario: Usuario | null;
  token: string | null;
  login: (emailOrUsername: string, senha: string) => Promise<void>;
  logout: () => void;
  carregando: boolean;
};

// 👇 exporta só o contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 👇 exporta só o hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
