import * as respostasRepo from "../repositories/respostasRepository.js"
import * as questoesStatsRepo from "../../questions/repositories/questoesStatsRepository.js"
import * as dashboardRepo from "../../analytics/repositories/dashboardRepository.js"
import sql from "../../../shared/database/connection.js"

export async function responderQuestao({ alunoId, questaoId, opcaoEscolhida, correta, tempoRespostaSegundos }) {
  console.log(`📝 [RESPOSTA] Aluno ${alunoId} respondendo questão ${questaoId}: ${correta ? 'CORRETA' : 'ERRADA'} (${tempoRespostaSegundos}s)`)

  // Descobre qual tentativa é essa
  const respostasAluno = await respostasRepo.listarRespostasAlunoQuestao(alunoId, questaoId)
  const tentativa = respostasAluno.length + 1

  // Salva resposta
  const resposta = await respostasRepo.salvarResposta({
    alunoId,
    questaoId,
    opcaoEscolhida,
    correta,
    tempoRespostaSegundos,
    tentativa,
  })

  // Atualiza estatísticas agregadas da questão
  await questoesStatsRepo.atualizarStatsResposta(questaoId, correta, tempoRespostaSegundos)

  // Verifica e registra conquistas
  try {
    console.log(`🏆 [VERIFICANDO] Verificando conquistas para aluno ${alunoId}...`)
    await verificarELogarConquistas(alunoId, correta)
    console.log(`✅ [CONQUISTAS] Verificação concluída para aluno ${alunoId}`)
  } catch (error) {
    console.error('❌ [ERRO] Erro ao verificar conquistas:', error)
    // Não falha a resposta por causa de erro nas conquistas
  }

  return resposta
}

export async function listarRespostasAluno(alunoId) {
  return respostasRepo.listarRespostasAluno(alunoId)
}

export async function verificarRespostaAnterior(alunoId, questaoId) {
  const respostas = await respostasRepo.listarRespostasAlunoQuestao(alunoId, questaoId)
  if (respostas.length === 0) return null

  // Retorna a última resposta (mais recente)
  const ultimaResposta = respostas[respostas.length - 1]
  return {
    id: ultimaResposta.id,
    questaoId: ultimaResposta.questao_id,
    opcaoEscolhida: ultimaResposta.opcao_escolhida,
    correta: ultimaResposta.correta,
    tentativa: ultimaResposta.tentativa,
    dataResposta: ultimaResposta.data_resposta
  }
}

// Função para resetar conquistas de um aluno
export async function resetarConquistas(alunoId) {
  try {
    const result = await sql`
      DELETE FROM achievements
      WHERE aluno_id = ${alunoId}
    `
    console.log(`🔄 [RESET] Conquistas resetadas para aluno ${alunoId} (${result.count || 0} conquistas removidas)`)
    return { success: true, message: 'Conquistas resetadas com sucesso' }
  } catch (error) {
    console.error('❌ [ERRO] Erro ao resetar conquistas:', error)
    throw new Error('Erro ao resetar conquistas')
  }
}

// Função para resetar respostas de questões específicas
export async function resetarRespostasQuestoes(alunoId, questoesIds) {
  try {
    const result = await sql`
      DELETE FROM respostas
      WHERE aluno_id = ${alunoId}
      AND questao_id = ANY(${questoesIds})
    `
    console.log(`🔄 [RESET] Respostas resetadas para aluno ${alunoId} nas questões: ${questoesIds.join(', ')} (${result.count || 0} respostas removidas)`)
    return { success: true, message: 'Respostas das questões resetadas com sucesso' }
  } catch (error) {
    console.error('❌ [ERRO] Erro ao resetar respostas das questões:', error)
    throw new Error('Erro ao resetar respostas das questões')
  }
}

// Função para verificar e logar conquistas
async function verificarELogarConquistas(alunoId, respostaCorreta) {
  try {
    // Busca estatísticas atuais do aluno
    const stats = await dashboardRepo.calcularConquistasReais(alunoId)

    // Verifica conquistas baseadas em estatísticas
    const conquistasParaLogar = []

    // Conquista: Primeira resposta correta
    if (respostaCorreta && stats.questoesRespondidas === 1) {
      conquistasParaLogar.push({
        tipo: 'primeira_questao',
        titulo: '🎯 Primeira Acerto!',
        descricao: 'Parabéns pela sua primeira resposta correta!',
        xp_ganho: 10
      })
    }

    // Conquista: 10 questões respondidas
    if (stats.questoesRespondidas >= 10 && stats.questoesRespondidas < 25) {
      const jaTem = await verificarConquistaExistente(alunoId, 'dez_questoes')
      if (!jaTem) {
        conquistasParaLogar.push({
          tipo: 'volume',
          titulo: '📚 Explorador',
          descricao: 'Você respondeu 10 questões!',
          xp_ganho: 25
        })
      }
    }

    // Conquista: 50 questões respondidas
    if (stats.questoesRespondidas >= 50 && stats.questoesRespondidas < 100) {
      const jaTem = await verificarConquistaExistente(alunoId, 'cinquenta_questoes')
      if (!jaTem) {
        conquistasParaLogar.push({
          tipo: 'volume',
          titulo: '🎓 Estudioso',
          descricao: 'Você respondeu 50 questões!',
          xp_ganho: 50
        })
      }
    }

    // Conquista: Taxa de acerto alta
    if (stats.taxaAcertoGeral >= 0.8 && stats.questoesRespondidas >= 10) {
      const jaTem = await verificarConquistaExistente(alunoId, 'acerto_alto')
      if (!jaTem) {
        conquistasParaLogar.push({
          tipo: 'acerto',
          titulo: '🎯 Mestre',
          descricao: 'Taxa de acerto superior a 80%!',
          xp_ganho: 30
        })
      }
    }

    // Conquista: Sequência de 7 dias
    if (stats.sequenciaAtual >= 7) {
      const jaTem = await verificarConquistaExistente(alunoId, 'sequencia_7_dias')
      if (!jaTem) {
        conquistasParaLogar.push({
          tipo: 'streak',
          titulo: '🔥 Sequência Incrível!',
          descricao: '7 dias consecutivos de estudo!',
          xp_ganho: 40
        })
      }
    }

    // Conquista: Novo nível
    if (stats.nivel > 1) {
      const ultimoNivelConquistado = await verificarUltimoNivelConquistado(alunoId)
      if (stats.nivel > ultimoNivelConquistado) {
        conquistasParaLogar.push({
          tipo: 'nivel',
          titulo: `🏆 Nível ${stats.nivel}!`,
          descricao: `Você alcançou o nível ${stats.nivel}!`,
          xp_ganho: stats.nivel * 10
        })
      }
    }

    // Loga as conquistas encontradas
    for (const conquista of conquistasParaLogar) {
      await logarConquista(alunoId, conquista)
    }

  } catch (error) {
    console.error('Erro ao verificar conquistas:', error)
  }
}

// Função auxiliar para verificar se conquista já existe
async function verificarConquistaExistente(alunoId, tipo) {
  try {
    const [result] = await sql`
      SELECT COUNT(*) as count
      FROM achievements
      WHERE aluno_id = ${alunoId} AND tipo = ${tipo}
    `
    return result.count > 0
  } catch (error) {
    console.error('Erro ao verificar conquista existente:', error)
    return false
  }
}

// Função auxiliar para verificar último nível conquistado
async function verificarUltimoNivelConquistado(alunoId) {
  try {
    const [result] = await sql`
      SELECT COALESCE(MAX(
        CASE
          WHEN tipo = 'nivel' THEN CAST(SUBSTRING(titulo FROM '\\d+') AS INTEGER)
          ELSE 0
        END
      ), 0) as ultimo_nivel
      FROM achievements
      WHERE aluno_id = ${alunoId}
    `
    return result.ultimo_nivel || 0
  } catch (error) {
    console.error('Erro ao verificar último nível:', error)
    return 0
  }
}

// Função para logar conquista
async function logarConquista(alunoId, conquista) {
  try {
    await sql`
      INSERT INTO achievements (aluno_id, tipo, titulo, descricao, xp_ganho)
      VALUES (${alunoId}, ${conquista.tipo}, ${conquista.titulo}, ${conquista.descricao}, ${conquista.xp_ganho})
    `
    console.log(`🏆 [CONQUISTA SALVA] ${conquista.titulo} (+${conquista.xp_ganho} XP) para aluno ${alunoId}`)
  } catch (error) {
    console.error('❌ [ERRO] Erro ao logar conquista:', error)
  }
}
