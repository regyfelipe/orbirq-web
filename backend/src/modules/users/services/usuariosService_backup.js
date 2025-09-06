import { createUsuario, findByEmail, findByUsername } from "./repositories/usuariosRepository.js"
// import { createAluno } from "../../repositories/alunosRepository.js"
// import { createProfessor } from "../../repositories/professoresRepository.js"
import Usuario from "./models/Usuario.js"
import { hashPassword } from "../../../shared/utils/hashUtils.js"

export async function registrarUsuario(dados) {
  // checar duplicidade
  const existingEmail = await findByEmail(dados.email)
  if (existingEmail) throw new Error("Email já registrado")

  const existingUser = await findByUsername(dados.username)
  if (existingUser) throw new Error("Username já registrado")

  // hash senha
  const senhaHash = await hashPassword(dados.senha)

  // salvar usuário base
  const novoUsuario = await createUsuario({
    ...dados,
    senhaHash,
  })

  // criar relacionamento específico
  if (dados.role === "aluno") {
    await createAluno(novoUsuario.id, dados)
  }
  if (dados.role === "professor") {
    await createProfessor(novoUsuario.id, dados)
  }
  if (dados.role === "administrador") {
    // poderia criar em administradores se precisar
  }

  return new Usuario(novoUsuario)
}
