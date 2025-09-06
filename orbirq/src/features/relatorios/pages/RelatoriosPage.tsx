import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  Target,
  BookOpen,
  Award,

} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts'

interface RelatorioDesempenho {
  periodo: string
  mediaGeral: number
  totalQuestoes: number
  totalAlunos: number
  taxaAcerto: number
}

interface RelatorioDisciplina {
  disciplina: string
  questoes: number
  mediaAcerto: number
  alunosAtivos: number
}

export default function RelatoriosPage() {
  const [periodo, setPeriodo] = useState("30d")
  const [tipoRelatorio, setTipoRelatorio] = useState("geral")
  const [dadosDesempenho, setDadosDesempenho] = useState<RelatorioDesempenho[]>([])
  const [dadosDisciplina, setDadosDisciplina] = useState<RelatorioDisciplina[]>([])

  useEffect(() => {
    loadDadosRelatorio()
  }, [periodo, tipoRelatorio])

  const loadDadosRelatorio = async () => {
    try {
      // TODO: Implementar chamada real da API
      const mockDesempenho: RelatorioDesempenho[] = [
        { periodo: "Jan", mediaGeral: 0.75, totalQuestoes: 45, totalAlunos: 25, taxaAcerto: 0.78 },
        { periodo: "Fev", mediaGeral: 0.78, totalQuestoes: 52, totalAlunos: 28, taxaAcerto: 0.82 },
        { periodo: "Mar", mediaGeral: 0.82, totalQuestoes: 48, totalAlunos: 30, taxaAcerto: 0.85 },
        { periodo: "Abr", mediaGeral: 0.79, totalQuestoes: 55, totalAlunos: 32, taxaAcerto: 0.81 }
      ]

      const mockDisciplina: RelatorioDisciplina[] = [
        { disciplina: "Matemática", questoes: 120, mediaAcerto: 0.76, alunosAtivos: 45 },
        { disciplina: "Português", questoes: 95, mediaAcerto: 0.82, alunosAtivos: 38 },
        { disciplina: "História", questoes: 78, mediaAcerto: 0.79, alunosAtivos: 32 },
        { disciplina: "Ciências", questoes: 85, mediaAcerto: 0.74, alunosAtivos: 28 }
      ]

      setDadosDesempenho(mockDesempenho)
      setDadosDisciplina(mockDisciplina)
    } catch (error) {
      console.error('Erro ao carregar dados do relatório:', error)
    }
  }

  const exportarRelatorio = (formato: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exportando relatório em formato ${formato}`)
    // TODO: Implementar exportação
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Relatórios e Insights
        </h1>
        <div className="flex gap-2">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportarRelatorio('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <Tabs value={tipoRelatorio} onValueChange={setTipoRelatorio}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="disciplinas">Por Disciplina</TabsTrigger>
          <TabsTrigger value="alunos">Por Aluno</TabsTrigger>
          <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
        </TabsList>

        {/* Relatório Geral */}
        <TabsContent value="geral" className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="rounded-2xl">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-3xl font-bold">127</p>
                <p className="text-sm text-muted-foreground">Alunos Ativos</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-3xl font-bold">378</p>
                <p className="text-sm text-muted-foreground">Questões Criadas</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-3xl font-bold">79%</p>
                <p className="text-sm text-muted-foreground">Taxa de Acerto</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <p className="text-3xl font-bold">4.2</p>
                <p className="text-sm text-muted-foreground">Média Geral</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Desempenho */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Evolução do Desempenho
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={dadosDesempenho}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periodo" />
                    <YAxis domain={[0, 1]} tickFormatter={(value) => `${Math.round(value * 100)}%`} />
                    <Tooltip formatter={(value: number) => [`${Math.round(value * 100)}%`, 'Taxa de Acerto']} />
                    <Line
                      type="monotone"
                      dataKey="taxaAcerto"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ fill: '#8884d8' }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório por Disciplina */}
        <TabsContent value="disciplinas" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Barras */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Desempenho por Disciplina</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosDisciplina}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="disciplina" />
                      <YAxis domain={[0, 1]} tickFormatter={(value) => `${Math.round(value * 100)}%`} />
                      <Tooltip formatter={(value: number) => [`${Math.round(value * 100)}%`, 'Taxa de Acerto']} />
                      <Bar dataKey="mediaAcerto" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Pizza */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Distribuição de Questões</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={dadosDisciplina}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ disciplina, percent }) => `${disciplina} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="questoes"
                      >
                        {dadosDisciplina.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Disciplinas */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Detalhes por Disciplina</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dadosDisciplina.map((disciplina) => (
                  <div key={disciplina.disciplina} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{disciplina.disciplina}</h3>
                        <p className="text-sm text-muted-foreground">
                          {disciplina.questoes} questões • {disciplina.alunosAtivos} alunos ativos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {Math.round(disciplina.mediaAcerto * 100)}%
                      </p>
                      <p className="text-sm text-muted-foreground">Taxa de acerto</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório por Aluno */}
        <TabsContent value="alunos" className="space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Top 10 Alunos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { nome: "João Silva", desempenho: 0.95, questoes: 45 },
                  { nome: "Maria Santos", desempenho: 0.92, questoes: 42 },
                  { nome: "Pedro Costa", desempenho: 0.89, questoes: 38 },
                  { nome: "Ana Oliveira", desempenho: 0.87, questoes: 41 },
                  { nome: "Carlos Lima", desempenho: 0.85, questoes: 39 }
                ].map((aluno, index) => (
                  <div key={aluno.nome} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{aluno.nome}</p>
                        <p className="text-sm text-muted-foreground">{aluno.questoes} questões respondidas</p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {Math.round(aluno.desempenho * 100)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparativo */}
        <TabsContent value="comparativo" className="space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Comparativo entre Turmas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { turma: "8º Ano A", media: 0.82, alunos: 28, questoes: 156 },
                  { turma: "8º Ano B", media: 0.79, alunos: 25, questoes: 142 },
                  { turma: "9º Ano A", media: 0.85, alunos: 32, questoes: 178 }
                ].map((turma) => (
                  <div key={turma.turma} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{turma.turma}</h3>
                      <p className="text-sm text-muted-foreground">
                        {turma.alunos} alunos • {turma.questoes} questões
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{Math.round(turma.media * 100)}%</p>
                      <div className="w-32 bg-muted rounded-full h-2 mt-1">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${turma.media * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}