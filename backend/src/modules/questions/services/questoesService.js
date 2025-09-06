import { findAll, findById, countAll } from "../repositories/questoesRepository.js"
import Questao from "../models/Questao.js"

export async function getAllQuestoes(page = 1, limit = 10) {
  const offset = (page - 1) * limit
  const rows = await findAll(limit, offset)
  const total = await countAll()

  return {
    data: rows.map(r => new Questao(r)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getQuestaoById(id) {
  const row = await findById(id)
  return row ? new Questao(row) : null
}
