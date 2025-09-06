import {
  criarTurma,
  listarTurmas,
  obterTurmaPorId,
  listarTurmasPorProfessor,
  atualizarTurma,
  excluirTurma,
  adicionarAlunoATurma,
  removerAlunoDaTurma,
  listarAlunosDaTurma
} from "../services/turmasService.js"

export async function criarTurmaController(req, res) {
  try {
    // For now, use a default professor ID since there's no auth system
    const professorId = req.body.professorId || "550e8400-e29b-41d4-a716-446655440000"
    const turma = await criarTurma(req.body, professorId)
    res.status(201).json(turma)
  } catch (err) {
    console.error("Erro ao criar turma:", err)
    res.status(400).json({ error: err.message })
  }
}

export async function listarTurmasController(req, res) {
  try {
    console.log("📋 [BACKEND] Listando todas as turmas")
    const turmas = await listarTurmas()
    console.log("✅ [BACKEND] Turmas encontradas:", turmas.length, "turmas")
    console.log("📄 [BACKEND] Detalhes das turmas:", turmas)
    res.json(turmas)
  } catch (err) {
    console.error("❌ [BACKEND] Erro ao listar turmas:", err)
    res.status(500).json({ error: "Erro interno do servidor" })
  }
}

export async function obterTurmaController(req, res) {
  try {
    const { id } = req.params
    const turma = await obterTurmaPorId(id)
    res.json(turma)
  } catch (err) {
    console.error("Erro ao obter turma:", err)
    if (err.message === "Turma não encontrada") {
      res.status(404).json({ error: err.message })
    } else {
      res.status(500).json({ error: "Erro interno do servidor" })
    }
  }
}

export async function listarTurmasProfessorController(req, res) {
  try {
    const professorId = req.user?.id
    if (!professorId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const turmas = await listarTurmasPorProfessor(professorId)
    res.json(turmas)
  } catch (err) {
    console.error("Erro ao listar turmas do professor:", err)
    res.status(500).json({ error: "Erro interno do servidor" })
  }
}

export async function atualizarTurmaController(req, res) {
  try {
    const { id } = req.params
    const turma = await atualizarTurma(id, req.body)
    res.json(turma)
  } catch (err) {
    console.error("Erro ao atualizar turma:", err)
    if (err.message === "Turma não encontrada") {
      res.status(404).json({ error: err.message })
    } else {
      res.status(400).json({ error: err.message })
    }
  }
}

export async function excluirTurmaController(req, res) {
  try {
    const { id } = req.params
    await excluirTurma(id)
    res.status(204).send()
  } catch (err) {
    console.error("Erro ao excluir turma:", err)
    if (err.message === "Turma não encontrada") {
      res.status(404).json({ error: err.message })
    } else {
      res.status(500).json({ error: "Erro interno do servidor" })
    }
  }
}

export async function adicionarAlunoController(req, res) {
  try {
    const { turmaId } = req.params
    const { alunoId } = req.body
    console.log("🔄 [BACKEND] Adicionando aluno à turma:", { turmaId, alunoId })

    const resultado = await adicionarAlunoATurma(turmaId, alunoId)
    console.log("✅ [BACKEND] Aluno adicionado com sucesso:", resultado)

    res.status(201).json(resultado)
  } catch (err) {
    console.error("❌ [BACKEND] Erro ao adicionar aluno à turma:", err)
    res.status(400).json({ error: err.message })
  }
}

export async function removerAlunoController(req, res) {
  try {
    const { turmaId, alunoId } = req.params
    await removerAlunoDaTurma(turmaId, alunoId)
    res.status(204).send()
  } catch (err) {
    console.error("Erro ao remover aluno da turma:", err)
    res.status(500).json({ error: "Erro interno do servidor" })
  }
}

export async function listarAlunosController(req, res) {
  try {
    const { turmaId } = req.params
    const alunos = await listarAlunosDaTurma(turmaId)
    res.json(alunos)
  } catch (err) {
    console.error("Erro ao listar alunos da turma:", err)
    res.status(500).json({ error: "Erro interno do servidor" })
  }
}

export async function obterEstatisticasController(req, res) {
  try {
    const { id } = req.params
    const turma = await obterTurmaPorId(id)

    // Get alunos from turma
    const alunos = await listarAlunosDaTurma(id)

    // Calculate statistics
    const totalAlunos = alunos.length
    const mediaTurma = alunos.length > 0
      ? alunos.reduce((acc, aluno) => acc + (aluno.desempenho || 0), 0) / alunos.length
      : 0

    const stats = {
      totalAlunos,
      mediaTurma,
      alunos: alunos.map(aluno => ({
        id: aluno.id,
        nome: aluno.nome_completo || aluno.nome,
        email: aluno.email,
        desempenho: aluno.desempenho || 0,
        questoesRespondidas: aluno.questoesRespondidas || 0
      }))
    }

    res.json(stats)
  } catch (err) {
    console.error("Erro ao obter estatísticas da turma:", err)
    if (err.message === "Turma não encontrada") {
      res.status(404).json({ error: err.message })
    } else {
      res.status(500).json({ error: "Erro interno do servidor" })
    }
  }
}