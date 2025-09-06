export default class Questao {
  constructor(row) {
    this.id = row.id
    this.status = row.status
    this.versao = row.versao

    this.metadata = {
      disciplina: row.disciplina,
      materia: row.materia,
      assunto: row.assunto,
      banca: row.banca,
      ano: row.ano,
      instituicao: row.instituicao,
      inedita: row.inedita,
      autoria: row.autoria,
      dataCriacao: row.data_criacao,
      ultimaAtualizacao: row.ultima_atualizacao,
    }

    this.conteudo = {
      texto: row.texto,
      imagemUrl: row.imagem_url,
      pergunta: row.pergunta,
      tipo: row.tipo,
      opcoes: row.opcoes,
      respostaCorreta: row.resposta_correta,
      objetivosAprendizagem: row.objetivos_aprendizagem,
    }

    this.suporte = {
      explicacao: row.explicacao,
      referencias: row.referencias,
      linksVideos: row.links_videos,
    }

    this.analytics = {
      nivelDificuldade: row.nivel_dificuldade,
      tags: row.tags,
      palavrasChave: row.palavras_chave,
      estatisticas: row.estatisticas,
    }

    this.gestao = {
      licencaUso: row.licenca_uso,
      planoDisponibilidade: row.plano_disponibilidade,
      custoCriacao: row.custo_criacao,
    }
  }
}
