import express from 'express';
import bancasController from '../controllers/bancasController.js';

const router = express.Router();

// GET /api/bancas?search=term
router.get('/bancas', bancasController.searchBancas);

// POST /api/bancas
router.post('/bancas', bancasController.createBanca);

// GET /api/bancas/all
router.get('/bancas/all', bancasController.getAllBancas);

export default router;