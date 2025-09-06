const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function loginUser(emailOrUsername: string, senha: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailOrUsername, senha }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Erro ao fazer login");
  }

  return res.json(); // { token, usuario }
}
