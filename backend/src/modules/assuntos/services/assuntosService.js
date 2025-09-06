let assuntos = [
  { id: '1', nome: 'Ciclo do Ouro' },
  { id: '2', nome: 'Funções' },
  { id: '3', nome: 'Equações' },
  { id: '4', nome: 'Geometria Plana' },
  { id: '5', nome: 'Gramática' },
  { id: '6', nome: 'Literatura Brasileira' },
  { id: '7', nome: 'Segunda Guerra Mundial' },
  { id: '8', nome: 'Revolução Industrial' },
];

class AssuntosService {
  async searchAssuntos(searchTerm) {
    if (!searchTerm || !searchTerm.trim()) {
      return assuntos.slice(0, 10);
    }

    // Normalizar caracteres para busca
    const normalizeString = (str) => {
      return str.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
    };

    const term = normalizeString(searchTerm);
    return assuntos.filter(assunto =>
      normalizeString(assunto.nome).includes(term)
    ).slice(0, 10);
  }

  async createAssunto(nome) {
    const existingAssunto = assuntos.find(a =>
      a.nome.toLowerCase() === nome.toLowerCase()
    );
    if (existingAssunto) {
      throw new Error('Assunto já existe');
    }
    const newAssunto = {
      id: Date.now().toString(),
      nome: nome
    };
    assuntos.push(newAssunto);
    return newAssunto;
  }

  async getAllAssuntos() {
    return assuntos;
  }

  async getAssuntoById(id) {
    return assuntos.find(a => a.id === id);
  }
}

export default new AssuntosService();