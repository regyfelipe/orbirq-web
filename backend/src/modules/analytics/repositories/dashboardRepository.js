import sql from "../../../shared/database/connection.js"

// --- USERS ---
export async function getUsersCounts() {
  const [row] = await sql/*sql*/`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE role = 'aluno')::int AS alunos,
      COUNT(*) FILTER (WHERE role = 'professor')::int AS professores,
      COUNT(*) FILTER (WHERE role = 'administrador')::int AS administradores
    FROM usuarios
  `
  return row
}

// --- QUESTÕES (totais / ineditas / banco) ---
export async function getQuestoesCounts() {
  const [row] = await sql/*sql*/`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE inedita = true)::int AS ineditas
    FROM questoes
  `
  const bancoProvas = (row.total ?? 0) - (row.ineditas ?? 0)
  return { total: row.total ?? 0, ineditas: row.ineditas ?? 0, bancoProvas }
}

// --- ENGAJAMENTO ---
export async function getEngajamento() {
  const [row] = await sql/*sql*/`
    SELECT
      COALESCE(SUM( COALESCE( (estatisticas->>'vezesRespondida')::int, 0) ), 0)::int AS total_respostas,
      COALESCE(AVG( COALESCE( (estatisticas->>'taxaAcerto')::numeric, 0) ), 0) AS taxa_acerto_media,
      COUNT(*) FILTER (WHERE COALESCE( (estatisticas->>'vezesRespondida')::int, 0) > 0 )::int AS questoes_respondidas,
      COUNT(*)::int AS total_questoes
    FROM questoes
  `
  const totalQuestoes = row.total_questoes || 0
  const taxaEngajamento = totalQuestoes
    ? Math.round((row.questoes_respondidas / totalQuestoes) * 100)
    : 0
  const mediaRespostasPorQuestao = totalQuestoes
    ? Number(row.total_respostas) / totalQuestoes
    : 0

  return {
    taxaEngajamento,
    mediaRespostasPorQuestao,
    taxaAcertoMedia: Number(row.taxa_acerto_media) || 0,
  }
}

// --- RANKING PROFESSORES (por autoria.principal) ---
export async function getRankingProfessores(limit = 5) {
  const rows = await sql/*sql*/`
    SELECT
      COALESCE(autoria->>'principal', 'Desconhecido') AS autor,
      COUNT(*)::int AS total
    FROM questoes
    GROUP BY autor
    ORDER BY total DESC
    LIMIT ${limit}
  `
  return rows
}

// --- TOP QUESTÕES POR RATING ---
export async function getTopQuestoes(limit = 5) {
  const rows = await sql/*sql*/`
    SELECT
      id,
      pergunta,
      COALESCE((estatisticas->>'rating')::numeric, 0) AS rating
    FROM questoes
    ORDER BY rating DESC NULLS LAST
    LIMIT ${limit}
  `
  return rows
}

// --- CRESCIMENTO DE ALUNOS (últimos N meses) ---
export async function getCrescimentoAlunosUltimosMeses(meses = 6) {
  const rows = await sql/*sql*/`
    SELECT
      to_char(date_trunc('month', data_criacao), 'YYYY-MM') AS mes,
      COUNT(*)::int AS total
    FROM usuarios
    WHERE role = 'aluno'
      AND data_criacao >= date_trunc('month', now()) - interval '${meses - 1} months'
    GROUP BY mes
    ORDER BY mes ASC
  `
  return rows
}


// --- ESTATÍSTICAS DE PROFESSOR ---
export async function getProfessorStats(professorId) {
  // Total de questões do professor (usando autoria JSON)
  const [qtdQuestoes] = await sql`
    SELECT COUNT(*)::int AS total
    FROM questoes
    WHERE autoria->>'principal' = (SELECT nome_completo FROM usuarios WHERE id = ${professorId})
  `

  // Média de acerto das respostas em questões desse professor
  const [acerto] = await sql`
    SELECT COALESCE(AVG(r.correta::int), 0) AS media_acerto
    FROM respostas r
    JOIN questoes q ON q.id = r.questao_id
    WHERE q.autoria->>'principal' = (SELECT nome_completo FROM usuarios WHERE id = ${professorId})
  `

  // Média de rating das questões
  const [rating] = await sql`
    SELECT COALESCE(AVG(f.rating), 0) AS media_rating
    FROM feedbacks f
    JOIN questoes q ON q.id = f.questao_id
    WHERE q.autoria->>'principal' = (SELECT nome_completo FROM usuarios WHERE id = ${professorId})
  `

  // Questões por disciplina (com taxa de acerto e rating)
  const questoesPorDisciplina = await sql`
    SELECT q.disciplina,
           COUNT(DISTINCT q.id)::int AS totalQuestoes,
           COALESCE(AVG(f.rating), 0) AS mediaRating,
           COALESCE(AVG(r.correta::int), 0) AS taxaAcerto
    FROM questoes q
    LEFT JOIN feedbacks f ON q.id = f.questao_id
    LEFT JOIN respostas r ON q.id = r.questao_id
    WHERE q.autoria->>'principal' = (SELECT nome_completo FROM usuarios WHERE id = ${professorId})
    GROUP BY q.disciplina
  `

  return {
  totalQuestoes: qtdQuestoes.total || 0,
  mediaAcerto: Number(acerto.media_acerto) || 0,
  mediaRatingQuestoes: Number(rating.media_rating) || 0,
  questoesPorDisciplina: questoesPorDisciplina.map(d => ({
    disciplina: d.disciplina,
    totalQuestoes: d.totalquestoes || 0,
    mediaRating: Number(d.mediarating) || 0,
    taxaAcerto: Number(d.taxaacerto) || 0,
  })),
}}



// --- ESTATÍSTICAS DE ALUNO ---
export async function getAlunoStats(alunoId) {
  console.log(`📊 [DASHBOARD] Calculando estatísticas para aluno: ${alunoId}`)

  // Por enquanto, definir turma como 'Sem Turma' até implementar turmas
  const turma = 'Sem Turma'

  // --- Taxa de acerto geral ---
  const [acerto] = await sql`
    SELECT COALESCE(AVG(correta::int), 0) AS taxa_acerto_geral
    FROM respostas
    WHERE aluno_id = ${alunoId}
  `

  // --- Taxa de acerto da turma (se tiver turma) ---
  let taxaAcertoTurma = 0
  if (turma !== 'Sem Turma') {
    // Por enquanto, não calcular taxa da turma até implementar turmas
    taxaAcertoTurma = 0
  }

  // --- Respostas corretas e erradas ---
  const [respostas] = await sql`
    SELECT
      COUNT(*) FILTER (WHERE correta = true) AS respostas_corretas,
      COUNT(*) FILTER (WHERE correta = false) AS respostas_erradas
    FROM respostas
    WHERE aluno_id = ${alunoId}
  `

  console.log(`📊 [RESPOSTAS] Aluno ${alunoId}: ${respostas.respostas_corretas} corretas, ${respostas.respostas_erradas} erradas`)

  // --- Tempo médio de resposta ---
  const [tempo] = await sql`
    SELECT COALESCE(AVG(tempo_resposta_segundos), 0) AS tempo_medio
    FROM respostas
    WHERE aluno_id = ${alunoId}
  `

  // --- Desempenho por disciplina ---
  const acertoPorDisciplina = await sql`
    SELECT q.disciplina,
           COUNT(*)::int AS totalRespostas,
           COALESCE(AVG(r.correta::int), 0) AS taxaAcerto
    FROM respostas r
    JOIN questoes q ON q.id = r.questao_id
    WHERE r.aluno_id = ${alunoId}
    GROUP BY q.disciplina
  `

  // --- Desempenho ao longo do tempo (últimos 6 meses) ---
  const desempenhoTempo = await sql`
    SELECT
      to_char(date_trunc('month', r.respondida_em), 'YYYY-MM') AS mes,
      COUNT(*) FILTER (WHERE r.correta = true) AS respostas_corretas,
      COUNT(*) FILTER (WHERE r.correta = false) AS respostas_erradas
    FROM respostas r
    WHERE r.aluno_id = ${alunoId}
    GROUP BY to_char(date_trunc('month', r.respondida_em), 'YYYY-MM')
    ORDER BY mes DESC
    LIMIT 6
  `

  // --- Recomendações de questões não respondidas ---
  const recomendadas = await sql`
    SELECT q.id, q.pergunta AS titulo, q.disciplina
    FROM questoes q
    WHERE q.id NOT IN (
      SELECT questao_id FROM respostas WHERE aluno_id = ${alunoId}
    )
    LIMIT 5
  `

  // --- NOVO: Análise por dificuldade percebida ---
  const dificuldade = await sql`
    SELECT difficulty_perceived,
           COUNT(*)::int AS total,
           COALESCE(AVG(correta::int), 0) AS taxa_acerto
    FROM respostas
    WHERE aluno_id = ${alunoId}
    GROUP BY difficulty_perceived
    ORDER BY difficulty_perceived
  `

  // --- NOVO: Impacto da pressão de tempo ---
  const pressaoTempo = await sql`
    SELECT time_pressure,
           COUNT(*)::int AS total,
           COALESCE(AVG(correta::int), 0) AS taxa_acerto
    FROM respostas
    WHERE aluno_id = ${alunoId}
    GROUP BY time_pressure
  `

  // --- NOVO: Evolução por tentativa ---
  const tentativas = await sql`
    SELECT tentativa,
           COUNT(*)::int AS total,
           COALESCE(AVG(correta::int), 0) AS taxa_acerto,
           COALESCE(AVG(tempo_resposta_segundos), 0) AS tempo_medio
    FROM respostas
    WHERE aluno_id = ${alunoId}
    GROUP BY tentativa
    ORDER BY tentativa
  `

  // --- NOVO: Carga cognitiva ---
  const cargaCognitiva = await sql`
    SELECT ROUND(cognitive_load_score::numeric, 2) AS carga,
           COUNT(*)::int AS total,
           COALESCE(AVG(correta::int), 0) AS taxa_acerto
    FROM respostas
    WHERE aluno_id = ${alunoId}
    GROUP BY carga
    ORDER BY carga
  `

  // --- NOVO: Questões mais erradas ---
  const questoesErradas = await sql`
    SELECT q.id, q.pergunta, q.disciplina,
           COUNT(*) FILTER (WHERE r.correta = false) AS erros
    FROM respostas r
    JOIN questoes q ON q.id = r.questao_id
    WHERE r.aluno_id = ${alunoId}
    GROUP BY q.id, q.pergunta, q.disciplina
    HAVING COUNT(*) FILTER (WHERE r.correta = false) > 0
    ORDER BY erros DESC
    LIMIT 5
  `

  const resultado = {
    taxaAcertoGeral: Number(acerto.taxa_acerto_geral),
    taxaAcertoTurma,
    tempoMedioRespostaSegundos: Math.round(Number(tempo.tempo_medio)),
    respostasCorretas: respostas.respostas_corretas,
    respostasErradas: respostas.respostas_erradas,
    acertoPorDisciplina: acertoPorDisciplina.map(d => ({
      disciplina: d.disciplina,
      taxaAcerto: Number(d.taxaacerto),
      totalRespostas: d.totalrespostas
    })),
    desempenhoTempo: desempenhoTempo.map(d => ({
      mes: d.mes,
      respostasCorretas: d.respostas_corretas,
      respostasErradas: d.respostas_erradas,
    })),
    recomendadas,
    dificuldadePercebida: dificuldade,
    impactoPressaoTempo: pressaoTempo,
    desempenhoPorTentativa: tentativas,
    cargaCognitiva: cargaCognitiva,
    questoesMaisErradas: questoesErradas,
  }

  console.log(`📊 [ESTATÍSTICAS] Resultado final para aluno ${alunoId}:`, {
    taxaAcerto: `${(resultado.taxaAcertoGeral * 100).toFixed(1)}%`,
    totalQuestoes: Number(resultado.respostasCorretas) + Number(resultado.respostasErradas),
    tempoMedio: `${resultado.tempoMedioRespostaSegundos}s`,
    corretas: resultado.respostasCorretas,
    erradas: resultado.respostasErradas
  })

  return resultado
}

// --- SISTEMA DE CONQUISTAS REAL ---
export async function calcularConquistasReais(alunoId) {
  console.log(`🏆 [CONQUISTAS] Calculando conquistas para aluno: ${alunoId}`)

  // Total de questões respondidas
  const [totalQuestoes] = await sql`
    SELECT COUNT(*)::int AS total
    FROM respostas
    WHERE aluno_id = ${alunoId}
  `;

  // Taxa de acerto geral
  const [taxaAcerto] = await sql`
    SELECT COALESCE(AVG(correta::int), 0) AS taxa
    FROM respostas
    WHERE aluno_id = ${alunoId}
  `;

  // Sequência atual (dias consecutivos) via SQL otimizado
  const [sequenciaRow] = await sql/*sql*/`
    WITH dias AS (
      SELECT DATE(respondida_em) AS dia
      FROM respostas
      WHERE aluno_id = ${alunoId}
        AND respondida_em >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(respondida_em)
    )
    SELECT COUNT(*) AS sequencia
    FROM (
      SELECT dia,
             ROW_NUMBER() OVER (ORDER BY dia DESC)
             - (CURRENT_DATE - dia) AS grupo
      FROM dias
    ) g
    GROUP BY grupo
    ORDER BY COUNT(*) DESC
    LIMIT 1
  `;
  const sequencia = Number(sequenciaRow?.sequencia || 0);

  // Calcular nível baseado em desempenho
  const { nivel, xpAtual, xpProximo } = calcularNivel(
    totalQuestoes.total,
    Number(taxaAcerto.taxa)
  );

  // Conquistas recentes (exemplo simples, pode expandir)
  const conquistasRecentes = await sql/*sql*/`
    SELECT titulo as conquista, desbloqueado_em as conquistada_em
    FROM achievements
    WHERE aluno_id = ${alunoId}
    ORDER BY desbloqueado_em DESC
    LIMIT 5
  `;

  // Ranking (global e por turma) - placeholders
  // Dependendo do seu modelo de dados, você pode calcular com window functions
  const posicaoNaTurma = null; // implementar quando tiver as turmas definidas
  const posicaoNoGlobal = null;

  const resultado = {
    questoesRespondidas: totalQuestoes.total,
    taxaAcertoGeral: Number(taxaAcerto.taxa),
    sequenciaAtual: sequencia,
    nivel,
    progressoNivel: {
      xpAtual,
      xpProximo,
      faltam: xpProximo - xpAtual
    },
    conquistas: conquistasRecentes,
    rankingTurma: posicaoNaTurma,
    rankingGlobal: posicaoNoGlobal
  };

  console.log(`🏆 [CONQUISTAS] Resultado para aluno ${alunoId}:`, {
    questoesRespondidas: resultado.questoesRespondidas,
    taxaAcerto: `${(resultado.taxaAcertoGeral * 100).toFixed(1)}%`,
    sequenciaAtual: resultado.sequenciaAtual,
    nivel: resultado.nivel,
    conquistasRecentes: resultado.conquistas.length
  });

  return resultado;
}

function calcularNivel(totalQuestoes, taxaAcerto) {
  // Sistema de pontos ajustado
  const pontos = (totalQuestoes * taxaAcerto * 100) + (totalQuestoes * 0.1);

  const niveis = [
    { nivel: 0, xp: 0 },
    { nivel: 1, xp: 10 },
    { nivel: 2, xp: 50 },
    { nivel: 3, xp: 100 },
    { nivel: 4, xp: 200 },
    { nivel: 5, xp: 500 },
    { nivel: 6, xp: 1000 },
    { nivel: 7, xp: 2000 },
    { nivel: 8, xp: 3000 },
    { nivel: 10, xp: 5000 },
  ];

  let nivelAtual = 0;
  let xpProximo = niveis[niveis.length - 1].xp;

  for (let i = 0; i < niveis.length; i++) {
    if (pontos >= niveis[i].xp) {
      nivelAtual = niveis[i].nivel;
      xpProximo = niveis[i + 1]?.xp ?? niveis[i].xp;
    }
  }

  return {
    nivel: nivelAtual,
    xpAtual: pontos,
    xpProximo
  };
}
// --- SISTEMA DE METAS REAL ---
export async function calcularMetasReais(alunoId) {
  const hoje = new Date();
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay()); // Domingo da semana atual
  inicioSemana.setHours(0, 0, 0, 0);

  // Questões respondidas esta semana
  const [questoesSemana] = await sql/*sql*/`
    SELECT COUNT(*)::int AS total
    FROM respostas
    WHERE aluno_id = ${alunoId}
      AND respondida_em >= ${inicioSemana}
  `;

  // Taxa de acerto atual
  const [taxaAcerto] = await sql/*sql*/`
    SELECT COALESCE(AVG(correta::int), 0) AS taxa
    FROM respostas
    WHERE aluno_id = ${alunoId}
  `;

  // Tempo médio atual
  const [tempoMedio] = await sql/*sql*/`
    SELECT COALESCE(AVG(tempo_resposta_segundos), 0) AS tempo
    FROM respostas
    WHERE aluno_id = ${alunoId}
  `;

  // 🔹 Histórico de metas atingidas (para mostrar evolução e engajamento)
  // Note: metas_alunos table doesn't exist, returning empty array for now
  const metasHistorico = [];

  // 🔹 Ajuste dinâmico da meta semanal (se o aluno já passou muito da meta, aumenta)
  const metaSemanalBase = 50;
  const metaSemanal = questoesSemana.total > metaSemanalBase * 1.2
    ? Math.round(questoesSemana.total * 1.1)
    : metaSemanalBase;

  // 🔹 Ajuste dinâmico da meta de acerto (se o aluno já está acima de 85%, sobe)
  const metaAcertoBase = 0.85;
  const metaAcerto = Number(taxaAcerto.taxa) > metaAcertoBase
    ? Math.min(0.95, Number(taxaAcerto.taxa) + 0.05)
    : metaAcertoBase;

  return {
    semanal: {
      current: questoesSemana.total,
      target: metaSemanal
    },
    acerto: {
      current: Number(taxaAcerto.taxa),
      target: metaAcerto
    },
    tempo: {
      current: Math.round(Number(tempoMedio.tempo)),
      target: 45 // Meta padrão: 45s
    },
    historico: metasHistorico.map(m => ({
      semana: m.semana,
      meta: m.meta,
      atingida: m.atingida
    }))
  };
}

// --- SISTEMA DE INSIGHTS IA REAL ---
export async function gerarInsightsReais(alunoId) {
  // 1. Desempenho por disciplina
  const desempenhoPorDisciplina = await sql/*sql*/`
    SELECT
      q.disciplina,
      COUNT(r.*)::int AS total_respostas,
      COALESCE(AVG(r.correta::int), 0) AS taxa_acerto,
      COALESCE(AVG(r.tempo_resposta_segundos), 0) AS tempo_medio
    FROM respostas r
    JOIN questoes q ON q.id = r.questao_id
    WHERE r.aluno_id = ${alunoId}
    GROUP BY q.disciplina
    ORDER BY taxa_acerto ASC
  `;

  // 2. Desempenho recente (últimos 30 dias)
  const [desempenhoRecente] = await sql/*sql*/`
    SELECT
      COALESCE(AVG(r.correta::int), 0) AS taxa_acerto_30d
    FROM respostas r
    WHERE r.aluno_id = ${alunoId}
      AND r.respondida_em >= CURRENT_DATE - INTERVAL '30 days'
  `;

  // 3. Médias da turma (desabilitado por enquanto - sem tabela alunos)
  let taxaTurma = null;

  // 4. Pontos fortes e fracos
  const pontosFracos = desempenhoPorDisciplina
    .filter(d => Number(d.taxa_acerto) < 0.6)
    .map(d => d.disciplina);

  const pontosFortes = desempenhoPorDisciplina
    .filter(d => Number(d.taxa_acerto) >= 0.8)
    .map(d => d.disciplina);

  // 5. Insight principal (personalizado)
  let mainInsight = "";
  if (pontosFracos.length > 0) {
    mainInsight = `Você tem dificuldade em ${pontosFracos.join(', ')}. Focar nessas disciplinas pode aumentar rapidamente sua média.`;
  } else if (pontosFortes.length > 0) {
    mainInsight = `Excelente desempenho em ${pontosFortes.join(', ')}! Continue praticando para manter esse nível.`;
  } else {
    mainInsight = "Seu desempenho está equilibrado. Continue praticando regularmente para evoluir.";
  }

  // Ajuste se houver comparação com a turma
  if (taxaTurma !== null) {
    if (Number(desempenhoRecente.taxa_acerto_30d) < taxaTurma) {
      mainInsight += ` Atualmente você está abaixo da média da sua turma (${(taxaTurma * 100).toFixed(1)}%).`;
    } else {
      mainInsight += ` Você está acima da média da sua turma (${(taxaTurma * 100).toFixed(1)}%).`;
    }
  }

  // 6. Recomendações práticas
  const recomendacoes = [];
  if (pontosFracos.length > 0) {
    recomendacoes.push(`Resolva pelo menos 10 questões de ${pontosFracos[0]} por dia`);
    recomendacoes.push("Revise os conceitos fundamentais onde teve mais erros");
    recomendacoes.push("Assista aos vídeos explicativos das questões incorretas");
  } else {
    recomendacoes.push("Continue praticando regularmente para manter o desempenho");
    recomendacoes.push("Explore questões de níveis mais avançados");
    recomendacoes.push("Ajude colegas de turma explicando suas estratégias");
  }

  // 7. Próximos passos (metas de curto prazo)
  const proximosPassos = [
    `Complete 30 questões de ${pontosFracos[0] || 'disciplinas desafiadoras'} esta semana`,
    "Participe do grupo de estudos ou fórum da turma",
    "Agende uma revisão semanal com o professor"
  ];

  return {
    mainInsight,
    weakAreas: pontosFracos.map(area => `${area} - Desempenho abaixo do esperado`),
    strengths: pontosFortes.map(area => `${area} - Excelente desempenho`),
    recommendations: recomendacoes,
    nextSteps: proximosPassos,
    comparativoTurma: taxaTurma,
    desempenhoRecente: Number(desempenhoRecente.taxa_acerto_30d)
  };
}

// --- SISTEMA DE NOTIFICAÇÕES REAL ---
export async function gerarNotificacoesReais(alunoId) {
  const notificacoes = [];

  // Verificar conquistas recentes
  const conquistas = await verificarConquistasRecentes(alunoId);
  notificacoes.push(...conquistas);

  // Verificar metas atingidas
  const metas = await verificarMetasAtingidas(alunoId);
  notificacoes.push(...metas);

  // Verificar melhorias de desempenho
  const melhorias = await verificarMelhorias(alunoId);
  notificacoes.push(...melhorias);

  // Ordenar por prioridade (conquistas > metas > melhorias)
  const prioridade = { achievement: 1, streak: 1, goal: 2, milestone: 3 };
  const ordenadas = notificacoes.sort((a, b) => (prioridade[a.type] || 99) - (prioridade[b.type] || 99));

  // Retornar apenas as 5 mais relevantes
  return ordenadas.slice(0, 5);
}

async function verificarConquistasRecentes(alunoId) {
  const conquistas = [];

  // Nova sequência de estudos
  const streaks = await getStreaks(alunoId);
  const sequencia = streaks.dias;
  if (sequencia >= 7) {
    conquistas.push({
      id: `streak-${Date.now()}`,
      type: 'streak',
      title: '🔥 Sequência Incrível!',
      message: `Você completou ${sequencia} dias consecutivos de estudo. Consistência é a chave!`,
      time: new Date().toISOString()
    });
  }

  // Novo nível
  const stats = await calcularConquistasReais(alunoId);
  if (stats.nivel >= 5) {
    conquistas.push({
      id: `level-${Date.now()}`,
      type: 'achievement',
      title: '🏆 Subiu de Nível!',
      message: `Parabéns! Você alcançou o nível ${stats.nivel}.`,
      time: new Date().toISOString()
    });
  }

  return conquistas;
}

async function verificarMetasAtingidas(alunoId) {
  const metas = await calcularMetasReais(alunoId);
  const notificacoes = [];

  if (metas.semanal.current >= metas.semanal.target) {
    notificacoes.push({
      id: `goal-weekly-${Date.now()}`,
      type: 'goal',
      title: '🎯 Meta Semanal Batida!',
      message: `Você completou ${metas.semanal.current} questões nesta semana.`,
      time: new Date().toISOString()
    });
  }

  if (metas.acerto.current >= metas.acerto.target) {
    notificacoes.push({
      id: `goal-accuracy-${Date.now()}`,
      type: 'goal',
      title: '💡 Meta de Acerto!',
      message: `Taxa de acerto de ${(metas.acerto.current * 100).toFixed(0)}% atingida.`,
      time: new Date().toISOString()
    });
  }

  return notificacoes;
}

async function verificarMelhorias(alunoId) {
  const hoje = new Date();
  const umaSemanaAtras = new Date(hoje);
  umaSemanaAtras.setDate(hoje.getDate() - 7);

  const duasSemanasAtras = new Date(hoje);
  duasSemanasAtras.setDate(hoje.getDate() - 14);

  // Semana atual
  const [semanaAtual] = await sql`
    SELECT COALESCE(AVG(correta::int), 0) AS taxa_acerto
    FROM respostas
    WHERE aluno_id = ${alunoId}
      AND respondida_em >= ${umaSemanaAtras}
  `;

  // Semana anterior
  const [semanaAnterior] = await sql`
    SELECT COALESCE(AVG(correta::int), 0) AS taxa_acerto
    FROM respostas
    WHERE aluno_id = ${alunoId}
      AND respondida_em >= ${duasSemanasAtras}
      AND respondida_em < ${umaSemanaAtras}
  `;

  const notificacoes = [];

  // Detectar melhoria real
  const melhoria = Number(semanaAtual.taxa_acerto) - Number(semanaAnterior.taxa_acerto);
  if (melhoria >= 0.1) { // +10% de acerto
    notificacoes.push({
      id: `improvement-${Date.now()}`,
      type: 'milestone',
      title: '📈 Evolução Detectada!',
      message: `Sua taxa de acerto subiu ${(melhoria * 100).toFixed(1)}% em relação à semana passada.`,
      time: new Date().toISOString()
    });
  }

  return notificacoes;
}

// --- ESTATÍSTICAS DOS ALUNOS VINCULADOS ---
export async function getAlunosVinculadosStats(professorId) {
  const alunosStats = await sql/*sql*/`
    WITH stats AS (
      SELECT
        r.aluno_id,
        COUNT(*)::int AS total_questoes,
        COALESCE(AVG(r.correta::int), 0) AS taxa_acerto,
        MAX(r.respondida_em) AS ultima_atividade
      FROM respostas r
      GROUP BY r.aluno_id
    )
    SELECT
      u.id,
      u.nome_completo AS nome,
      u.email,
      COALESCE(s.total_questoes, 0) AS questoes_respondidas,
      COALESCE(s.taxa_acerto, 0) AS taxa_acerto,
      COALESCE(s.ultima_atividade, NULL) AS ultima_atividade,
      -- Nível dinâmico baseado em volume + acerto
      CASE
        WHEN COALESCE(s.total_questoes, 0) * COALESCE(s.taxa_acerto, 0) >= 500 THEN 10
        WHEN COALESCE(s.total_questoes, 0) * COALESCE(s.taxa_acerto, 0) >= 200 THEN 8
        WHEN COALESCE(s.total_questoes, 0) * COALESCE(s.taxa_acerto, 0) >= 100 THEN 6
        WHEN COALESCE(s.total_questoes, 0) >= 50 THEN 4
        WHEN COALESCE(s.total_questoes, 0) >= 20 THEN 3
        WHEN COALESCE(s.total_questoes, 0) >= 10 THEN 2
        WHEN COALESCE(s.total_questoes, 0) >= 5 THEN 1
        ELSE 1
      END AS nivel
    FROM convites c
    JOIN usuarios u ON c.aluno_id = u.id
    LEFT JOIN stats s ON u.id = s.aluno_id
    WHERE c.professor_id = ${professorId}
      AND c.status = 'accepted'
      AND c.aluno_id IS NOT NULL
    ORDER BY s.ultima_atividade DESC NULLS LAST, u.id DESC
  `;

  return alunosStats.map(aluno => ({
    id: aluno.id,
    nome: aluno.nome,
    email: aluno.email,
    questoesRespondidas: aluno.questoes_respondidas,
    taxaAcerto: Number(aluno.taxa_acerto),
    nivel: aluno.nivel,
    ultimaAtividade: aluno.ultima_atividade 
      ? new Date(aluno.ultima_atividade).toLocaleDateString('pt-BR')
      : "Nunca respondeu",
    fonte: "Convite aceito"
  }));
}

// --- ATIVIDADE RECENTE DO ALUNO ---
export async function getAtividadeRecente(alunoId, limit = 10) {
  const atividades = await sql/*sql*/`
    SELECT
      r.respondida_em::date AS data,
      COUNT(*)::int AS total_questoes,
      SUM(r.correta::int)::int AS corretas,
      JSON_AGG(DISTINCT q.disciplina) AS disciplinas
    FROM respostas r
    JOIN questoes q ON q.id = r.questao_id
    WHERE r.aluno_id = ${alunoId}
    GROUP BY r.respondida_em::date
    ORDER BY r.respondida_em::date DESC
    LIMIT ${limit}
  `;

  return atividades.map(atividade => ({
    id: `activity-${Date.now()}-${Math.random()}`,
    type: 'practice',
    title: `Estudou ${atividade.disciplinas.join(', ')}`,
    message: `${atividade.total_questoes} questões • ${atividade.corretas}/${atividade.total_questoes} corretas`,
    time: new Date(atividade.data).toLocaleDateString('pt-BR'),
    questoes: atividade.total_questoes,
    acertos: atividade.corretas
  }));
}
// --- MÉTRICAS DE PRODUTIVIDADE ---
export async function getMetricasProdutividade(alunoId) {
  const hoje = new Date();
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay());
  inicioSemana.setHours(0, 0, 0, 0);

  // Questões por dia (últimos 7 dias)
  const [questoesDia] = await sql`
    SELECT COALESCE(AVG(daily.total), 0) as media_diaria
    FROM (
      SELECT DATE(respondida_em) as data, COUNT(*) as total
      FROM respostas
      WHERE aluno_id = ${alunoId}
        AND respondida_em >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(respondida_em)
    ) daily
  `;

  // Sessão média (tempo por questão + consistência)
  const [tempoSessao] = await sql`
    SELECT 
      COALESCE(AVG(tempo_resposta_segundos), 0) as tempo_medio,
      COALESCE(STDDEV(tempo_resposta_segundos), 0) as tempo_variacao
    FROM respostas
    WHERE aluno_id = ${alunoId}
  `;

  // Taxa de sucesso atual
  const [taxaSucesso] = await sql`
    SELECT
      COUNT(*)::int as total,
      COALESCE(AVG(correta::int), 0) as taxa_sucesso
    FROM respostas
    WHERE aluno_id = ${alunoId}
  `;

  // Sequência atual
  const streaks = await getStreaks(alunoId);
  const sequencia = streaks.dias;

  return {
    questoesPorDia: Math.round(Number(questoesDia.media_diaria) || 0),
    sessaoMedia: {
      tempo: Math.round(Number(tempoSessao.tempo_medio) || 0),
      variacao: Math.round(Number(tempoSessao.tempo_variacao) || 0) // consistência
    },
    taxaSucesso: Number(taxaSucesso.taxa_sucesso) || 0,
    sequenciaAtual: sequencia,
    totalQuestoes: taxaSucesso.total || 0
  };
}


// --- FILTROS DE PERÍODO (expandido com evolução e benchmarks) ---
export async function getDadosPorPeriodo(alunoId, periodo = 'today') {
  let dataInicio, dataInicioAnterior;

  switch (periodo) {
    case 'today':
      dataInicio = new Date();
      dataInicio.setHours(0, 0, 0, 0);
      dataInicioAnterior = new Date(dataInicio);
      dataInicioAnterior.setDate(dataInicioAnterior.getDate() - 1);
      break;
    case 'week':
      dataInicio = new Date();
      dataInicio.setDate(dataInicio.getDate() - 7);
      dataInicioAnterior = new Date();
      dataInicioAnterior.setDate(dataInicioAnterior.getDate() - 14);
      break;
    case 'month':
      dataInicio = new Date();
      dataInicio.setMonth(dataInicio.getMonth() - 1);
      dataInicioAnterior = new Date();
      dataInicioAnterior.setMonth(dataInicioAnterior.getMonth() - 2);
      break;
    case 'all':
    default:
      dataInicio = new Date('2020-01-01');
      dataInicioAnterior = new Date('2020-01-01');
      break;
  }

  // Dados atuais
  const [stats] = await sql`
    SELECT
      COUNT(*)::int as total_questoes,
      COALESCE(AVG(correta::int), 0) as taxa_acerto,
      COALESCE(AVG(tempo_resposta_segundos), 0) as tempo_medio,
      COUNT(*) FILTER (WHERE correta = true) as corretas,
      COUNT(*) FILTER (WHERE correta = false) as erradas
    FROM respostas
    WHERE aluno_id = ${alunoId}
      AND respondida_em >= ${dataInicio}
  `;

  // Dados período anterior (para evolução)
  const [statsAnterior] = await sql`
    SELECT
      COUNT(*)::int as total_questoes,
      COALESCE(AVG(correta::int), 0) as taxa_acerto
    FROM respostas
    WHERE aluno_id = ${alunoId}
      AND respondida_em >= ${dataInicioAnterior}
      AND respondida_em < ${dataInicio}
  `;

  // Desempenho por disciplina (com dificuldade média)
  const desempenhoPorDisciplina = await sql`
    SELECT
      q.disciplina,
      COUNT(*)::int as total,
      COALESCE(AVG(r.correta::int), 0) as taxa_acerto,
      COALESCE(AVG(
        CASE q.nivel_dificuldade
          WHEN 'facil' THEN 1
          WHEN 'medio' THEN 2
          WHEN 'dificil' THEN 3
          ELSE 2
        END
      ), 0) as dificuldade_media
    FROM respostas r
    JOIN questoes q ON q.id = r.questao_id
    WHERE r.aluno_id = ${alunoId}
      AND r.respondida_em >= ${dataInicio}
    GROUP BY q.disciplina
    ORDER BY total DESC
  `;

  // Benchmarks (global e turma)
  const [benchmarkGlobal] = await sql`
    SELECT COALESCE(AVG(correta::int), 0) as media
    FROM respostas
    WHERE respondida_em >= ${dataInicio}
  `;

  const [benchmarkTurma] = await sql`
    SELECT COALESCE(AVG(r.correta::int), 0) as media
    FROM respostas r
    JOIN convites c ON r.aluno_id = c.aluno_id
    WHERE c.professor_id IN (
      SELECT professor_id FROM convites WHERE aluno_id = ${alunoId}
    )
    AND r.respondida_em >= ${dataInicio}
  `;

  // Evolução percentual
  function evolucao(atual, anterior) {
    if (!anterior || anterior === 0) return null;
    return ((atual - anterior) / anterior) * 100;
  }

  return {
    periodo,
    resumo: {
      totalQuestoes: stats.total_questoes || 0,
      corretas: stats.corretas || 0,
      erradas: stats.erradas || 0,
      taxaAcerto: Number(stats.taxa_acerto) || 0,
      tempoMedio: Math.round(Number(stats.tempo_medio) || 0),
      evolucao: {
        totalQuestoes: evolucao(stats.total_questoes, statsAnterior.total_questoes),
        taxaAcerto: evolucao(Number(stats.taxa_acerto), Number(statsAnterior.taxa_acerto))
      }
    },
    desempenhoPorDisciplina: desempenhoPorDisciplina.map(d => ({
      disciplina: d.disciplina,
      total: d.total,
      taxaAcerto: Number(d.taxa_acerto),
      dificuldadeMedia: Math.round(Number(d.dificuldade_media) || 0)
    })),
    benchmarks: {
      global: Number(benchmarkGlobal.media) || 0,
      turma: Number(benchmarkTurma?.media) || null
    }
  };
}
// --- EXPORT DE DADOS (expandido) ---
export async function exportDadosAluno(
  alunoId,
  { formato = 'json', de = null, ate = null } = {}
) {
  // Normaliza datas (opcionais)
  const rangeInicio = de ? new Date(de) : null;
  const rangeFim = ate ? new Date(ate) : null;

  // Clause de período
  const periodoClause = rangeInicio && rangeFim
    ? sql`AND r.respondida_em >= ${rangeInicio} AND r.respondida_em < ${rangeFim}`
    : rangeInicio
      ? sql`AND r.respondida_em >= ${rangeInicio}`
      : rangeFim
        ? sql`AND r.respondida_em < ${rangeFim}`
        : sql``;

  const [perfil] = await sql/*sql*/`
    SELECT u.nome_completo, u.email, u.data_criacao
    FROM usuarios u
    WHERE u.id = ${alunoId}
  `;

  // Estatísticas gerais (ponderadas também por dificuldade média)
  const [statsGerais] = await sql/*sql*/`
    SELECT
      COUNT(*)::int                             AS total_questoes,
      COALESCE(AVG(r.correta::int), 0)          AS taxa_acerto_geral,
      COALESCE(AVG(r.tempo_resposta_segundos),0)AS tempo_medio_geral,
      COALESCE(AVG(
        CASE q.nivel_dificuldade
          WHEN 'facil' THEN 1
          WHEN 'medio' THEN 2
          WHEN 'dificil' THEN 3
          ELSE 2
        END
      ), 0) AS dificuldade_media
    FROM respostas r
    JOIN questoes q ON q.id = r.questao_id
    WHERE r.aluno_id = ${alunoId}
      ${periodoClause}
  `;

  // Desempenho por disciplina (inclui dificuldade média e tempo)
  const desempenhoDisciplinas = await sql/*sql*/`
    SELECT
      q.disciplina,
      COUNT(*)::int AS questoes_respondidas,
      COALESCE(AVG(r.correta::int), 0) AS taxa_acerto,
      COALESCE(AVG(r.tempo_resposta_segundos), 0) AS tempo_medio,
      COALESCE(AVG(
        CASE q.nivel_dificuldade
          WHEN 'facil' THEN 1
          WHEN 'medio' THEN 2
          WHEN 'dificil' THEN 3
          ELSE 2
        END
      ), 0) AS dificuldade_media
    FROM respostas r
    JOIN questoes q ON q.id = r.questao_id
    WHERE r.aluno_id = ${alunoId}
      ${periodoClause}
    GROUP BY q.disciplina
    ORDER BY questoes_respondidas DESC
  `;

  // Atividade mensal (últimos 12 meses dentro do range)
  const atividadeMensal = await sql/*sql*/`
    SELECT
      to_char(date_trunc('month', r.respondida_em), 'YYYY-MM') AS mes,
      COUNT(*)::int AS questoes,
      COALESCE(AVG(r.correta::int), 0) AS taxa_acerto
    FROM respostas r
    WHERE r.aluno_id = ${alunoId}
      ${periodoClause}
    GROUP BY mes
    ORDER BY mes DESC
    LIMIT 12
  `;

  // Atividade diária (últimos 30 dias)
  const atividadeDiaria = await sql/*sql*/`
    SELECT
      DATE(r.respondida_em) AS dia,
      COUNT(*)::int AS questoes,
      COALESCE(AVG(r.correta::int), 0) AS taxa_acerto
    FROM respostas r
    WHERE r.aluno_id = ${alunoId}
      AND r.respondida_em >= CURRENT_DATE - INTERVAL '30 days'
      ${rangeInicio || rangeFim ? sql`` : sql``}
    GROUP BY DATE(r.respondida_em)
    ORDER BY dia DESC
  `;

  // Heatmap hora × dia da semana (0=domingo)
  const heatmap = await sql/*sql*/`
    SELECT
      EXTRACT(DOW FROM r.respondida_em)::int AS dow,
      EXTRACT(HOUR FROM r.respondida_em)::int AS hora,
      COUNT(*)::int AS questoes,
      COALESCE(AVG(r.correta::int),0) AS taxa_acerto
    FROM respostas r
    WHERE r.aluno_id = ${alunoId}
      ${periodoClause}
    GROUP BY 1,2
    ORDER BY 1,2
  `;

  // Benchmarks global e da(s) turma(s) do aluno
  const [benchmarkGlobal] = await sql/*sql*/`
    SELECT COALESCE(AVG(r.correta::int), 0) AS media
    FROM respostas r
    WHERE 1=1
    ${periodoClause}
  `;

  const [benchmarkTurma] = await sql/*sql*/`
    SELECT COALESCE(AVG(r.correta::int), 0) AS media
    FROM respostas r
    JOIN alunos a ON a.usuario_id = r.aluno_id
    WHERE a.turma IN (
      SELECT a2.turma FROM alunos a2 WHERE a2.usuario_id = ${alunoId}
    )
    ${periodoClause}
  `;

  // Percentil do aluno (em relação a todos, por acerto)
  const [percentil] = await sql/*sql*/`
    WITH por_usuario AS (
      SELECT
        r.aluno_id,
        AVG(r.correta::int) AS taxa
      FROM respostas r
      WHERE 1=1
      ${periodoClause}
      GROUP BY r.aluno_id
    ),
    base AS (
      SELECT
        taxa,
        PERCENT_RANK() OVER (ORDER BY taxa) AS pr
      FROM por_usuario
    ),
    do_aluno AS (
      SELECT taxa FROM por_usuario WHERE aluno_id = ${alunoId}
    )
    SELECT
      CASE
        WHEN (SELECT COUNT(*) FROM base) = 0 THEN NULL
        ELSE (
          SELECT pr FROM base
          WHERE taxa = (SELECT taxa FROM do_aluno LIMIT 1)
          LIMIT 1
        )
      END AS percentil
  `;

  // Top fracos (pondera acerto por dificuldade)
  const topFracos = await sql/*sql*/`
    SELECT
      q.disciplina,
      COUNT(*)::int AS total,
      COALESCE(AVG(r.correta::int), 0) AS taxa_acerto,
      COALESCE(AVG(
        CASE q.nivel_dificuldade
          WHEN 'facil' THEN 1
          WHEN 'medio' THEN 2
          WHEN 'dificil' THEN 3
          ELSE 2
        END
      ), 0) AS dificuldade_media,
      /* score menor => pior (baixa acurácia e/ou alta dificuldade) */
      COALESCE(AVG(r.correta::int), 0) - 0.05 * COALESCE(AVG(
        CASE q.nivel_dificuldade
          WHEN 'facil' THEN 1
          WHEN 'medio' THEN 2
          WHEN 'dificil' THEN 3
          ELSE 2
        END
      ), 0) AS score
    FROM respostas r
    JOIN questoes q ON q.id = r.questao_id
    WHERE r.aluno_id = ${alunoId}
      ${periodoClause}
    GROUP BY q.disciplina
    HAVING COUNT(*) >= 5
    ORDER BY score ASC
    LIMIT 5
  `;

  const dados = {
    meta: {
      formato,
      periodo: {
        de: rangeInicio ? rangeInicio.toISOString() : null,
        ate: rangeFim ? rangeFim.toISOString() : null
      },
      exportadoEm: new Date().toISOString()
    },
    perfil: {
      nome: perfil?.nome_completo ?? null,
      email: perfil?.email ?? null,
      dataCriacao: perfil?.data_criacao ?? null
    },
    estatisticasGerais: {
      totalQuestoes: statsGerais?.total_questoes ?? 0,
      taxaAcertoGeral: Number(statsGerais?.taxa_acerto_geral ?? 0),
      tempoMedioGeral: Math.round(Number(statsGerais?.tempo_medio_geral ?? 0)),
      dificuldadeMedia: Math.round(Number(statsGerais?.dificuldade_media ?? 0))
    },
    benchmarks: {
      global: Number(benchmarkGlobal?.media ?? 0),
      turma: benchmarkTurma?.media !== undefined ? Number(benchmarkTurma.media) : null,
      percentilAcuracia: percentil?.percentil !== null && percentil?.percentil !== undefined
        ? Number(percentil.percentil)
        : null
    },
    desempenhoPorDisciplina: desempenhoDisciplinas.map(d => ({
      disciplina: d.disciplina,
      questoesRespondidas: d.questoes_respondidas,
      taxaAcerto: Number(d.taxa_acerto),
      tempoMedio: Math.round(Number(d.tempo_medio)),
      dificuldadeMedia: Math.round(Number(d.dificuldade_media ?? 0))
    })),
    atividadeMensal: atividadeMensal.map(a => ({
      mes: a.mes,
      questoes: a.questoes,
      taxaAcerto: Number(a.taxa_acerto)
    })),
    atividadeDiaria: atividadeDiaria.map(a => ({
      dia: a.dia,
      questoes: a.questoes,
      taxaAcerto: Number(a.taxa_acerto)
    })),
    heatmapHoraDia: heatmap.map(h => ({
      dow: h.dow,     // 0=dom, 6=sáb
      hora: h.hora,   // 0..23
      questoes: h.questoes,
      taxaAcerto: Number(h.taxa_acerto)
    })),
    pontosFracos: topFracos.map(r => ({
      disciplina: r.disciplina,
      total: r.total,
      taxaAcerto: Number(r.taxa_acerto),
      dificuldadeMedia: Math.round(Number(r.dificuldade_media ?? 0))
    }))
  };

  if (formato === 'json') {
    return dados;
  }

  if (formato === 'csv') {
    // Monta CSVs simples por “tabela” e retorna um pacote
    const toCSV = (rows) => {
      if (!rows || rows.length === 0) return '';
      const headers = Object.keys(rows[0]);
      const linhas = rows.map(r =>
        headers.map(h => (r[h] ?? '')).join(',')
      );
      return [headers.join(','), ...linhas].join('\n');
    };

    return {
      formato: 'csv',
      arquivos: {
        perfil: toCSV([dados.perfil]),
        estatisticas_gerais: toCSV([dados.estatisticasGerais]),
        benchmarks: toCSV([dados.benchmarks]),
        desempenho_por_disciplina: toCSV(dados.desempenhoPorDisciplina),
        atividade_mensal: toCSV(dados.atividadeMensal),
        atividade_diaria: toCSV(dados.atividadeDiaria),
        heatmap_hora_dia: toCSV(dados.heatmapHoraDia),
        pontos_fracos: toCSV(dados.pontosFracos),
        meta: toCSV([dados.meta])
      }
    };
  }

  // fallback
  return dados;
}
// --- RECOMENDAÇÕES IA (expandido) ---
export async function getRecomendacoesIA(alunoId) {
  // Base por disciplina: acerto, tempo e dificuldade
  const base = await sql/*sql*/`
    SELECT
      q.disciplina,
      COUNT(r.*)::int AS total_respostas,
      COALESCE(AVG(r.correta::int), 0) AS taxa_acerto,
      COALESCE(AVG(r.tempo_resposta_segundos), 0) AS tempo_medio,
      COALESCE(AVG(
        CASE q.nivel_dificuldade
          WHEN 'facil' THEN 1
          WHEN 'medio' THEN 2
          WHEN 'dificil' THEN 3
          ELSE 2
        END
      ), 0) AS dificuldade_media
    FROM respostas r
    JOIN questoes q ON q.id = r.questao_id
    WHERE r.aluno_id = ${alunoId}
    GROUP BY q.disciplina
    ORDER BY total_respostas DESC
  `;

  // Frequência semanal (dias ativos)
  const [frequencia] = await sql/*sql*/`
    SELECT COUNT(DISTINCT DATE(respondida_em))::int AS dias_ativos
    FROM respostas
    WHERE aluno_id = ${alunoId}
      AND respondida_em >= CURRENT_DATE - INTERVAL '7 days'
  `;

  // Melhor janela horária (hora do dia com melhor acerto, min. 20 questões)
  const melhorJanela = await sql/*sql*/`
    SELECT
      EXTRACT(HOUR FROM r.respondida_em)::int AS hora,
      COUNT(*)::int AS total,
      COALESCE(AVG(r.correta::int),0) AS taxa
    FROM respostas r
    WHERE r.aluno_id = ${alunoId}
    GROUP BY 1
    HAVING COUNT(*) >= 20
    ORDER BY taxa DESC, total DESC
    LIMIT 1
  `;

  // Média global por disciplina (para comparar tempo/acerto do aluno)
  const mediaGlobal = await sql/*sql*/`
    SELECT
      q.disciplina,
      COALESCE(AVG(r.correta::int),0) AS media_acerto_global,
      COALESCE(AVG(r.tempo_resposta_segundos),0) AS tempo_medio_global
    FROM respostas r
    JOIN questoes q ON q.id = r.questao_id
    GROUP BY q.disciplina
  `;

  const globalByDisc = new Map(mediaGlobal.map(x => [x.disciplina, x]));

  // Calcula “score” (menor => pior) ponderando dificuldade
  const enriched = base.map(d => {
    const g = globalByDisc.get(d.disciplina) || { media_acerto_global: 0, tempo_medio_global: 0 };
    const score = Number(d.taxa_acerto) - 0.05 * Number(d.dificuldade_media); // simples e eficaz
    const deltaTempo = Number(d.tempo_medio) - Number(g.tempo_medio_global);  // + => mais lento que média
    const deltaAcerto = Number(d.taxa_acerto) - Number(g.media_acerto_global); // - => abaixo da média
    return { ...d, score, deltaTempo, deltaAcerto };
  });

  const pontosFracos = enriched
    .filter(d => d.total_respostas >= 8) // evita ruído
    .sort((a,b) => a.score - b.score)
    .slice(0, 2);

  const pontosFortes = enriched
    .filter(d => d.total_respostas >= 8)
    .sort((a,b) => b.score - a.score)
    .slice(0, 2);

  // Confiança simples baseada em tamanho de amostra
  const conf = (n) => Math.max(0, Math.min(1, (n - 8) / 50)); // 8 respostas = 0, 58 = ~1

  const recomendacoes = [];

  // 1) Foco no pior fraco com plano acionável
  if (pontosFracos.length > 0) {
    const d = pontosFracos[0];
    const metaQtd = Math.max(15, Math.min(40, Math.ceil(d.total_respostas * 0.6)));
    const alvoAcerto = Math.min(0.85, Math.max(0.65, d.taxa_acerto + 0.1));
    recomendacoes.push({
      tipo: 'reforco',
      titulo: `Refinar ${d.disciplina}`,
      acao: `Pratique ${metaQtd} questões de ${d.disciplina} nos próximos 7 dias`,
      metas: {
        taxaAcertoAlvo: Number(alvoAcerto.toFixed(2)),
        tempoMedioAlvo: Math.max(25, Math.round(Number(d.tempo_medio) * 0.9)) // 10% mais rápido
      },
      rationale: `Acurácia ${Math.round(d.taxa_acerto*100)}% com dificuldade média ${Math.round(d.dificuldade_media)}, tempo médio ${Math.round(d.tempo_medio)}s (Δtempo vs. global: ${Math.round(d.deltaTempo)}s).`,
      confidence: Number(conf(d.total_respostas).toFixed(2))
    });
  }

  // 2) Acelerar onde está lento (tempo acima da média global)
  const maisLentas = enriched
    .filter(d => d.deltaTempo > 8 && d.total_respostas >= 8)
    .sort((a,b) => b.deltaTempo - a.deltaTempo)
    .slice(0,1);

  if (maisLentas.length > 0) {
    const d = maisLentas[0];
    recomendacoes.push({
      tipo: 'velocidade',
      titulo: `Ganhar velocidade em ${d.disciplina}`,
      acao: `Faça blocos cronometrados de 10 questões de ${d.disciplina} (2 blocos/dia por 3 dias).`,
      metas: {
        tempoMedioAlvo: Math.max(20, Math.round(Number(d.tempo_medio) - 8)),
        manterAcuraciaMin: Math.max(0.6, Number(d.taxa_acerto) - 0.02)
      },
      rationale: `Você está ${Math.round(d.deltaTempo)}s/questão mais lento que a média global nesta disciplina.`,
      confidence: Number(conf(d.total_respostas).toFixed(2))
    });
  }

  // 3) Alavancar ponto forte (subir o nível)
  if (pontosFortes.length > 0) {
    const d = pontosFortes[0];
    const metaQtd = Math.max(10, Math.ceil(d.total_respostas * 0.4));
    recomendacoes.push({
      tipo: 'aprofundamento',
      titulo: `Aprofundar em ${d.disciplina}`,
      acao: `Resolva ${metaQtd} questões de nível avançado e 2 simulados curtos.`,
      metas: {
        manterAcuraciaMin: Math.max(0.8, Number(d.taxa_acerto)),
        tempoMedioMax: Math.round(Number(d.tempo_medio) * 1.05)
      },
      rationale: `Bom desempenho (acurácia ${Math.round(d.taxa_acerto*100)}%) com dificuldade média ${Math.round(d.dificuldade_media)}.`,
      confidence: Number(conf(d.total_respostas).toFixed(2))
    });
  }

  // 4) Hábito & horário ótimo
  if (frequencia?.dias_ativos < 5) {
    recomendacoes.push({
      tipo: 'habito',
      titulo: 'Aumentar frequência semanal',
      acao: 'Estude 5 dias/semana (sessões de 25–35min).',
      metas: { diasAtivosSemana: 5 },
      rationale: `Você estudou ${frequencia?.dias_ativos ?? 0} dias na última semana.`,
      confidence: 0.7
    });
  }

  if (melhorJanela.length > 0) {
    const best = melhorJanela[0];
    recomendacoes.push({
      tipo: 'planejamento',
      titulo: 'Aproveitar sua melhor janela',
      acao: `Agende práticas no horário ${best.hora}:00–${(best.hora+1)%24}:00.`,
      metas: { sessoesNaJanela: 3 },
      rationale: `Maior acurácia de ${Math.round(Number(best.taxa)*100)}% com amostra de ${best.total} questões nesse horário.`,
      confidence: Math.min(1, best.total / 60)
    });
  }

  // Ordena por maior “impacto” implícito (reforço/velocidade > hábito > planejamento)
  const peso = { reforco: 4, velocidade: 3, aprofundamento: 3, habito: 2, planejamento: 1 };
  recomendacoes.sort((a,b) => (peso[b.tipo] || 0) - (peso[a.tipo] || 0));

  // Retorna no máximo 4 recomendações
  return recomendacoes.slice(0, 4);
}
// --- PREVISÃO DE APROVAÇÃO ---
export async function getPrevisaoAprovacao(alunoId) {
  // Coletar dados históricos do aluno
  const [statsGerais] = await sql`
    SELECT
      COUNT(*)::int as total_questoes,
      COALESCE(AVG(correta::int), 0) as taxa_acerto_geral,
      COALESCE(AVG(tempo_resposta_segundos), 0) as tempo_medio
    FROM respostas
    WHERE aluno_id = ${alunoId}
  `;

  // Análise por disciplina
  const desempenhoDisciplinas = await sql`
    SELECT
      q.disciplina,
      COUNT(*)::int as questoes,
      COALESCE(AVG(r.correta::int), 0) as taxa_acerto
    FROM respostas r
    JOIN questoes q ON q.id = r.questao_id
    WHERE r.aluno_id = ${alunoId}
    GROUP BY q.disciplina
  `;

  // Calcular tendência (últimas 2 semanas)
  const [tendencia] = await sql`
    SELECT
      COALESCE(AVG(CASE WHEN respondida_em >= CURRENT_DATE - INTERVAL '7 days' THEN correta::int END), 0) as semana_atual,
      COALESCE(AVG(CASE WHEN respondida_em >= CURRENT_DATE - INTERVAL '14 days' AND respondida_em < CURRENT_DATE - INTERVAL '7 days' THEN correta::int END), 0) as semana_anterior
    FROM respostas
    WHERE aluno_id = ${alunoId}
      AND respondida_em >= CURRENT_DATE - INTERVAL '14 days'
  `;

  // Algoritmo de previsão simples
  let previsaoBase = Number(statsGerais.taxa_acerto_geral) * 100;

  // Ajustar baseado na consistência (apenas disciplinas com volume mínimo)
  const disciplinasValidas = desempenhoDisciplinas.filter(d => d.questoes >= 10);
  const disciplinasAcima80 = disciplinasValidas.filter(d => Number(d.taxa_acerto) >= 0.8).length;
  const bonusConsistencia = (disciplinasValidas.length > 0 ? (disciplinasAcima80 / disciplinasValidas.length) * 5 : 0);

  // Ajustar baseado na tendência semanal
  const melhoriaTendencia = Number(tendencia.semana_atual) - Number(tendencia.semana_anterior);
  const bonusTendencia = melhoriaTendencia * 10;

  // Volume de questões como indicador de preparação
  const bonusVolume = Math.min(statsGerais.total_questoes / 100, 1) * 10;

  // Previsão final
  let previsaoFinal = previsaoBase + bonusConsistencia + bonusTendencia + bonusVolume;

  // Penalizar pouca amostragem
  if (statsGerais.total_questoes < 50) {
    previsaoFinal *= 0.85; // reduz confiança
  }

  previsaoFinal = Math.max(0, Math.min(100, previsaoFinal));

  return Math.round(previsaoFinal);
}

// --- JORNADA DE APRENDIZADO ---
export async function getJornadaAprendizado(alunoId) {
  const jornada = await sql`
    SELECT
      to_char(date_trunc('week', r.respondida_em), 'YYYY-MM-DD') AS semana,
      COUNT(*) FILTER (WHERE r.correta = true) AS acertos,
      COUNT(*) AS total_questoes
    FROM respostas r
    WHERE r.aluno_id = ${alunoId}
      AND r.respondida_em >= CURRENT_DATE - INTERVAL '6 months'
    GROUP BY to_char(date_trunc('week', r.respondida_em), 'YYYY-MM-DD')
    ORDER BY to_char(date_trunc('week', r.respondida_em), 'YYYY-MM-DD') DESC
    LIMIT 12
  `;

  return jornada.map(item => ({
    semana: item.semana,
    acertos: parseInt(item.acertos) || 0,
    total: parseInt(item.total_questoes) || 0,
    taxaAcerto: item.total_questoes > 0
      ? Math.round((item.acertos / item.total_questoes) * 100)
      : 0
  }));
}

// --- MAPA DE FORÇA POR DISCIPLINA ---
export async function getMapaForca(alunoId) {
  const mapaForca = await sql`
    SELECT
      COALESCE(q.disciplina, 'Sem disciplina') AS disciplina,
      COUNT(*) FILTER (WHERE r.correta = true) AS acertos,
      COUNT(*) AS total_questoes,
      ROUND((COUNT(*) FILTER (WHERE r.correta = true)::decimal / NULLIF(COUNT(*)::decimal,0)) * 100, 2) AS desempenho
    FROM respostas r
    JOIN questoes q ON r.questao_id = q.id
    WHERE r.aluno_id = ${alunoId}
    GROUP BY q.disciplina
    ORDER BY desempenho DESC
  `;

  return mapaForca.map(item => ({
    disciplina: item.disciplina,
    desempenho: parseFloat(item.desempenho) || 0,
    questoesRespondidas: parseInt(item.total_questoes) || 0,
    status: parseFloat(item.desempenho) >= 80 ? 'forte' :
            parseFloat(item.desempenho) >= 60 ? 'medio' : 'fraco'
  }));
}

// --- STREAKS ---
export async function getStreaks(alunoId) {
  // Buscar atividades diárias do último ano
  const atividadesDiarias = await sql`
    SELECT
      DATE(respondida_em) as data,
      COUNT(*)::int as questoes_do_dia
    FROM respostas
    WHERE aluno_id = ${alunoId}
      AND respondida_em >= CURRENT_DATE - INTERVAL '365 days'
    GROUP BY DATE(respondida_em)
    ORDER BY data ASC
  `;

  let recorde = 0;
  let sequenciaAtual = 0;
  let ultimaData = null;

  for (const atividade of atividadesDiarias) {
    const dataAtividade = new Date(atividade.data);
    if (!ultimaData) {
      sequenciaAtual = 1;
    } else {
      const diffDias = Math.floor((dataAtividade - ultimaData) / (1000 * 60 * 60 * 24));
      if (diffDias === 1) {
        sequenciaAtual++;
      } else if (diffDias > 1) {
        sequenciaAtual = 1; // reinicia streak
      }
    }
    recorde = Math.max(recorde, sequenciaAtual);
    ultimaData = dataAtividade;
  }

  return {
    dias: sequenciaAtual,
    recorde
  };
}

// --- AGENDA DE ESTUDO ---
export async function getAgendaEstudo(alunoId) {
  const atividades = await sql`
    SELECT
      DATE(r.respondida_em) as data,
      COUNT(*)::int as questoes,
      q.disciplina
    FROM respostas r
    JOIN questoes q ON r.questao_id = q.id
    WHERE r.aluno_id = ${alunoId}
      AND r.respondida_em >= CURRENT_DATE
      AND r.respondida_em < CURRENT_DATE + INTERVAL '7 days'
    GROUP BY DATE(r.respondida_em), q.disciplina
    ORDER BY DATE(r.respondida_em) ASC
    LIMIT 10
  `;

  if (atividades.length === 0) {
    // Disciplinas mais praticadas historicamente
    const disciplinas = await sql`
      SELECT
        q.disciplina,
        COUNT(*)::int as total
      FROM respostas r
      JOIN questoes q ON r.questao_id = q.id
      WHERE r.aluno_id = ${alunoId}
      GROUP BY q.disciplina
      ORDER BY total DESC
      LIMIT 3
    `;

    const agendaPadrao = [];
    const hoje = new Date();

    for (let i = 0; i < 7; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);

      if (disciplinas.length > 0) {
        const disciplina = disciplinas[i % disciplinas.length].disciplina;
        agendaPadrao.push({
          titulo: `Revisar ${disciplina}`,
          horario: '19:00',
          data: data.toISOString().split('T')[0]
        });
      }
    }

    return agendaPadrao;
  }

  return atividades.map(atividade => ({
    titulo: `Praticar ${atividade.disciplina}`,
    horario: '19:00',
    data: new Date(atividade.data).toISOString().split('T')[0]
  }));
}

// --- ALERTAS DE FADIGA ---
export async function getAlertasFadiga(alunoId) {
  const alertas = [];

  // Tempo médio recente
  const [tempoMedio] = await sql`
    SELECT COALESCE(AVG(tempo_resposta_segundos), 0) as tempo_medio
    FROM respostas
    WHERE aluno_id = ${alunoId}
      AND respondida_em >= CURRENT_DATE - INTERVAL '7 days'
  `;

  if (Number(tempoMedio.tempo_medio) > 120) {
    alertas.push({
      tipo: 'fadiga',
      mensagem: 'Seu tempo médio de resposta está alto. Faça pausas regulares.',
      severidade: 'media'
    });
  }

  // Inatividade
  const [ultimaAtividade] = await sql`
    SELECT MAX(respondida_em) as ultima
    FROM respostas
    WHERE aluno_id = ${alunoId}
  `;

  if (ultimaAtividade.ultima) {
    const diasInativo = Math.floor((Date.now() - new Date(ultimaAtividade.ultima).getTime()) / (1000 * 60 * 60 * 24));
    if (diasInativo > 3) {
      alertas.push({
        tipo: 'inatividade',
        mensagem: `Você não pratica há ${diasInativo} dias. Retome sua rotina de estudos.`,
        severidade: diasInativo > 7 ? 'alta' : 'baixa'
      });
    }
  }

  // Queda de desempenho
  const [desempenhoRecente] = await sql`
    SELECT
      COALESCE(AVG(CASE WHEN respondida_em >= CURRENT_DATE - INTERVAL '7 days' THEN correta::int END), 0) as recente,
      COALESCE(AVG(CASE WHEN respondida_em >= CURRENT_DATE - INTERVAL '14 days'
                      AND respondida_em < CURRENT_DATE - INTERVAL '7 days' THEN correta::int END), 0) as anterior
    FROM respostas
    WHERE aluno_id = ${alunoId}
      AND respondida_em >= CURRENT_DATE - INTERVAL '14 days'
  `;

  if (desempenhoRecente.anterior && desempenhoRecente.recente) {
    const queda = Number(desempenhoRecente.anterior) - Number(desempenhoRecente.recente);
    if (queda > 0.1) {
      alertas.push({
        tipo: 'desempenho',
        mensagem: 'Houve queda no seu desempenho. Considere revisar os conteúdos antes de avançar.',
        severidade: 'alta'
      });
    }
  }

  return alertas;
}

// --- COMPARATIVO COM TURMA ---
export async function getComparativoTurma(alunoId) {
  // Por enquanto, retorna dados vazios até implementar turmas
  const stats = await getAlunoStats(alunoId);

  return {
    posicaoPercentil: 0, // placeholder
    taxaAcertoAluno: stats.taxaAcertoGeral,
    taxaAcertoTurma: 0, // placeholder
    questoesRespondidas: stats.respostasCorretas + stats.respostasErradas
  };
}

// --- PROGRESSO DE METAS ---
export async function getProgressoMetas(alunoId) {
  const metas = await calcularMetasReais(alunoId);

  return {
    semanal: {
      current: metas.semanal.current,
      target: metas.semanal.target,
      progresso: Math.min(100, Math.round((metas.semanal.current / metas.semanal.target) * 100)),
      restante: Math.max(0, metas.semanal.target - metas.semanal.current)
    },
    acerto: {
      current: Math.round(metas.acerto.current * 100),
      target: Math.round(metas.acerto.target * 100),
      progresso: Math.min(100, Math.round((metas.acerto.current / metas.acerto.target) * 100)),
      restante: Math.max(0, Math.round((metas.acerto.target - metas.acerto.current) * 100))
    },
    tempo: {
      current: metas.tempo.current,
      target: metas.tempo.target,
      progresso: metas.tempo.current <= metas.tempo.target ? 100 : Math.max(0, Math.round((metas.tempo.target / metas.tempo.current) * 100)),
      restante: Math.max(0, metas.tempo.target - metas.tempo.current)
    }
  };
}
