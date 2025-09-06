// Mock data for disciplinas - in a real app, this would be a database
let disciplinas = [
  { id: '1', nome: 'Matemática' },
  { id: '2', nome: 'Português' },
  { id: '3', nome: 'História' },
  { id: '4', nome: 'Geografia' },
  { id: '5', nome: 'Ciências' },
  { id: '6', nome: 'Inglês' },
  { id: '7', nome: 'Física' },
  { id: '8', nome: 'Química' },
  { id: '9', nome: 'Biologia' },
  { id: '10', nome: 'Filosofia' },
  { id: '11', nome: 'Sociologia' },
  { id: '12', nome: 'Artes' },
];

class DisciplinasService {
  async searchDisciplinas(searchTerm) {
    if (!searchTerm || !searchTerm.trim()) {
      return disciplinas.slice(0, 10); // Return first 10 if no search term
    }

    // Normalizar caracteres para busca
    const normalizeString = (str) => {
      return str.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
    };

    const term = normalizeString(searchTerm);
    return disciplinas.filter(disciplina =>
      normalizeString(disciplina.nome).includes(term)
    ).slice(0, 10); // Limit results
  }

  async createDisciplina(nome) {
    // Check if disciplina already exists
    const existingDisciplina = disciplinas.find(d =>
      d.nome.toLowerCase() === nome.toLowerCase()
    );

    if (existingDisciplina) {
      throw new Error('Disciplina já existe');
    }

    const newDisciplina = {
      id: Date.now().toString(),
      nome: nome
    };

    disciplinas.push(newDisciplina);
    return newDisciplina;
  }

  async getAllDisciplinas() {
    return disciplinas;
  }

  async getDisciplinaById(id) {
    return disciplinas.find(d => d.id === id);
  }
}

export default new DisciplinasService();