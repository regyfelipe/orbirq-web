import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../../../shared/components/ui/card"
import { Badge } from "../../../shared/components/ui/badge"
import { Users, FileText, Activity } from "lucide-react"
import { getAdminDashboard, type AdminDashboardData } from "../services/dashboardService"
import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getAdminDashboard()
        setData(res)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao carregar dashboard")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="p-6">Carregando...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!data) return null

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Total de Usuários</CardTitle>
            <Users size={18} />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.totals.usuarios}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Questões</CardTitle>
            <FileText size={18} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.questoes.total}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">Inéditas: {data.questoes.ineditas}</Badge>
              <Badge variant="outline">Banco: {data.questoes.bancoProvas}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Taxa de Engajamento</CardTitle>
            <Activity size={18} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(data.engajamento.taxaEngajamento * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crescimento de alunos */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Crescimento de Alunos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={data.crescimentoAlunos}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" radius={[8, 8, 0, 0]} fill="hsl(var(--primary))" />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Rankings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Professores mais ativos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.rankingProfessores.length === 0 && (
              <p className="text-sm text-muted-foreground">Sem dados suficientes</p>
            )}
            {data.rankingProfessores.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="truncate">{p.autor}</span>
                <Badge variant="secondary">{p.total} questões</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Questões mais bem avaliadas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.questoesMaisBemAvaliadas.length === 0 && (
              <p className="text-sm text-muted-foreground">Sem dados suficientes</p>
            )}
            {data.questoesMaisBemAvaliadas.map((q) => (
              <div key={q.id} className="flex items-center justify-between">
                <span className="truncate">{q.pergunta}</span>
                <Badge>{q.rating.toFixed(1)}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
