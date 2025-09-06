import {
  getUsersCounts,
  getQuestoesCounts,
  getEngajamento,
  getRankingProfessores,
  getTopQuestoes,
  getCrescimentoAlunosUltimosMeses,
  getProfessorStats,
  getAlunoStats
} from "../repositories/dashboardRepository.js"

export async function getAdminOverview() {
  const [
    usersCounts,
    questoesCounts,
    engajamento,
    rankingProf,
    topQuestoes,
    crescimentoAlunos,
  ] = await Promise.all([
    getUsersCounts(),
    getQuestoesCounts(),
    getEngajamento(),
    getRankingProfessores(5),
    getTopQuestoes(5),
    getCrescimentoAlunosUltimosMeses(6),
  ])

  return {
    totals: {
      usuarios: usersCounts.total,
      alunos: usersCounts.alunos,
      professores: usersCounts.professores,
      administradores: usersCounts.administradores,
    },
    questoes: {
      total: questoesCounts.total,
      ineditas: questoesCounts.ineditas,
      bancoProvas: questoesCounts.bancoProvas,
    },
    engajamento,
    rankingProfessores: rankingProf,
    questoesMaisBemAvaliadas: topQuestoes,
    crescimentoAlunos,
  }
}



export async function getAlunoOverview(userId) {
  console.log('🔍 [BACKEND] getAlunoOverview chamado com userId:', userId);
  const stats = await getAlunoStats(userId)

  return {
    taxaAcertoGeral: stats.taxaAcertoGeral,
    tempoMedioRespostaSegundos: stats.tempoMedioRespostaSegundos,
    respostasCorretas: stats.respostasCorretas,
    respostasErradas: stats.respostasErradas,
    totalQuestoes: Number(stats.respostasCorretas) + Number(stats.respostasErradas),
    acertoPorDisciplina: stats.acertoPorDisciplina,
    recomendadas: stats.recomendadas,
    desempenhoTempo: stats.desempenhoTempo
  }
}

export async function getProfessorOverview(userId) {
  const stats = await getProfessorStats(userId)

  return {
    totalQuestoes: stats.totalQuestoes,
    mediaAcerto: stats.mediaAcerto,
    mediaRatingQuestoes: stats.mediaRatingQuestoes,
    questoesPorDisciplina: stats.questoesPorDisciplina,
  }
}

// --- NOVAS FUNÇÕES PARA DADOS REAIS ---
export async function getAlunoConquistas(userId) {
  const { calcularConquistasReais } = await import("../repositories/dashboardRepository.js");
  return await calcularConquistasReais(userId);
}

export async function getAlunoMetas(userId) {
  const { calcularMetasReais } = await import("../repositories/dashboardRepository.js");
  return await calcularMetasReais(userId);
}

export async function getAlunoInsights(userId) {
  const { gerarInsightsReais } = await import("../repositories/dashboardRepository.js");
  return await gerarInsightsReais(userId);
}

export async function getAlunoNotificacoes(userId) {
  const { gerarNotificacoesReais } = await import("../repositories/dashboardRepository.js");
  return await gerarNotificacoesReais(userId);
}

// Buscar estatísticas dos alunos vinculados ao professor via convites
export async function getProfessorAlunosStats(professorId) {
  const { getAlunosVinculadosStats } = await import("../repositories/dashboardRepository.js");
  return await getAlunosVinculadosStats(professorId);
}

// --- NOVAS FUNÇÕES PARA DASHBOARD EXECUTIVO ---
export async function getAtividadeRecente(alunoId, limit = 10) {
  const { getAtividadeRecente } = await import("../repositories/dashboardRepository.js");
  return await getAtividadeRecente(alunoId, limit);
}

export async function getMetricasProdutividade(alunoId) {
  const { getMetricasProdutividade } = await import("../repositories/dashboardRepository.js");
  return await getMetricasProdutividade(alunoId);
}

export async function getDadosPorPeriodo(alunoId, periodo = 'today') {
  const { getDadosPorPeriodo } = await import("../repositories/dashboardRepository.js");
  return await getDadosPorPeriodo(alunoId, periodo);
}

export async function exportDadosAluno(alunoId, formato = 'json') {
  const { exportDadosAluno } = await import("../repositories/dashboardRepository.js");
  return await exportDadosAluno(alunoId, formato);
}

export async function getProgressoMetas(alunoId) {
  const { getProgressoMetas } = await import("../repositories/dashboardRepository.js");
  return await getProgressoMetas(alunoId);
}

// --- NOVAS FUNÇÕES PARA IA E GAMIFICAÇÃO ---
export async function getRecomendacoesIA(alunoId) {
  try {
    const { getRecomendacoesIA } = await import("../repositories/dashboardRepository.js");
    return await getRecomendacoesIA(alunoId);
  } catch (error) {
    console.error("Erro em getRecomendacoesIA:", error);
    return [];
  }
}

export async function getPrevisaoAprovacao(alunoId) {
  try {
    const { getPrevisaoAprovacao } = await import("../repositories/dashboardRepository.js");
    return await getPrevisaoAprovacao(alunoId);
  } catch (error) {
    console.error("Erro em getPrevisaoAprovacao:", error);
    return 0;
  }
}

export async function getStreaks(alunoId) {
  try {
    const { getStreaks } = await import("../repositories/dashboardRepository.js");
    return await getStreaks(alunoId);
  } catch (error) {
    console.error("Erro em getStreaks:", error);
    return { dias: 0, recorde: 0 };
  }
}

export async function getAgendaEstudo(alunoId) {
  try {
    const { getAgendaEstudo } = await import("../repositories/dashboardRepository.js");
    return await getAgendaEstudo(alunoId);
  } catch (error) {
    console.error("Erro em getAgendaEstudo:", error);
    return [];
  }
}

export async function getAlertasFadiga(alunoId) {
  try {
    const { getAlertasFadiga } = await import("../repositories/dashboardRepository.js");
    return await getAlertasFadiga(alunoId);
  } catch (error) {
    console.error("Erro em getAlertasFadiga:", error);
    return [];
  }
}

export async function getJornadaAprendizado(alunoId) {
  try {
    const { getJornadaAprendizado } = await import("../repositories/dashboardRepository.js");
    return await getJornadaAprendizado(alunoId);
  } catch (error) {
    console.error("Erro em getJornadaAprendizado:", error);
    return [];
  }
}

export async function getMapaForca(alunoId) {
  try {
    const { getMapaForca } = await import("../repositories/dashboardRepository.js");
    return await getMapaForca(alunoId);
  } catch (error) {
    console.error("Erro em getMapaForca:", error);
    return [];
  }
}

export async function getComparativoTurma(alunoId) {
  const { getComparativoTurma } = await import("../repositories/dashboardRepository.js");
  return await getComparativoTurma(alunoId);
}

