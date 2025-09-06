import { Router } from "express"
import {
  criarTurmaController,
  listarTurmasController,
  obterTurmaController,
  listarTurmasProfessorController,
  atualizarTurmaController,
  excluirTurmaController,
  adicionarAlunoController,
  removerAlunoController,
  listarAlunosController,
  obterEstatisticasController
} from "../controllers/turmasController.js"

const router = Router()

// Rotas para turmas
router.post("/", criarTurmaController)
router.get("/", listarTurmasController)
router.get("/professor", listarTurmasProfessorController)
router.get("/:id", obterTurmaController)
router.put("/:id", atualizarTurmaController)
router.delete("/:id", excluirTurmaController)

// Rotas para alunos em turmas
router.post("/:turmaId/alunos", adicionarAlunoController)
router.delete("/:turmaId/alunos/:alunoId", removerAlunoController)
router.get("/:turmaId/alunos", listarAlunosController)

// Rota para estatísticas
router.get("/:id/estatisticas", obterEstatisticasController)

export default router