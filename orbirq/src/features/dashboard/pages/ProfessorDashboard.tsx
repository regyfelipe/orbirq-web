import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import QuestaoPieChart from "../components/QuestaoPieChart"
import DesempenhoLineChart from "../components/DesempenhoLineChart"
import TurmaCard from "../components/TurmaCard"
import AlunosListCard from "../components/AlunosListCard"
import ProfessorStatsCard from "../components/ProfessorStatsCard"
import { getProfessorDashboard, getProfessorAlunosStats, type ProfessorDashboardData, type AlunoStats } from "../services/dashboardService"

import {
  UserPlus,
  Users,
  Crown,
  Plus,

  TrendingUp,
  Award
} from "lucide-react"


export default function ProfessorDashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState<ProfessorDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getProfessorDashboard()
        setData({
          ...res,
          questoesPorDisciplina: res.questoesPorDisciplina ?? [],
        })

        // Buscar alunos que aceitaram convites
        await loadAcceptedStudents()
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao carregar dashboard")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const loadAcceptedStudents = async () => {
    try {
      // Primeiro tentar a API de estatísticas (dados reais)
      try {
        const alunosStats = await getProfessorAlunosStats()

        if (alunosStats && Array.isArray(alunosStats) && alunosStats.length > 0) {
          // Formatar dados dos alunos para o formato esperado
          const formattedStudents = alunosStats.map((aluno: AlunoStats) => ({
            id: aluno.id,
            nome: aluno.nome,
            email: aluno.email,
            questoesRespondidas: aluno.questoesRespondidas,
            taxaAcerto: aluno.taxaAcerto,
            ultimaAtividade: aluno.ultimaAtividade,
            nivel: aluno.nivel,
            turma: aluno.turma || "Convite Aceito",
            fonte: aluno.fonte
          }))

          setAlunosAceitaramConvites(formattedStudents)
          return
        }
      } catch (statsError) {
        console.warn('API de estatísticas não disponível, tentando API de convites:', statsError)
      }

      // Fallback: usar API de convites (dados básicos)
      const usuario = JSON.parse(localStorage.getItem("usuario") || "null")

      if (usuario && usuario.role === 'professor') {
        const response = await fetch(`http://localhost:3000/invites/professor/${usuario.id}/students`, {
          headers: {
            'Content-Type': 'application/json',
            // Adicionar token se disponível
            ...(localStorage.getItem('token') && {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            })
          }
        })
        const students = await response.json()

        if (response.ok && students && Array.isArray(students)) {
          // Formatar dados dos alunos para o formato esperado
          const formattedStudents = students.map((student: { id: string; nome: string; email: string; data_aceite: string }) => ({
            id: student.id,
            nome: student.nome,
            email: student.email,
            questoesRespondidas: Math.floor(Math.random() * 10) + 1, // Dados simulados para demonstração
            taxaAcerto: Math.random() * 0.5 + 0.3, // Entre 30% e 80%
            ultimaAtividade: new Date(student.data_aceite).toLocaleDateString('pt-BR'),
            nivel: Math.floor(Math.random() * 3) + 1, // Nível 1-3
            turma: "Convite Aceito",
            fonte: "Convite aceito"
          }))

          setAlunosAceitaramConvites(formattedStudents)
        } else {
          setAlunosAceitaramConvites([])
        }
      } else {
        setAlunosAceitaramConvites([])
      }
    } catch (error) {
      console.error('Erro ao buscar alunos aceitos:', error)
      // Em caso de erro, manter dados vazios
      setAlunosAceitaramConvites([])
    }
  }

  

  // Dados mock para os novos componentes
  const mockTurmas = [
    {
      id: "1",
      nome: "Matemática Básica",
      disciplina: "Matemática",
      alunosCount: 25,
      questoesCount: 45,
      mediaAcerto: 0.75
    },
   
  ]

  // Estado para alunos que aceitaram convites
  const [alunosAceitaramConvites, setAlunosAceitaramConvites] = useState<AlunoStats[]>([])

  const mockAlunos = [
    
    ...alunosAceitaramConvites
  ]

  if (loading) return <div className="p-6">Carregando...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!data) return null

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Ações Rápidas - CEO */}
      <Card className="rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate('/dashboard/professor/invites')}
              className="h-auto p-4 flex flex-col items-center gap-2 bg-white hover:bg-primary/5 border-2 border-primary/20 hover:border-primary/40"
              variant="outline"
            >
              <UserPlus className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Convidar Alunos</span>
              <span className="text-xs text-muted-foreground">Gerenciar convites</span>
            </Button>

            <Button
              onClick={() => navigate('/turmas')}
              className="h-auto p-4 flex flex-col items-center gap-2 bg-white hover:bg-primary/5 border-2 border-primary/20 hover:border-primary/40"
              variant="outline"
            >
              <Users className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Gerenciar Turmas</span>
              <span className="text-xs text-muted-foreground">Adicionar alunos</span>
            </Button>

            <Button
              onClick={() => navigate('/questoes/nova')}
              className="h-auto p-4 flex flex-col items-center gap-2 bg-white hover:bg-primary/5 border-2 border-primary/20 hover:border-primary/40"
              variant="outline"
            >
              <Plus className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Criar Questão</span>
              <span className="text-xs text-muted-foreground">Nova atividade</span>
            </Button>

            <Button
              onClick={() => navigate('/relatorios')}
              className="h-auto p-4 flex flex-col items-center gap-2 bg-white hover:bg-primary/5 border-2 border-primary/20 hover:border-primary/40"
              variant="outline"
            >
              <TrendingUp className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Ver Relatórios</span>
              <span className="text-xs text-muted-foreground">Análise de dados</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total de Questões */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Questões criadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.totalQuestoes ?? 0}</p>
          </CardContent>
        </Card>

        {/* Média de Acerto */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Taxa de acerto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {data.mediaAcerto ? Math.round(data.mediaAcerto * 100) : 0}%
            </p>
          </CardContent>
        </Card>

        {/* Média de Avaliação (Rating) */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Avaliação média</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {data.mediaRating ? data.mediaRating.toFixed(1) : "0.0"} ★
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Evolução do desempenho */}
      {/* <DesempenhoLineChart data={data.questoesPorDisciplina} /> */}

      {/* Questões por disciplina */}
      {/* <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Questões por Disciplina</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(!data.questoesPorDisciplina || data.questoesPorDisciplina.length === 0) && (
            <p className="text-sm text-muted-foreground">
              Nenhuma questão cadastrada ainda.
            </p>
          )}

          <div className="divide-y">
            {data.questoesPorDisciplina?.map((q, i) => (
              <div key={i} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium truncate">{q.disciplina}</p>
                  <p className="text-xs text-muted-foreground">
                    Total: {q.totalQuestoes} | Rating: {q.mediaRating?.toFixed(1) ?? "0.0"} ★ | Acerto:{" "}
                    {q.taxaAcerto ? Math.round(q.taxaAcerto * 100) : 0}%
                  </p>
                </div>
                <Badge variant="secondary">{q.totalQuestoes} questões</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Questões por disciplina (Pie Chart separado) */}
      {/* <QuestaoPieChart data={data.questoesPorDisciplina} /> */}

      {/* Meus Alunos - Seção CEO */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Meus Alunos
            </CardTitle>
            <Button
              onClick={() => navigate('/dashboard/professor/invites')}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Convidar Aluno
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mensagem explicativa sobre dados simulados */}
          {alunosAceitaramConvites.some(aluno => aluno.fonte === "Convite aceito") && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-700">
                <span className="font-medium">ℹ️ Dados simulados:</span> Alguns alunos ainda não possuem estatísticas reais.
                Os valores mostrados são estimativas baseadas em convites aceitos.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <p className="text-2xl font-bold text-primary">{mockAlunos.length}</p>
              <p className="text-sm text-muted-foreground">Total de Alunos</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {alunosAceitaramConvites.length}
              </p>
              <p className="text-sm text-muted-foreground">Via Convites</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {mockAlunos.filter(a => a.taxaAcerto >= 0.8).length}
              </p>
              <p className="text-sm text-muted-foreground">Alto Desempenho (≥80%)</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {mockAlunos.filter(a => a.taxaAcerto < 0.6).length}
              </p>
              <p className="text-sm text-muted-foreground">Precisam de Atenção (abaixo de 60%)</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Alunos Recentes</h4>
            {mockAlunos.slice(0, 5).map((aluno) => (
              <div key={aluno.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center relative">
                    <span className="text-sm font-medium text-primary">
                      {aluno.nome.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </span>
                    {'fonte' in aluno && aluno.fonte === "Convite aceito" && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <UserPlus className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{aluno.nome}</p>
                      {'fonte' in aluno && aluno.fonte === "Convite aceito" && (
                        <Badge variant="outline" className="text-xs border-blue-200 text-blue-600">
                          Via Convite
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {aluno.questoesRespondidas} questões • {Math.round(aluno.taxaAcerto * 100)}% acerto
                      {aluno.fonte === "Convite aceito" && (
                        <span className="text-xs text-blue-500 ml-1">(simulado)</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={aluno.taxaAcerto >= 0.8 ? "default" : aluno.taxaAcerto >= 0.6 ? "secondary" : "destructive"}>
                    {aluno.taxaAcerto >= 0.8 ? "Excelente" : aluno.taxaAcerto >= 0.6 ? "Bom" : "Atenção"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Ver Perfil
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Novos cards CEO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <TurmaCard turmas={mockTurmas} />
        <AlunosListCard alunos={mockAlunos} />
      </div>

      {/* Card de estatísticas avançadas CEO */}
      <ProfessorStatsCard stats={{
        ...data,
        mediaRatingQuestoes: data.mediaRating || 0
      }} />
    </div>
  )
}
