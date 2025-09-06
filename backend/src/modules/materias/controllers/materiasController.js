import materiasService from '../services/materiasService.js';

class MateriasController {
  async searchMaterias(req, res) {
    try {
      const { search } = req.query;
      const materias = await materiasService.searchMaterias(search);
      res.json(materias);
    } catch (error) {
      console.error('Error searching materias:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createMateria(req, res) {
    try {
      const { nome } = req.body;

      if (!nome || !nome.trim()) {
        return res.status(400).json({ error: 'Nome da matéria é obrigatório' });
      }

      const materia = await materiasService.createMateria(nome.trim());
      res.status(201).json(materia);
    } catch (error) {
      console.error('Error creating materia:', error);
      if (error.message === 'Matéria já existe') {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllMaterias(req, res) {
    try {
      const materias = await materiasService.getAllMaterias();
      res.json(materias);
    } catch (error) {
      console.error('Error getting materias:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new MateriasController();