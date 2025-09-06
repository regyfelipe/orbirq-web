export {
  createInvite,
  getInviteByToken,
  updateInviteStatus,
  getInvitesByProfessor,
  getAcceptedStudentsByProfessor
} from './services/invitesService.js';

export {
  createInviteController,
  getInviteController,
  acceptInviteController,
  getProfessorInvitesController,
  getAcceptedStudentsController
} from './controllers/invitesController.js';

export { default as invitesRoutes } from './routes/invitesRoutes.js';