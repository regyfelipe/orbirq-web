import db from "../../../shared/database/connection.js"

export async function atualizarStatsResposta(questaoId, correta, tempoRespostaSegundos) {
  return db`
    INSERT INTO questoes_stats (questao_id, vezes_respondida, taxa_acerto, tempo_medio_resposta_segundos)
    VALUES (${questaoId}, 1, CASE WHEN ${correta} THEN 1 ELSE 0 END, ${tempoRespostaSegundos})
    ON CONFLICT (questao_id) DO UPDATE
    SET vezes_respondida = questoes_stats.vezes_respondida + 1,
        taxa_acerto = ((questoes_stats.taxa_acerto * questoes_stats.vezes_respondida) + CASE WHEN ${correta} THEN 1 ELSE 0 END) / (questoes_stats.vezes_respondida + 1),
        tempo_medio_resposta_segundos = ((questoes_stats.tempo_medio_resposta_segundos * questoes_stats.vezes_respondida) + ${tempoRespostaSegundos}) / (questoes_stats.vezes_respondida + 1),
        atualizado_em = now();
  `
}

export async function atualizarStatsFeedback(questaoId) {
  return db`
    UPDATE questoes_stats
    SET rating_medio = (
      SELECT AVG(rating)::NUMERIC(3,2) FROM feedbacks WHERE questao_id = ${questaoId}
    ),
    atualizado_em = now()
    WHERE questao_id = ${questaoId}
  `
}
