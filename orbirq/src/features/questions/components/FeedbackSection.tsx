import { useEffect, useState } from "react";
import FeedbackItem from "./FeedbackItem";
import { enviarFeedback, getFeedbacksQuestao, type Feedback } from "../services/feedbacks";

interface FeedbackSectionProps {
  questaoId: string;
  alunoId: string; // vem do auth
}

export default function FeedbackSection({ questaoId, alunoId }: FeedbackSectionProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questaoId]);

  const carregarFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFeedbacksQuestao(questaoId);
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar comentários. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeedback = async () => {
    if (!novoComentario.trim()) return;
    if (!alunoId) {
      setError("Você precisa estar logado para comentar.");
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const novo: Feedback = {
      id: tempId,
      aluno: "Você",
      comentario: novoComentario,
      respostas: [],
      criadoEm: new Date().toISOString(),
    };

    setFeedbacks((prev) => [...prev, novo]);
    setNovoComentario("");

    try {
      const salvo = await enviarFeedback({
        alunoId,
        questaoId,
        comentario: novoComentario,
        parentId: null,
      });

      setFeedbacks((prev) => prev.map((f) => (f.id === tempId ? salvo : f)));
    } catch (err) {
      console.error(err);
      setError("Erro ao enviar comentário.");
      setFeedbacks((prev) => prev.filter((f) => f.id !== tempId));
    }
  };

  const handleAddReply = async (feedbackId: string, texto: string) => {
    if (!texto.trim()) return;
    if (!alunoId) {
      setError("Você precisa estar logado para responder.");
      return;
    }

    const tempId = `temp-reply-${Date.now()}`;
    const respostaTemp: Feedback = {
      id: tempId,
      aluno: "Você",
      comentario: texto,
      criadoEm: new Date().toISOString(),
    };

    setFeedbacks((prev) =>
      prev.map((f) =>
        f.id === feedbackId
          ? { ...f, respostas: [...(f.respostas || []), respostaTemp] }
          : f
      )
    );

    try {
      const resposta = await enviarFeedback({
        alunoId,
        questaoId,
        comentario: texto,
        parentId: feedbackId,
      });

      setFeedbacks((prev) =>
        prev.map((f) =>
          f.id === feedbackId
            ? {
                ...f,
                respostas: f.respostas?.map((r) => (r.id === tempId ? resposta : r)),
              }
            : f
        )
      );
    } catch (err) {
      console.error(err);
      setError("Erro ao enviar resposta.");
      setFeedbacks((prev) =>
        prev.map((f) =>
          f.id === feedbackId
            ? { ...f, respostas: f.respostas?.filter((r) => r.id !== tempId) }
            : f
        )
      );
    }
  };

  return (
    <div className="space-y-5">
      {loading && <p className="text-sm text-gray-500">Carregando comentários...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {feedbacks.length === 0 && !loading ? (
        <p className="text-gray-500 text-sm">Ainda não há comentários nesta questão.</p>
      ) : (
        feedbacks.map((f) => (
          <FeedbackItem key={f.id} feedback={f} onReply={handleAddReply} />
        ))
      )}

      {/* Novo comentário */}
      <div className="space-y-2 border-t pt-4">
        <textarea
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          placeholder="Compartilhe seu comentário..."
          className="w-full border rounded-xl p-3 text-sm text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows={3}
        />
        <div className="flex justify-end">
          <button
            onClick={handleAddFeedback}
            className="px-4 py-2 bg-teal-800 text-white text-sm font-medium rounded-xl hover:bg-black transition disabled:opacity-50"
            disabled={loading || !novoComentario.trim()}
          >
            Comentar
          </button>
        </div>
      </div>
    </div>
  );
}
