import {
  getAdminOverview,
  getProfessorOverview,
  getAlunoOverview,
} from "../services/dashboardService.js"

export async function adminDashboard(req, res) {
  try {
    const data = await getAdminOverview()
    res.json(data)
  } catch (err) {
    console.error("Dashboard admin error:", err)
    res.status(500).json({ error: "Erro ao carregar dashboard admin" })
  }
}

export async function professorDashboard(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const data = await getProfessorOverview(userId)
    res.json(data)
  } catch (err) {
    console.error("Dashboard professor error:", err)
    res.status(500).json({ error: "Erro ao carregar dashboard professor" })
  }
}

export async function alunoDashboard(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const data = await getAlunoOverview(userId)
    res.json(data)
  } catch (err) {
    console.error("Dashboard aluno error:", err)
    res.status(500).json({ error: "Erro ao carregar dashboard aluno" })
  }
}

// --- NOVOS ENDPOINTS PARA DADOS REAIS ---
export async function getAlunoConquistas(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const { getAlunoConquistas } = await import("../services/dashboardService.js")
    const data = await getAlunoConquistas(userId)
    res.json(data)
  } catch (err) {
    console.error("Erro ao buscar conquistas:", err)
    res.status(500).json({ error: "Erro ao carregar conquistas" })
  }
}

export async function getAlunoMetas(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const { getAlunoMetas } = await import("../services/dashboardService.js")
    const data = await getAlunoMetas(userId)
    res.json(data)
  } catch (err) {
    console.error("Erro ao buscar metas:", err)
    res.status(500).json({ error: "Erro ao carregar metas" })
  }
}

export async function getAlunoInsights(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const { getAlunoInsights } = await import("../services/dashboardService.js")
    const data = await getAlunoInsights(userId)
    res.json(data)
  } catch (err) {
    console.error("Erro ao buscar insights:", err)
    res.status(500).json({ error: "Erro ao carregar insights" })
  }
}

export async function getAlunoNotificacoes(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const { getAlunoNotificacoes } = await import("../services/dashboardService.js")
    const data = await getAlunoNotificacoes(userId)
    res.json(data)
  } catch (err) {
    console.error("Erro ao buscar notificações:", err)
    res.status(500).json({ error: "Erro ao carregar notificações" })
  }
}

export async function getProfessorAlunosStats(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const { getProfessorAlunosStats } = await import("../services/dashboardService.js")
    const data = await getProfessorAlunosStats(userId)
    res.json(data)
  } catch (err) {
    console.error("Erro ao buscar alunos do professor:", err)
    res.status(500).json({ error: "Erro ao carregar alunos" })
  }
}

// --- NOVOS CONTROLLERS PARA DASHBOARD EXECUTIVO ---
export async function getAtividadeRecente(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const limit = parseInt(req.query.limit) || 10
    const { getAtividadeRecente } = await import("../services/dashboardService.js")
    const data = await getAtividadeRecente(userId, limit)
    res.json(data)
  } catch (err) {
    console.error("Erro ao buscar atividade recente:", err)
    res.status(500).json({ error: "Erro ao carregar atividade recente" })
  }
}

export async function getMetricasProdutividade(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const { getMetricasProdutividade } = await import("../services/dashboardService.js")
    const data = await getMetricasProdutividade(userId)
    res.json(data)
  } catch (err) {
    console.error("Erro ao buscar métricas de produtividade:", err)
    res.status(500).json({ error: "Erro ao carregar métricas de produtividade" })
  }
}

export async function getDadosPorPeriodo(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const periodo = req.query.periodo || 'today'
    const { getDadosPorPeriodo } = await import("../services/dashboardService.js")
    const data = await getDadosPorPeriodo(userId, periodo)
    res.json(data)
  } catch (err) {
    console.error("Erro ao buscar dados por período:", err)
    res.status(500).json({ error: "Erro ao carregar dados por período" })
  }
}

export async function exportDados(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const formato = req.query.formato || 'json'
    const { exportDadosAluno } = await import("../services/dashboardService.js")
    const data = await exportDadosAluno(userId, formato)

    if (formato === 'json') {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Disposition', 'attachment; filename="dashboard-data.json"')
      res.json(data)
    } else {
      // Para outros formatos, pode implementar CSV, PDF, etc.
      res.json(data)
    }
  } catch (err) {
    console.error("Erro ao exportar dados:", err)
    res.status(500).json({ error: "Erro ao exportar dados" })
  }
}

// --- NOVOS CONTROLLERS PARA IA E GAMIFICAÇÃO ---
export async function getRecomendacoesIA(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const { getRecomendacoesIA } = await import("../services/dashboardService.js")
    const data = await getRecomendacoesIA(userId)
    res.json(data)
  } catch (err) {
    console.error("Erro ao buscar recomendações IA:", err)
    res.status(500).json({ error: "Erro ao carregar recomendações IA" })
  }
}

export async function getPrevisaoAprovacao(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const { getPrevisaoAprovacao } = await import("../services/dashboardService.js")
    const data = await getPrevisaoAprovacao(userId)
    res.json({ previsao: data })
  } catch (err) {
    console.error("Erro ao buscar previsão de aprovação:", err)
    res.status(500).json({ error: "Erro ao carregar previsão de aprovação" })
  }
}

export async function getStreaks(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const { getStreaks } = await import("../services/dashboardService.js")
    const data = await getStreaks(userId)
    res.json(data)
  } catch (err) {
    console.error("Erro ao buscar streaks:", err)
    res.status(500).json({ error: "Erro ao carregar streaks" })
  }
}

export async function getAgendaEstudo(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const { getAgendaEstudo } = await import("../services/dashboardService.js")
    const data = await getAgendaEstudo(userId)
    res.json(data)
  } catch (err) {
    console.error("Erro ao buscar agenda de estudo:", err)
    res.status(500).json({ error: "Erro ao carregar agenda de estudo" })
  }
}

export async function getAlertasFadiga(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const { getAlertasFadiga } = await import("../services/dashboardService.js")
    const data = await getAlertasFadiga(userId)
    res.json(data)
  } catch (err) {
    console.error("Erro ao buscar alertas de fadiga:", err)
    res.status(500).json({ error: "Erro ao carregar alertas de fadiga" })
  }
}

export async function getJornadaAprendizado(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const { getJornadaAprendizado } = await import("../services/dashboardService.js")
    const data = await getJornadaAprendizado(userId)
    res.json(data)
  } catch (err) {
    console.error("Erro ao buscar jornada de aprendizado:", err)
    res.status(500).json({ error: "Erro ao carregar jornada de aprendizado" })
  }
}

export async function getMapaForca(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const { getMapaForca } = await import("../services/dashboardService.js")
    const data = await getMapaForca(userId)
    res.json(data)
  } catch (err) {
    console.error("Erro ao buscar mapa de força:", err)
    res.status(500).json({ error: "Erro ao carregar mapa de força" })
  }
}

export async function getComparativoTurma(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const { getComparativoTurma } = await import("../services/dashboardService.js")
    const data = await getComparativoTurma(userId)
    res.json(data)
  } catch (err) {
    console.error("Erro ao buscar comparativo com turma:", err)
    res.status(500).json({ error: "Erro ao carregar comparativo com turma" })
  }
}

export async function getProgressoMetas(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" })
    }
    const { getProgressoMetas } = await import("../services/dashboardService.js")
    const data = await getProgressoMetas(userId)
    res.json(data)
  } catch (err) {
    console.error("Erro ao buscar progresso de metas:", err)
    res.status(500).json({ error: "Erro ao carregar progresso de metas" })
  }
}
