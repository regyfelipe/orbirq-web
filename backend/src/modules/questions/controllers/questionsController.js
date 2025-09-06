import { create, findAll, findById, update, remove, countAll } from '../repositories/questoesRepository.js';

export async function createQuestionController(req, res) {
  try {
    const questionData = req.body;

    // Se há informações do usuário atual, usar para definir o autor
    if (questionData.usuarioAtual) {
      questionData.autoria = {
        principal: questionData.usuarioAtual.nome || questionData.usuarioAtual.username || questionData.usuarioAtual.email || "Professor(a)",
        revisores: []
      };
    }

    const question = await create(questionData);
    res.status(201).json(question);
  } catch (error) {
    console.error('Erro ao criar questão:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function getQuestionsController(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [questions, total] = await Promise.all([
      findAll(parseInt(limit), offset),
      countAll()
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: questions,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages
    });
  } catch (error) {
    console.error('Erro ao buscar questões:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function getQuestionController(req, res) {
  try {
    const { id } = req.params;
    const question = await findById(id);
    if (!question) {
      return res.status(404).json({ error: 'Questão não encontrada' });
    }
    res.json(question);
  } catch (error) {
    console.error('Erro ao buscar questão:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function updateQuestionController(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const question = await update(id, updateData);
    if (!question) {
      return res.status(404).json({ error: 'Questão não encontrada' });
    }
    res.json(question);
  } catch (error) {
    console.error('Erro ao atualizar questão:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function deleteQuestionController(req, res) {
  try {
    const { id } = req.params;
    const deleted = await remove(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Questão não encontrada' });
    }
    res.json({ message: 'Questão deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar questão:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}