import db from "../../../shared/database/connection.js"

export async function salvarResposta({ alunoId, questaoId, opcaoEscolhida, correta, tempoRespostaSegundos, tentativa }) {
  const result = await db`
    INSERT INTO respostas (aluno_id, questao_id, opcao_escolhida, correta, tempo_resposta_segundos, tentativa)
    VALUES (${alunoId}, ${questaoId}, ${opcaoEscolhida}, ${correta}, ${tempoRespostaSegundos}, ${tentativa})
    RETURNING *
  `
  return result[0]  // sempre retorna array
}

export async function listarRespostasAlunoQuestao(alunoId, questaoId) {
  const result = await db`
    SELECT * FROM respostas 
    WHERE aluno_id = ${alunoId} AND questao_id = ${questaoId}
    ORDER BY tentativa ASC
  `
  return result  // já é array de rows
}
