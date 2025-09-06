// Simulação de banco de dados em memória
const questions = new Map();

export async function createQuestion(questionData) {
  try {
    const id = `q${Date.now()}`;
    const question = {
      id,
      status: 'ativo',
      versao: 1,
      ...questionData,
      data_criacao: new Date().toISOString(),
      ultima_atualizacao: new Date().toISOString(),
      estatisticas: {
        vezesRespondida: 0,
        taxaAcerto: 0,
        tempoMedioRespostaSegundos: 0,
        rating: 0,
        feedbackAlunos: [],
        taxaErroPorOpcao: {}
      },
      licenca_uso: 'premium',
      custo_criacao: 5.00,
      schema_version: 2,
      monetizacao: {
        modelo: 'assinatura',
        valor_por_acesso: 0.00
      },
      protecao: {
        hash: null,
        assinatura_digital: null
      },
      gamificacao: {
        xp: 0,
        medalha: null
      },
      ia: {
        gerado_por: 'humano',
        dicas: []
      }
    };

    questions.set(id, question);
    console.log('Questão criada:', question);
    return question;
  } catch (error) {
    console.error('Erro ao criar questão:', error);
    throw error;
  }
}

export async function getQuestions(filters = {}) {
  try {
    const { page = 1, limit = 10, disciplina, dificuldade } = filters;
    let filteredQuestions = Array.from(questions.values());

    if (disciplina) {
      filteredQuestions = filteredQuestions.filter(q => q.disciplina === disciplina);
    }

    if (dificuldade) {
      filteredQuestions = filteredQuestions.filter(q => q.nivel_dificuldade === dificuldade);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

    return {
      data: paginatedQuestions,
      total: filteredQuestions.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredQuestions.length / limit)
    };
  } catch (error) {
    console.error('Erro ao buscar questões:', error);
    throw error;
  }
}

export async function getQuestionById(id) {
  try {
    return questions.get(id) || null;
  } catch (error) {
    console.error('Erro ao buscar questão por ID:', error);
    throw error;
  }
}

export async function updateQuestion(id, updateData) {
  try {
    if (!questions.has(id)) {
      return null;
    }

    const question = questions.get(id);
    const updatedQuestion = {
      ...question,
      ...updateData,
      ultima_atualizacao: new Date().toISOString()
    };

    questions.set(id, updatedQuestion);
    return updatedQuestion;
  } catch (error) {
    console.error('Erro ao atualizar questão:', error);
    throw error;
  }
}

export async function deleteQuestion(id) {
  try {
    return questions.delete(id);
  } catch (error) {
    console.error('Erro ao deletar questão:', error);
    throw error;
  }
}