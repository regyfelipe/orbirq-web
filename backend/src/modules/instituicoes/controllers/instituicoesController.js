import instituicoesService from '../services/instituicoesService.js';

class InstituicoesController {
  async searchInstituicoes(req, res) {
    try {
      const { search } = req.query;
      const instituicoes = await instituicoesService.searchInstituicoes(search);
      res.json(instituicoes);
    } catch (error) {
      console.error('Error searching instituicoes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createInstituicao(req, res) {
    try {
      const { nome } = req.body;
      if (!nome || !nome.trim()) {
        return res.status(400).json({ error: 'Nome da instituição é obrigatório' });
      }
      const instituicao = await instituicoesService.createInstituicao(nome.trim());
      res.status(201).json(instituicao);
    } catch (error) {
      console.error('Error creating instituicao:', error);
      if (error.message === 'Instituição já existe') {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllInstituicoes(req, res) {
    try {
      const instituicoes = await instituicoesService.getAllInstituicoes();
      res.json(instituicoes);
    } catch (error) {
      console.error('Error getting instituicoes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new InstituicoesController();