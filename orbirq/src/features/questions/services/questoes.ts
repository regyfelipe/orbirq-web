export interface Questao {
  id: string
  status: string
  versao: number
  titulo: string
  texto: string
  pergunta: string
  disciplina: string
  materia: string
  assunto: string
  banca: string
  ano: number
  instituicao: string
  inedita: boolean
  tipo: "multipla_escolha" | "verdadeiro_falso" | string
  opcoes: { id: string; texto: string }[]
  resposta_correta: string
  objetivos_aprendizagem: string[]
  explicacao: string
  referencias: string[]
  links_videos: string[]
  nivel_dificuldade: string
  tags: string[]
  palavras_chave: string[]
  imagem_url?: string
  descricao_imagem?: string
  visibilidade: string
  plano_disponibilidade: string[]
  autoria: {
    principal: string
    revisores: string[]
  }
  data_criacao: string
  ultima_atualizacao: string
  estatisticas: {
    vezesRespondida: number
    taxaAcerto: number
    tempoMedioRespostaSegundos: number
    rating: number
    feedbackAlunos: any[]
    taxaErroPorOpcao: {}
  }
  licenca_uso: string
  custo_criacao: number
  schema_version: number
  monetizacao: {
    modelo: string
    valor_por_acesso: number
  }
  protecao: {
    hash: null
    assinatura_digital: null
  }
  gamificacao: {
    xp: number
    medalha: null
  }
  ia: {
    gerado_por: string
    dicas: any[]
  }
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getQuestao(id: string): Promise<Questao> {
  const res = await fetch(`${API_URL}/questions/${id}`)
  if (!res.ok) throw new Error("Erro ao buscar questão")
  return res.json()
}

export async function getQuestoes(page = 1, limit = 10): Promise<{
  data: Questao[]
  total: number
  page: number
  totalPages: number
}> {
  const res = await fetch(`${API_URL}/questions?page=${page}&limit=${limit}`)
  if (!res.ok) throw new Error("Erro ao listar questões")
  return res.json()
}
