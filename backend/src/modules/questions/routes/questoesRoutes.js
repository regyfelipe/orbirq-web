import { Router } from 'express'
import { listarQuestoes, buscarQuestao } from '../controllers/questoesController.js'

const router = Router()

router.get('/', listarQuestoes)
router.get('/:id', buscarQuestao)

export default router
