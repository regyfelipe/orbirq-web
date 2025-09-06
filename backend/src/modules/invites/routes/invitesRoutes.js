import { Router } from 'express';
import {
  createInviteController,
  getInviteController,
  acceptInviteController,
  getProfessorInvitesController,
  getAcceptedStudentsController
} from '../controllers/invitesController.js';

const router = Router();

// Criar convite
router.post('/', createInviteController);

// Buscar convite por token
router.get('/:token', getInviteController);

// Aceitar convite
router.post('/:token/accept', acceptInviteController);

// Buscar convites de um professor
router.get('/professor/:professorId', getProfessorInvitesController);

// Buscar alunos que aceitaram convites de um professor
router.get('/professor/:professorId/students', getAcceptedStudentsController);

export default router;