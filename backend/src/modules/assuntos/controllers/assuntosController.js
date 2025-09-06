import assuntosService from '../services/assuntosService.js';

class AssuntosController {
  async searchAssuntos(req, res) {
    try {
      const { search } = req.query;
      const assuntos = await assuntosService.searchAssuntos(search);
      res.json(assuntos);
    } catch (error) {
      console.error('Error searching assuntos:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createAssunto(req, res) {
    try {
      const { nome } = req.body;
      if (!nome || !nome.trim()) {
        return res.status(400).json({ error: 'Nome do assunto é obrigatório' });
      }
      const assunto = await assuntosService.createAssunto(nome.trim());
      res.status(201).json(assunto);
    } catch (error) {
      console.error('Error creating assunto:', error);
      if (error.message === 'Assunto já existe') {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllAssuntos(req, res) {
    try {
      const assuntos = await assuntosService.getAllAssuntos();
      res.json(assuntos);
    } catch (error) {
      console.error('Error getting assuntos:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new AssuntosController();