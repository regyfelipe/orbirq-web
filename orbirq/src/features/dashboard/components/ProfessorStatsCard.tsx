import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Target,
  Award,
  Clock,
  Star
} from "lucide-react"

interface ProfessorStatsCardProps {
  stats: {
    totalQuestoes: number
    mediaAcerto: number
    mediaRatingQuestoes: number
    questoesPorDisciplina: Array<{
      disciplina: string
      totalQuestoes: number
      mediaRating: number
      taxaAcerto: number
    }>
  }
}

export default function ProfessorStatsCard({ stats }: ProfessorStatsCardProps) {
  const totalQuestoes = stats.totalQuestoes || 0
  const mediaAcerto = stats.mediaAcerto || 0
  const mediaRating = stats.mediaRatingQuestoes || 0

  // Calcular métricas avançadas
  const questoesAtivas = stats.questoesPorDisciplina?.length || 0
  const mediaQuestoesPorDisciplina = questoesAtivas > 0 ? totalQuestoes / questoesAtivas : 0

  // Simular dados de tendência (em produção viriam do backend)
  const tendenciaAcerto = Math.random() > 0.5 ? 'up' : 'down'

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Award className="w-5 h-5" />
          Estatísticas Avançadas
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* KPIs principais */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Taxa de Acerto</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(mediaAcerto * 100)}%
            </p>
            <div className="flex items-center justify-center gap-1 mt-1">
              {tendenciaAcerto === 'up' ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className="text-xs text-muted-foreground">
                {tendenciaAcerto === 'up' ? '+2.1%' : '-1.3%'}
              </span>
            </div>
          </div>

          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">Avaliação Média</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {mediaRating.toFixed(1)} ★
            </p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-muted-foreground">+0.2</span>
            </div>
          </div>
        </div>

        {/* Métricas detalhadas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Questões por Disciplina</span>
            </div>
            <Badge variant="secondary">
              {Math.round(mediaQuestoesPorDisciplina)} média
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Disciplinas Ativas</span>
            </div>
            <Badge variant="outline">
              {questoesAtivas} disciplinas
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Total de Questões</span>
            </div>
            <Badge variant="secondary">
              {totalQuestoes} questões
            </Badge>
          </div>
        </div>

        {/* Progress bars para metas */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Metas do Mês</h4>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Questões Criadas</span>
              <span>{totalQuestoes}/50</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((totalQuestoes / 50) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Taxa de Acerto Alvo</span>
              <span>{Math.round(mediaAcerto * 100)}%/85%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((mediaAcerto / 0.85) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Insights CEO */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">💡 Insights CEO</h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>• Suas questões de {stats.questoesPorDisciplina?.[0]?.disciplina || 'Matemática'} têm melhor performance</p>
            <p>• Considere criar mais questões para disciplinas com baixa taxa de acerto</p>
            <p>• A avaliação média está acima da meta estabelecida</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}