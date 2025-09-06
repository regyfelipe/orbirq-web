const API_URL = "http://localhost:3000";

export type Role = "aluno" | "professor" | "administrador";

export interface UsuarioPayload {
  role: Role;
  nomeCompleto: string;
  username: string;
  email: string;
  senha: string;
  fotoPerfilUrl?: string | null;
  telefone?: string | null;
  genero?: "masculino" | "feminino" | "outro" | null;
  dataNascimento?: string | null;
  pais: string;
  estado: string;
  cidade: string;
  curso?: string | null;
  nivel?: string | null;
  instituicao?: string | null;
  turma?: string | null;
  bio?: string | null;
}


export async function registerUser(data: UsuarioPayload) {
  const res = await fetch(`${API_URL}/usuarios/cadastro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Erro ao registrar usuário");
  }

  return res.json();
}
