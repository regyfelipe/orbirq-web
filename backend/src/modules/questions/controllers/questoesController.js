import { getAllQuestoes, getQuestaoById } from '../services/questoesService.js'

export async function listarQuestoes(req, res) {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const questoes = await getAllQuestoes(page, limit)
    res.json(questoes)
  } catch (err) {
    console.error('Erro ao listar questões:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}


export async function buscarQuestao(req, res) {
  try {
    const questao = await getQuestaoById(req.params.id)
    if (!questao) {
      return res.status(404).json({ error: 'Questão não encontrada' })
    }
    res.json(questao)
  } catch (err) {
    console.error('Erro ao buscar questão:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
