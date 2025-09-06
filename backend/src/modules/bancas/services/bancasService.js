// Mock data for bancas - in a real app, this would be a database
let bancas = [
  { id: '1', nome: 'CESPE' },
  { id: '2', nome: 'FCC' },
  { id: '3', nome: 'ENEM' },
  { id: '4', nome: 'UERJ' },
  { id: '5', nome: 'UNESP' },
  { id: '6', nome: 'FUVEST' },
  { id: '7', nome: 'PUC' },
  { id: '8', nome: 'UNICAMP' },
];

class BancasService {
  async searchBancas(searchTerm) {
    if (!searchTerm || !searchTerm.trim()) {
      return bancas.slice(0, 10); // Return first 10 if no search term
    }

    const term = searchTerm.toLowerCase().trim();
    return bancas.filter(banca =>
      banca.nome.toLowerCase().includes(term)
    ).slice(0, 10); // Limit results
  }

  async createBanca(nome) {
    // Check if banca already exists
    const existingBanca = bancas.find(b =>
      b.nome.toLowerCase() === nome.toLowerCase()
    );

    if (existingBanca) {
      throw new Error('Banca já existe');
    }

    const newBanca = {
      id: Date.now().toString(),
      nome: nome
    };

    bancas.push(newBanca);
    return newBanca;
  }

  async getAllBancas() {
    return bancas;
  }

  async getBancaById(id) {
    return bancas.find(b => b.id === id);
  }
}

export default new BancasService();