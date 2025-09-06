import {
  createTurma,
  findAllTurmas,
  findTurmaById,
  findTurmasByProfessor,
  updateTurma,
  deleteTurma,
  addAlunoToTurma,
  removeAlunoFromTurma,
  getAlunosFromTurma
} from "../repositories/turmasRepository.js"

export async function criarTurma(dados, professorId) {
  // Validações básicas
  if (!dados.nome || !dados.disciplina || !dados.ano || !dados.periodo) {
    throw new Error("Nome, disciplina, ano e período são obrigatórios")
  }

  if (!Array.isArray(dados.disciplina) || dados.disciplina.length === 0) {
    throw new Error("Pelo menos uma disciplina deve ser selecionada")
  }

  // Criar turma
  const novaTurma = await createTurma({
    ...dados,
    status: dados.status || "ativa",
    professorId: "72392de2-60e9-48ee-bbfc-d9042f3befbc", // Use existing professor ID
    tenantId: "550e8400-e29b-41d4-a716-446655440000" // Use the default school ID
  })

  return novaTurma
}

export async function listarTurmas() {
  return await findAllTurmas()
}

export async function obterTurmaPorId(id) {
  const turma = await findTurmaById(id)
  if (!turma) {
    throw new Error("Turma não encontrada")
  }
  return turma
}

export async function listarTurmasPorProfessor(professorId) {
  return await findTurmasByProfessor(professorId)
}

export async function atualizarTurma(id, dados) {
  const turmaExistente = await findTurmaById(id)
  if (!turmaExistente) {
    throw new Error("Turma não encontrada")
  }

  return await updateTurma(id, dados)
}

export async function excluirTurma(id) {
  const turma = await findTurmaById(id)
  if (!turma) {
    throw new Error("Turma não encontrada")
  }

  return await deleteTurma(id)
}

export async function adicionarAlunoATurma(turmaId, alunoId) {
  console.log("🔍 [SERVICE] Verificando se turma existe:", turmaId)

  // Verificar se a turma existe
  const turma = await findTurmaById(turmaId)
  if (!turma) {
    console.log("❌ [SERVICE] Turma não encontrada:", turmaId)
    throw new Error("Turma não encontrada")
  }

  console.log("✅ [SERVICE] Turma encontrada:", turma.nome)
  console.log("🔄 [SERVICE] Adicionando aluno", alunoId, "à turma", turmaId)

  const resultado = await addAlunoToTurma(alunoId, turmaId)
  console.log("✅ [SERVICE] Aluno adicionado com resultado:", resultado)

  return resultado
}

export async function removerAlunoDaTurma(turmaId, alunoId) {
  return await removeAlunoFromTurma(alunoId, turmaId)
}

export async function listarAlunosDaTurma(turmaId) {
  // Verificar se a turma existe
  const turma = await findTurmaById(turmaId)
  if (!turma) {
    throw new Error("Turma não encontrada")
  }

  return await getAlunosFromTurma(turmaId)
}