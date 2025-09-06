import express from 'express';
import disciplinasController from '../controllers/disciplinasController.js';

const router = express.Router();

// GET /api/disciplinas?search=term
router.get('/disciplinas', disciplinasController.searchDisciplinas);

// POST /api/disciplinas
router.post('/disciplinas', disciplinasController.createDisciplina);

// GET /api/disciplinas/all
router.get('/disciplinas/all', disciplinasController.getAllDisciplinas);

export default router;