import { registrarUsuario, listarUsuariosPorRole } from "../services/usuariosService.js"

export async function cadastroUsuario(req, res) {
  try {
    const usuario = await registrarUsuario(req.body)
    res.status(201).json(usuario)
  } catch (err) {
    console.error("Erro no cadastro:", err)
    res.status(400).json({ error: err.message })
  }
}

export async function listarUsuariosPorRoleController(req, res) {
  try {
    const { role } = req.query
    if (!role) {
      return res.status(400).json({ error: "Role é obrigatório" })
    }
    const usuarios = await listarUsuariosPorRole(role)
    res.json(usuarios)
  } catch (err) {
    console.error("Erro ao listar usuários:", err)
    res.status(500).json({ error: "Erro interno do servidor" })
  }
}
