import { Router } from 'express';
import {
  createQuestionController,
  getQuestionsController,
  getQuestionController,
  updateQuestionController,
  deleteQuestionController
} from '../controllers/questionsController.js';

const router = Router();

// Criar nova questão
router.post('/', createQuestionController);

// Buscar questões com filtros e paginação
router.get('/', getQuestionsController);

// Buscar questão específica
router.get('/:id', getQuestionController);

// Atualizar questão
router.put('/:id', updateQuestionController);

// Deletar questão
router.delete('/:id', deleteQuestionController);

export default router;