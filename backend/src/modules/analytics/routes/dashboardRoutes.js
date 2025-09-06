import { Router } from "express"
import {
  adminDashboard,
  professorDashboard,
  alunoDashboard,
  getAlunoConquistas,
  getAlunoMetas,
  getAlunoInsights,
  getAlunoNotificacoes,
  getProfessorAlunosStats,
  getAtividadeRecente,
  getMetricasProdutividade,
  getDadosPorPeriodo,
  exportDados,
  getProgressoMetas,
  getRecomendacoesIA,
  getPrevisaoAprovacao,
  getStreaks,
  getAgendaEstudo,
  getAlertasFadiga,
  getJornadaAprendizado,
  getMapaForca,
  getComparativoTurma,
} from "../controllers/dashboardController.js"
import { authMiddleware } from "../../auth/middlewares/authMiddleware.js"

const router = Router()

router.get("/admin", authMiddleware, adminDashboard)
router.get("/professor", authMiddleware, professorDashboard)
router.get("/aluno", authMiddleware, alunoDashboard)

// --- NOVAS ROTAS PARA DADOS REAIS ---
router.get("/aluno/conquistas", authMiddleware, getAlunoConquistas)
router.get("/aluno/metas", authMiddleware, getAlunoMetas)
router.get("/aluno/insights", authMiddleware, getAlunoInsights)
router.get("/aluno/notificacoes", authMiddleware, getAlunoNotificacoes)

// --- ROTA PARA ALUNOS DO PROFESSOR ---
router.get("/professor/alunos", authMiddleware, getProfessorAlunosStats)

// --- NOVAS ROTAS PARA DASHBOARD EXECUTIVO ---
router.get("/aluno/atividade", authMiddleware, getAtividadeRecente)
router.get("/aluno/produtividade", authMiddleware, getMetricasProdutividade)
router.get("/aluno/periodo", authMiddleware, getDadosPorPeriodo)
router.get("/aluno/export", authMiddleware, exportDados)
router.get("/aluno/progresso-metas", authMiddleware, getProgressoMetas)

// --- NOVAS ROTAS PARA IA E GAMIFICAÇÃO ---
router.get("/aluno/recomendacoes-ia", authMiddleware, getRecomendacoesIA)
router.get("/aluno/previsao-aprovacao", authMiddleware, getPrevisaoAprovacao)
router.get("/aluno/streaks", authMiddleware, getStreaks)
router.get("/aluno/agenda-estudo", authMiddleware, getAgendaEstudo)
router.get("/aluno/alertas-fadiga", authMiddleware, getAlertasFadiga)
router.get("/aluno/jornada-aprendizado", authMiddleware, getJornadaAprendizado)
router.get("/aluno/mapa-forca", authMiddleware, getMapaForca)
router.get("/aluno/comparativo-turma", authMiddleware, getComparativoTurma)

export default router
