import bancasService from '../services/bancasService.js';

class BancasController {
  async searchBancas(req, res) {
    try {
      const { search } = req.query;
      const bancas = await bancasService.searchBancas(search);
      res.json(bancas);
    } catch (error) {
      console.error('Error searching bancas:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createBanca(req, res) {
    try {
      const { nome } = req.body;

      if (!nome || !nome.trim()) {
        return res.status(400).json({ error: 'Nome da banca é obrigatório' });
      }

      const banca = await bancasService.createBanca(nome.trim());
      res.status(201).json(banca);
    } catch (error) {
      console.error('Error creating banca:', error);
      if (error.message === 'Banca já existe') {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllBancas(req, res) {
    try {
      const bancas = await bancasService.getAllBancas();
      res.json(bancas);
    } catch (error) {
      console.error('Error getting bancas:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new BancasController();