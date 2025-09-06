let instituicoes = [
  { id: '1', nome: 'ENEM' },
  { id: '2', nome: 'UERJ' },
  { id: '3', nome: 'UFRJ' },
  { id: '4', nome: 'UNESP' },
  { id: '5', nome: 'PUC' },
  { id: '6', nome: 'UNICAMP' },
  { id: '7', nome: 'USP' },
  { id: '8', nome: 'FUVEST' },
];

class InstituicoesService {
  async searchInstituicoes(searchTerm) {
    if (!searchTerm || !searchTerm.trim()) {
      return instituicoes.slice(0, 10);
    }

    // Normalizar caracteres para busca
    const normalizeString = (str) => {
      return str.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
    };

    const term = normalizeString(searchTerm);
    return instituicoes.filter(instituicao =>
      normalizeString(instituicao.nome).includes(term)
    ).slice(0, 10);
  }

  async createInstituicao(nome) {
    const existingInstituicao = instituicoes.find(i =>
      i.nome.toLowerCase() === nome.toLowerCase()
    );
    if (existingInstituicao) {
      throw new Error('Instituição já existe');
    }
    const newInstituicao = {
      id: Date.now().toString(),
      nome: nome
    };
    instituicoes.push(newInstituicao);
    return newInstituicao;
  }

  async getAllInstituicoes() {
    return instituicoes;
  }

  async getInstituicaoById(id) {
    return instituicoes.find(i => i.id === id);
  }
}

export default new InstituicoesService();