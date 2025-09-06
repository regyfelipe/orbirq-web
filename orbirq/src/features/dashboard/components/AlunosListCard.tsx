import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, TrendingUp, Target, Clock } from "lucide-react"

interface Aluno {
  id: string
  nome: string
  email: string
  avatar?: string
  questoesRespondidas: number
  taxaAcerto: number
  ultimaAtividade: string
  nivel: number
  turma: string
}

interface AlunosListCardProps {
  alunos: Aluno[]
}

export default function AlunosListCard({ alunos }: AlunosListCardProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAlunos = alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.turma.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getNivelColor = (nivel: number) => {
    if (nivel >= 8) return "bg-purple-500"
    if (nivel >= 6) return "bg-blue-500"
    if (nivel >= 4) return "bg-green-500"
    if (nivel >= 2) return "bg-yellow-500"
    return "bg-gray-500"
  }

  const getTaxaAcertoColor = (taxa: number) => {
    if (taxa >= 0.8) return "text-green-600"
    if (taxa >= 0.6) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="w-5 h-5" />
          Meus Alunos
          <Badge variant="secondary" className="ml-auto">
            {filteredAlunos.length}
          </Badge>
        </CardTitle>

        {/* Campo de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar alunos por nome, email ou turma..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent>
        {filteredAlunos.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum aluno encontrado.
          </p>
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredAlunos.map((aluno) => (
            <div
              key={aluno.id}
              className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={aluno.avatar} alt={aluno.nome} />
                <AvatarFallback>
                  {aluno.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{aluno.nome}</h4>
                  <div className={`w-3 h-3 rounded-full ${getNivelColor(aluno.nivel)}`} />
                  <Badge variant="outline" className="text-xs">
                    Nível {aluno.nivel}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground truncate mb-2">
                  {aluno.email}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span className={getTaxaAcertoColor(aluno.taxaAcerto)}>
                      {Math.round(aluno.taxaAcerto * 100)}% acerto
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{aluno.questoesRespondidas} questões</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{aluno.ultimaAtividade}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <Badge variant="secondary" className="text-xs">
                  {aluno.turma}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {filteredAlunos.length > 0 && (
          <div className="mt-4 pt-3 border-t">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="font-medium text-green-600">
                  {filteredAlunos.filter(a => a.taxaAcerto >= 0.8).length}
                </p>
                <p className="text-muted-foreground">Excelente (≥80%)</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-yellow-600">
                  {filteredAlunos.filter(a => a.taxaAcerto >= 0.6 && a.taxaAcerto < 0.8).length}
                </p>
                <p className="text-muted-foreground">Bom (60-79%)</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-red-600">
                  {filteredAlunos.filter(a => a.taxaAcerto < 0.6).length}
                </p>
                <p className="text-muted-foreground">Precisa de ajuda (menos de 60%)</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}