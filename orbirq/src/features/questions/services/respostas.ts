const API_URL = "http://localhost:3000"

export interface NovaResposta {
  alunoId: string
  questaoId: string
  opcaoEscolhida: string
  correta: boolean
  tempoRespostaSegundos: number
  tentativa?: number
}

export async function responderQuestao(data: NovaResposta) {
  const res = await fetch(`${API_URL}/respostas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Erro ao responder questão")
  return res.json()
}

export async function getRespostasAluno(alunoId: string) {
  const res = await fetch(`${API_URL}/respostas/aluno/${alunoId}`)
  if (!res.ok) throw new Error("Erro ao buscar respostas do aluno")
  return res.json()
}

export async function verificarRespostaAnterior(alunoId: string, questaoId: string) {
  const res = await fetch(`${API_URL}/respostas/verificar/${alunoId}/${questaoId}`)
  if (!res.ok) {
    // Se a rota não existir ainda, retorna null
    if (res.status === 404) return null
    throw new Error("Erro ao verificar resposta anterior")
  }
  return res.json()
}

export async function resetarRespostasQuestoes(alunoId: string, questoesIds: string[]) {
  const res = await fetch(`${API_URL}/respostas/reset-questoes`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ alunoId, questoesIds }),
  })
  if (!res.ok) throw new Error("Erro ao resetar respostas das questões")
  return res.json()
}
