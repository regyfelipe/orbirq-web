import * as respostasService from "../services/respostasService.js"

export async function responder(req, res) {
  try {
    const { alunoId, questaoId, opcaoEscolhida, correta, tempoRespostaSegundos } = req.body

    // Validação básica
    if (!alunoId || alunoId === "") {
      return res.status(400).json({ error: "ID do aluno é obrigatório" })
    }
    if (!questaoId || questaoId === "") {
      return res.status(400).json({ error: "ID da questão é obrigatório" })
    }
    if (!opcaoEscolhida || opcaoEscolhida === "") {
      return res.status(400).json({ error: "Opção escolhida é obrigatória" })
    }

    const resposta = await respostasService.responderQuestao(req.body)
    res.status(201).json(resposta)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Erro ao salvar resposta" })
  }
}

export async function listarRespostasAluno(req, res) {
  try {
    const respostas = await respostasService.listarRespostasAluno(req.params.alunoId)
    res.json(respostas)
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar respostas" })
  }
}

export async function verificarResposta(req, res) {
  try {
    const { alunoId, questaoId } = req.params
    const resposta = await respostasService.verificarRespostaAnterior(alunoId, questaoId)
    if (resposta) {
      res.json(resposta)
    } else {
      res.status(404).json({ message: "Resposta não encontrada" })
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao verificar resposta" })
  }
}

export async function resetarConquistas(req, res) {
  try {
    const { alunoId } = req.params

    // Validação básica
    if (!alunoId || alunoId === "") {
      return res.status(400).json({ error: "ID do aluno é obrigatório" })
    }

    const resultado = await respostasService.resetarConquistas(alunoId)
    res.json(resultado)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Erro ao resetar conquistas" })
  }
}

export async function resetarRespostasQuestoes(req, res) {
  try {
    const { alunoId, questoesIds } = req.body

    // Validação básica
    if (!alunoId || alunoId === "") {
      return res.status(400).json({ error: "ID do aluno é obrigatório" })
    }
    if (!questoesIds || !Array.isArray(questoesIds) || questoesIds.length === 0) {
      return res.status(400).json({ error: "IDs das questões são obrigatórios" })
    }

    const resultado = await respostasService.resetarRespostasQuestoes(alunoId, questoesIds)
    res.json(resultado)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Erro ao resetar respostas das questões" })
  }
}
