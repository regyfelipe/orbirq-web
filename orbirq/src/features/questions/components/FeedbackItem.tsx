import FeedbackReplyForm from "./FeedbackReplyForm"
import { useState } from "react"
import { MessageSquare } from "lucide-react"
import type { Feedback } from "./FeedbackSection"

interface FeedbackItemProps {
  feedback: Feedback
  onReply: (feedbackId: string, texto: string) => void
}

export default function FeedbackItem({ feedback, onReply }: FeedbackItemProps) {
  const [mostrarResposta, setMostrarResposta] = useState(false)

  return (
    <div className="border rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition-all space-y-3">
      <p className="text-sm text-gray-800">
        <span className="font-medium text-gray-900">{feedback.aluno}</span>
        <span className="text-gray-600"> — {feedback.comentario}</span>
      </p>

      {/* Botão responder minimalista */}
      <button
        onClick={() => setMostrarResposta(!mostrarResposta)}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-teal-800 transition"
      >
        <MessageSquare size={14} />
        {mostrarResposta ? "Cancelar" : "Responder"}
      </button>

      {/* Formulário de resposta */}
      {mostrarResposta && (
        <FeedbackReplyForm
          onSubmit={(texto) => {
            onReply(feedback.id, texto)
            setMostrarResposta(false)
          }}
        />
      )}

      {/* Respostas */}
      {feedback.respostas && feedback.respostas.length > 0 && (
        <div className="ml-6 mt-3 space-y-2 border-l pl-3">
          {feedback.respostas.map(r => (
            <div key={r.id} className="p-2 rounded-xl bg-gray-50 text-sm">
              <span className="font-medium text-gray-900">{r.aluno}:</span>{" "}
              <span className="text-gray-600">{r.comentario}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
