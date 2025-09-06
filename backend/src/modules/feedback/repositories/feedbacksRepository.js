import db from "../../../shared/database/connection.js"

export async function salvarFeedback({ alunoId, questaoId, comentario, rating, parentId }) {
  const result = await db`
    INSERT INTO feedbacks (aluno_id, questao_id, comentario, rating, parent_id)
    VALUES (
      ${alunoId ?? null},
      ${questaoId},
      ${comentario},
      ${rating ?? null},
      ${parentId ?? null}
    )
    RETURNING *
  `
  return result
}


export async function listarFeedbacksQuestao(questaoId) {
  const rows = await db`
    SELECT f.id,
           f.comentario,
           f.criado_em,
           u.nome_completo AS aluno,
           f.parent_id
    FROM feedbacks f
    JOIN usuarios u ON u.id = f.aluno_id
    WHERE f.questao_id = ${questaoId}
    ORDER BY f.criado_em ASC
  `
  return rows
}

