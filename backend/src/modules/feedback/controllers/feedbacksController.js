// controllers/feedbacksController.js
import * as feedbacksService from "../services/feedbacksService.js"

export async function enviar(req, res) {
  try {
    const { questaoId, comentario, rating, parentId, alunoId } = req.body

    if (!alunoId || !questaoId || !comentario) {
      return res.status(400).json({ error: "alunoId, questaoId e comentario são obrigatórios" })
    }

    const feedback = await feedbacksService.enviarFeedback({
      alunoId,
      questaoId,
      comentario,
      rating: rating ?? null,
      parentId: parentId ?? null
    })

    res.status(201).json(feedback)
  } catch (err) {
    console.error("Erro ao salvar feedback:", err)
    res.status(500).json({ error: "Erro ao salvar feedback" })
  }
}


export async function listarPorQuestao(req, res) {
  try {
    const feedbacks = await feedbacksService.listarFeedbacksQuestao(req.params.questaoId)
    res.json(feedbacks)
  } catch (err) {
    console.error("Erro ao listar feedbacks:", err)
    res.status(500).json({ error: "Erro ao listar feedbacks" })
  }
}
