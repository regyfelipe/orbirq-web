import { useState } from "react"

interface FeedbackReplyFormProps {
  onSubmit: (texto: string) => void
}

export default function FeedbackReplyForm({ onSubmit }: FeedbackReplyFormProps) {
  const [texto, setTexto] = useState("")

  const handleSubmit = () => {
    if (!texto.trim()) return
    onSubmit(texto)
    setTexto("")
  }

  return (
    <div className="mt-3 space-y-2">
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escreva sua resposta..."
        className="w-full border rounded-xl p-2 text-sm text-gray-700 bg-gray-50 focus:ring-2 focus:bg-teal-800 focus:outline-none"
        rows={2}
      />
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-3 py-1.5 text-sm font-medium text-white bg-teal-800 rounded-xl hover:bg-teal-800 transition"
        >
          Responder
        </button>
      </div>
    </div>
  )
}
