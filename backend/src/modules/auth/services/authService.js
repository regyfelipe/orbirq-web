import { findUserByEmail, findUserByUsername } from "../repositories/authRepository.js";
import { comparePassword } from "../../../shared/utils/hashUtils.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersegredo123";

export async function loginUsuario(emailOrUsername, senha) {
  // Buscar por email ou username
  let usuario = await findUserByEmail(emailOrUsername);
  if (!usuario) usuario = await findUserByUsername(emailOrUsername);
  if (!usuario) throw new Error("Usuário não encontrado");

  // Comparar senha
  const valid = await comparePassword(senha, usuario.senha_hash);
  if (!valid) throw new Error("Senha incorreta");

  // Gerar token JWT
  const token = jwt.sign(
    { id: usuario.id, role: usuario.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, usuario: { id: usuario.id, nome: usuario.nome_completo, role: usuario.role } };
}
