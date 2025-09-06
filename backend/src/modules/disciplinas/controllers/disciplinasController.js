import disciplinasService from '../services/disciplinasService.js';

class DisciplinasController {
  async searchDisciplinas(req, res) {
    try {
      const { search } = req.query;
      const disciplinas = await disciplinasService.searchDisciplinas(search);
      res.json(disciplinas);
    } catch (error) {
      console.error('Error searching disciplinas:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createDisciplina(req, res) {
    try {
      const { nome } = req.body;

      if (!nome || !nome.trim()) {
        return res.status(400).json({ error: 'Nome da disciplina é obrigatório' });
      }

      const disciplina = await disciplinasService.createDisciplina(nome.trim());
      res.status(201).json(disciplina);
    } catch (error) {
      console.error('Error creating disciplina:', error);
      if (error.message === 'Disciplina já existe') {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllDisciplinas(req, res) {
    try {
      const disciplinas = await disciplinasService.getAllDisciplinas();
      res.json(disciplinas);
    } catch (error) {
      console.error('Error getting disciplinas:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new DisciplinasController();