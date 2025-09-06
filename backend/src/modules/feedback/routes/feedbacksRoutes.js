import { Router } from "express"
import * as feedbacksController from "../controllers/feedbacksController.js"

const router = Router()

router.post("/", feedbacksController.enviar)
router.get("/questao/:questaoId", feedbacksController.listarPorQuestao)

export default router
