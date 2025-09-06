// services/feedbacksService.js
import * as feedbacksRepo from "../repositories/feedbacksRepository.js"
import * as statsRepo from "../../questions/repositories/questoesStatsRepository.js"

function buildTree(rows) {
  const map = {}
  const roots = []

  rows.forEach(r => {
    map[r.id] = { 
      id: r.id,
      aluno: r.aluno,
      comentario: r.comentario,
      criadoEm: r.criado_em,
      respostas: []
    }
  })

  rows.forEach(r => {
    if (r.parent_id) {
      map[r.parent_id]?.respostas.push(map[r.id])
    } else {
      roots.push(map[r.id])
    }
  })

  return roots
}

export async function enviarFeedback(data) {
  const feedback = await feedbacksRepo.salvarFeedback(data)
  await statsRepo.atualizarStatsFeedback(data.questaoId)
return feedback[0] // primeiro registro

  
  
}

export async function listarFeedbacksQuestao(questaoId) {
  const rows = await feedbacksRepo.listarFeedbacksQuestao(questaoId)
  return buildTree(rows)
}
