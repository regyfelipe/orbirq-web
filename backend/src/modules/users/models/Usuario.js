export default class Usuario {
  constructor(row) {
    this.id = row.id;
    this.nomeCompleto = row.nome_completo;
    this.email = row.email;
    this.username = row.username;
    this.role = row.role;
    this.fotoPerfilUrl = row.foto_perfil_url;
    this.telefone = row.telefone;
    this.genero = row.genero;
    this.dataNascimento = row.data_nascimento;
    this.pais = row.pais;
    this.estado = row.estado;
    this.cidade = row.cidade;
    this.curso = row.curso;
    this.nivel = row.nivel;
    this.instituicao = row.instituicao;
    this.turma = row.turma;
    this.bio = row.bio;
    this.dataCriacao = row.data_criacao;
  }
}
