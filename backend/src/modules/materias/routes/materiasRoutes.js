import express from 'express';
import materiasController from '../controllers/materiasController.js';

const router = express.Router();

router.get('/materias', materiasController.searchMaterias);
router.post('/materias', materiasController.createMateria);
router.get('/materias/all', materiasController.getAllMaterias);

export default router;