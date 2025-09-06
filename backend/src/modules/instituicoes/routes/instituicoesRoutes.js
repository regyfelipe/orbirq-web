import express from 'express';
import instituicoesController from '../controllers/instituicoesController.js';

const router = express.Router();

router.get('/instituicoes', instituicoesController.searchInstituicoes);
router.post('/instituicoes', instituicoesController.createInstituicao);
router.get('/instituicoes/all', instituicoesController.getAllInstituicoes);

export default router;