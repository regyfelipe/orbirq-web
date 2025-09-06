// Mock data for materias - in a real app, this would be a database
let materias = [
  { id: '1', nome: 'Álgebra' },
  { id: '2', nome: 'Literatura' },
  { id: '3', nome: 'Gramática' },
  { id: '4', nome: 'Ciclo do Ouro' },
  { id: '5', nome: 'Funções' },
  { id: '6', nome: 'Geometria' },
  { id: '7', nome: 'Redação' },
  { id: '8', nome: 'Poemas' },
];

class MateriasService {
  async searchMaterias(searchTerm) {
    if (!searchTerm || !searchTerm.trim()) {
      return materias.slice(0, 10);
    }

    // Normalizar caracteres para busca
    const normalizeString = (str) => {
      return str.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
    };

    const term = normalizeString(searchTerm);
    return materias.filter(materia =>
      normalizeString(materia.nome).includes(term)
    ).slice(0, 10);
  }

  async createMateria(nome) {
    const existingMateria = materias.find(m =>
      m.nome.toLowerCase() === nome.toLowerCase()
    );

    if (existingMateria) {
      throw new Error('Matéria já existe');
    }

    const newMateria = {
      id: Date.now().toString(),
      nome: nome
    };

    materias.push(newMateria);
    return newMateria;
  }

  async getAllMaterias() {
    return materias;
  }

  async getMateriaById(id) {
    return materias.find(m => m.id === id);
  }
}

export default new MateriasService();