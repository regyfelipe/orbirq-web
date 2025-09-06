// orbirq/src/features/dashboard/services/dashboardService.ts

import { api } from "@/shared/services/api";

// --- HELPER PARA REQUISIÇÕES SEGUROS ---
const safeGet = async <T>(url: string, fallback: T): Promise<T> => {
  try {
    console.log(`[API] Fazendo requisição para: ${url}`);
    const data = await api.get(url);
    console.log(`[API] Resposta recebida para ${url}:`, data);
    return (data ?? fallback) as T;
  } catch (e) {
    console.error(`Erro ao buscar ${url}:`, e);
    return fallback;
  }
};

// --- TIPAGENS ALUNO ---
export interface AlunoDashboardData {
  taxaAcertoGeral: number;
  tempoMedioRespostaSegundos: number;
  respostasCorretas: number;
  respostasErradas: number;
  acertoPorDisciplina: Array<{
    disciplina: string;
    taxaAcerto: number;
  }>;
  desempenhoTempo: Array<{
    data: string;
    acerto: number;
  }>;
  recomendadas: Array<{
    id: string;
    titulo: string;
    disciplina: string;
  }>;
}

export interface ConquistasData {
  questoesRespondidas: number;
  taxaAcertoGeral: number;
  sequenciaAtual: number;
  nivel: number;
}

export interface MetasData {
  semanal: { current: number; target: number };
  acerto: { current: number; target: number };
  tempo: { current: number; target: number };
}

export interface InsightsData {
  mainInsight: string;
  recommendations: string[];
  weakAreas: string[];
  strengths: string[];
  nextSteps: string[];
}

export interface Notificacao {
  id: string;
  type: 'achievement' | 'streak' | 'goal' | 'milestone' | 'reminder';
  title: string;
  message: string;
  time: string;
}

export interface AtividadeRecente {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  disciplina?: string;
  questoes?: number;
  acertos?: number;
}

export interface MetricasProdutividade {
  questoesPorDia: number;
  sessaoMedia: number;
  taxaSucesso: number;
  sequenciaAtual: number;
  totalQuestoes: number;
}

export interface DadosPeriodo {
  periodo: string;
  totalQuestoes: number;
  taxaAcerto: number;
  tempoMedio: number;
  corretas: number;
  erradas: number;
  desempenhoPorDisciplina: Array<{
    disciplina: string;
    total: number;
    taxaAcerto: number;
  }>;
}

export interface ProgressoMetas {
  semanal: {
    current: number;
    target: number;
    progresso: number;
    restante: number;
  };
  acerto: {
    current: number;
    target: number;
    progresso: number;
    restante: number;
  };
  tempo: {
    current: number;
    target: number;
    progresso: number;
    restante: number;
  };
}

// --- ALUNO DASHBOARD ---
export const getAlunoDashboard = async (): Promise<AlunoDashboardData> => {
  const fallback: AlunoDashboardData = {
    taxaAcertoGeral: 0,
    tempoMedioRespostaSegundos: 0,
    respostasCorretas: 0,
    respostasErradas: 0,
    acertoPorDisciplina: [],
    desempenhoTempo: [],
    recomendadas: []
  };

  const data = await safeGet('/dashboard/aluno', fallback);

  const respostasCorretas = Number(data.respostasCorretas) || 0;
  const respostasErradas = Number(data.respostasErradas) || 0;

  return {
    ...fallback,
    ...data,
    respostasCorretas,
    respostasErradas,
    taxaAcertoGeral: Number(data.taxaAcertoGeral) || 0,
    tempoMedioRespostaSegundos: Number(data.tempoMedioRespostaSegundos) || 0,
    acertoPorDisciplina: Array.isArray(data.acertoPorDisciplina) ? data.acertoPorDisciplina : [],
    desempenhoTempo: Array.isArray(data.desempenhoTempo)
      ? data.desempenhoTempo.map((item: any) => ({
          data: item.mes ?? '',
          acerto: Math.round(
            ((Number(item.respostasCorretas) || 0) /
              (((Number(item.respostasCorretas) || 0) + (Number(item.respostasErradas) || 0)) || 1)) *
              100
          )
        }))
      : [],
    recomendadas: Array.isArray(data.recomendadas) ? data.recomendadas : []
  };
};

export const getAlunoConquistas = () =>
  safeGet<ConquistasData>('/dashboard/aluno/conquistas', {
    questoesRespondidas: 0,
    taxaAcertoGeral: 0,
    sequenciaAtual: 0,
    nivel: 1
  });

export const getAlunoMetas = () =>
  safeGet<MetasData>('/dashboard/aluno/metas', {
    semanal: { current: 0, target: 50 },
    acerto: { current: 0, target: 85 },
    tempo: { current: 0, target: 45 }
  });

export const getAlunoInsights = () =>
  safeGet<InsightsData>('/dashboard/aluno/insights', {
    mainInsight: '',
    recommendations: [],
    weakAreas: [],
    strengths: [],
    nextSteps: []
  });

export const getAlunoNotificacoes = () =>
  safeGet<Notificacao[]>('/dashboard/aluno/notificacoes', []);

export const getAtividadeRecente = (limit = 10) =>
  safeGet<AtividadeRecente[]>(`/dashboard/aluno/atividade?limit=${limit}`, []);

export const getMetricasProdutividade = () =>
  safeGet<MetricasProdutividade>('/dashboard/aluno/produtividade', {
    questoesPorDia: 0,
    sessaoMedia: 0,
    taxaSucesso: 0,
    sequenciaAtual: 0,
    totalQuestoes: 0
  });

export const getDadosPorPeriodo = (periodo = 'today') =>
  safeGet<DadosPeriodo>(`/dashboard/aluno/periodo?periodo=${periodo}`, {
    periodo,
    totalQuestoes: 0,
    taxaAcerto: 0,
    tempoMedio: 0,
    corretas: 0,
    erradas: 0,
    desempenhoPorDisciplina: []
  });

export const exportDados = (formato = 'json') =>
  safeGet<Record<string, unknown>>(`/dashboard/aluno/export?formato=${formato}`, {});

export const getProgressoMetas = () =>
  safeGet<ProgressoMetas>('/dashboard/aluno/progresso-metas', {
    semanal: { current: 0, target: 50, progresso: 0, restante: 50 },
    acerto: { current: 0, target: 85, progresso: 0, restante: 85 },
    tempo: { current: 0, target: 45, progresso: 0, restante: 45 }
  });

// --- IA E GAMIFICAÇÃO ---
export interface RecomendacaoIA {
  titulo: string;
  descricao: string;
}
export interface PrevisaoAprovacao { previsao: number }
export interface StreaksData { dias: number; recorde: number }
export interface AgendaItem { titulo: string; horario: string; data: string }
export interface AlertaFadiga {
  tipo: 'fadiga' | 'inatividade';
  mensagem: string;
  severidade: 'baixa' | 'media' | 'alta';
}
export interface JornadaItem { semana: string; acertos: number }
export interface MapaForcaItem { disciplina: string; desempenho: number; status: 'forte' | 'medio' | 'fraco' }
export interface ComparativoTurma {
  posicaoPercentil: number;
  taxaAcertoAluno: number;
  taxaAcertoTurma: number;
  questoesRespondidas: number;
}

export const getRecomendacoesIA = () =>
  safeGet<RecomendacaoIA[]>('/dashboard/aluno/recomendacoes-ia', []);
export const getPrevisaoAprovacao = () =>
  safeGet<PrevisaoAprovacao>('/dashboard/aluno/previsao-aprovacao', { previsao: 0 });
export const getStreaks = () =>
  safeGet<StreaksData>('/dashboard/aluno/streaks', { dias: 0, recorde: 0 });
export const getAgendaEstudo = () =>
  safeGet<AgendaItem[]>('/dashboard/aluno/agenda-estudo', []);
export const getAlertasFadiga = () =>
  safeGet<AlertaFadiga[]>('/dashboard/aluno/alertas-fadiga', []);
export const getJornadaAprendizado = () =>
  safeGet<JornadaItem[]>('/dashboard/aluno/jornada-aprendizado', []);
export const getMapaForca = () =>
  safeGet<MapaForcaItem[]>('/dashboard/aluno/mapa-forca', []);
export const getComparativoTurma = () =>
  safeGet<ComparativoTurma>('/dashboard/aluno/comparativo-turma', {
    posicaoPercentil: 0,
    taxaAcertoAluno: 0,
    taxaAcertoTurma: 0,
    questoesRespondidas: 0
  });

// Função para resetar conquistas
export const resetarConquistas = async (alunoId: string) => {
  try {
    const { data } = await api.delete(`/respostas/conquistas/${alunoId}`);
    return data;
  } catch (error) {
    console.error('Erro ao resetar conquistas:', error);
    throw error;
  }
};

// --- PROFESSOR DASHBOARD ---
export interface ProfessorDashboardData {
  totalQuestoes: number;
  mediaAcerto: number;
  mediaRating: number;
  questoesPorDisciplina: Array<{
    disciplina: string;
    totalQuestoes: number;
    mediaRating: number;
    taxaAcerto: number;
  }>;
}

export const getProfessorDashboard = () =>
  safeGet<ProfessorDashboardData>('/dashboard/professor', {
    totalQuestoes: 0,
    mediaAcerto: 0,
    mediaRating: 0,
    questoesPorDisciplina: []
  });

export interface AlunoStats {
  id: string;
  nome: string;
  email: string;
  questoesRespondidas: number;
  taxaAcerto: number;
  nivel: number;
  ultimaAtividade: string;
  fonte: string;
  turma: string;
}

export const getProfessorAlunosStats = async (): Promise<AlunoStats[]> => {
  const alunos = await safeGet<AlunoStats[]>('/dashboard/professor/alunos', []);
  return alunos.map(a => ({
    ...a,
    turma: a.turma || 'Sem turma'
  }));
};

// --- ADMIN DASHBOARD ---
export interface AdminDashboardData {
  totals: { usuarios: number };
  questoes: { total: number; ineditas: number; bancoProvas: number };
  engajamento: { taxaEngajamento: number };
  crescimentoAlunos: Array<{ mes: string; total: number }>;
  rankingProfessores: Array<{ autor: string; total: number }>;
  questoesMaisBemAvaliadas: Array<{ id: string; pergunta: string; rating: number }>;
}

export const getAdminDashboard = () =>
  safeGet<AdminDashboardData>('/dashboard/admin', {
    totals: { usuarios: 0 },
    questoes: { total: 0, ineditas: 0, bancoProvas: 0 },
    engajamento: { taxaEngajamento: 0 },
    crescimentoAlunos: [],
    rankingProfessores: [],
    questoesMaisBemAvaliadas: []
  });
