const API_URL = "http://localhost:3000";

export interface NovoFeedback {
  alunoId: string;
  questaoId: string;
  comentario: string;
  rating?: number;
  parentId?: string | null;
}

export interface Feedback {
  id: string;
  aluno: string;            // nome/identificação exibida
  comentario: string;
  rating?: number;
  criadoEm: string;
  respostas?: Feedback[];
}

export async function enviarFeedback(data: NovoFeedback) {
  const res = await fetch(`${API_URL}/feedbacks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao enviar feedback");
  return res.json();
}

export async function getFeedbacksQuestao(questaoId: string): Promise<Feedback[]> {
  const res = await fetch(`${API_URL}/feedbacks/questao/${questaoId}`);
  if (!res.ok) throw new Error("Erro ao buscar feedbacks");
  return res.json();
}
