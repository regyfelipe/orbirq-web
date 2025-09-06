import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type Usuario } from "../services/AuthContext";
import { loginUser } from "../services/auth";


export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const tokenSalvo = localStorage.getItem("token");
    const usuarioSalvo = localStorage.getItem("usuario");

    if (tokenSalvo && usuarioSalvo) {
      setToken(tokenSalvo);
      setUsuario(JSON.parse(usuarioSalvo));
    }

    setCarregando(false);
  }, []);

  async function login(emailOrUsername: string, senha: string) {
    setCarregando(true);
    try {
      const { token, usuario } = await loginUser(emailOrUsername, senha);

      setToken(token);
      setUsuario(usuario);

      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));
    } finally {
      setCarregando(false);
    }
  }

  function logout() {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  }

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}
