export interface LoginRequest {
  emailOrUsername: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  usuario: {
    id: number;
    nome: string;
    role: string;
  };
}

export interface User {
  id: number;
  nome_completo: string;
  email: string;
  username: string;
  role: string;
  foto_perfil_url?: string;
  telefone?: string;
  genero?: string;
  data_nascimento?: Date;
  pais?: string;
  estado?: string;
  cidade?: string;
  curso?: string;
  nivel?: string;
  instituicao?: string;
  turma?: string;
  bio?: string;
  data_criacao: Date;
}