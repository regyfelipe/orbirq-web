import { Router } from "express"
import * as respostasController from "../controllers/respostasController.js"

const router = Router()

router.post("/", respostasController.responder)
router.get("/aluno/:alunoId", respostasController.listarRespostasAluno)
router.get("/verificar/:alunoId/:questaoId", respostasController.verificarResposta)
router.delete("/conquistas/:alunoId", respostasController.resetarConquistas)
router.delete("/reset-questoes", respostasController.resetarRespostasQuestoes)

export default router
