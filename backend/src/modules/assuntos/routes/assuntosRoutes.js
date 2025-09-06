import express from 'express';
import assuntosController from '../controllers/assuntosController.js';

const router = express.Router();

router.get('/assuntos', assuntosController.searchAssuntos);
router.post('/assuntos', assuntosController.createAssunto);
router.get('/assuntos/all', assuntosController.getAllAssuntos);

export default router;