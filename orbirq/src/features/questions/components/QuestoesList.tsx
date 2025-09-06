import { useEffect, useState } from "react"
import { getQuestoes } from "../services/questoes"
import type { Questao } from "../services/questoes"
import QuestaoCard from "./QuestaoCard"
import QuestionControls from "./QuestionControls"
import { Button } from "../../../shared/components/ui/button"
import Header from "../../../shared/components/Header"
import { useAuth } from "../../auth/services/AuthContext"
import { resetarRespostasQuestoes } from "../services/respostas"

export default function QuestoesList() {
  const [questoes, setQuestoes] = useState<Questao[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [resetTrigger, setResetTrigger] = useState(0)
  const { usuario } = useAuth()

  useEffect(() => {
    setLoading(true)
    getQuestoes(page, 10)
      .then((res) => {
        setQuestoes(res.data)
        setTotalPages(res.totalPages)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page, resetTrigger])

  // Função para resetar todas as questões da página atual
  const handleResetAll = async () => {
    if (!usuario?.id) return

    try {
      // Obter IDs das questões da página atual
      const questoesIds = questoes.map(q => q.id)

      // Resetar respostas no backend
      await resetarRespostasQuestoes(usuario.id, questoesIds)

      // Resetar estado local
      setForceShowControls(false)

      // Forçar reload das questões (isso fará com que o useEffect rode novamente)
      setResetTrigger(prev => prev + 1)
    } catch (error) {
      console.error('Erro ao resetar questões:', error)
      throw error
    }
  }

  // Estado simplificado - assumimos que pode haver questões respondidas
  const [forceShowControls, setForceShowControls] = useState(false)

  // Função para marcar questão como respondida
  const markQuestionAsAnswered = () => {
    setForceShowControls(true)
  }

  // Para debug - sempre mostrar controles por enquanto
  const answeredCount = forceShowControls ? 1 : 0
  const hasAnsweredQuestions = forceShowControls || answeredCount > 0

  // Debug logs removidos para produção

  if (loading) return <p>Carregando...</p>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo no topo */}
      <Header />

      {/* Controles de Questão */}
      <QuestionControls
        onResetAll={handleResetAll}
        hasAnsweredQuestions={hasAnsweredQuestions}
        answeredCount={answeredCount}
        totalCount={questoes.length}
      />

      <main className="p-6 space-y-6">
        {questoes.map((q) => (
          <QuestaoCard
            key={`${q.id}-${resetTrigger}`}
            questao={q}
            onQuestionAnswered={markQuestionAsAnswered}
            forceReset={resetTrigger}
          />
        ))}

        {/* Paginação */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span>
            Página {page} de {totalPages}
          </span>
          <Button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Próxima
          </Button>
        </div>
      </main>
    </div>
  )
}
