import React, { useState, useRef, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Users, BookOpen, TrendingUp } from "lucide-react"

interface Turma {
  id: string
  nome: string
  disciplina: string
  alunosCount: number
  questoesCount: number
  mediaAcerto: number
}

interface TurmaCardProps {
  turmas: Turma[]
}

export default function TurmaCard({ turmas }: TurmaCardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const dragRef = useRef<HTMLDivElement>(null)
  const startPos = useRef({ x: 0, y: 0 })

  const filteredTurmas = turmas.filter(turma =>
    turma.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    turma.disciplina.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    startPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    setPosition({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Adicionar event listeners para drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <Card className="rounded-2xl relative">
      {/* Campo de busca arrastável */}
      <div
        ref={dragRef}
        className={`absolute -top-4 left-4 z-10 bg-white rounded-lg shadow-lg border p-3 cursor-move select-none ${
          isDragging ? 'shadow-xl scale-105' : ''
        }`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2 min-w-[300px]">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar turmas por nome ou disciplina..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0"
          />
          <Badge variant="secondary" className="ml-2">
            {filteredTurmas.length}
          </Badge>
        </div>
      </div>

      <CardHeader className="pt-8">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="w-5 h-5" />
          Minhas Turmas
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {filteredTurmas.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma turma encontrada.
          </p>
        )}

        <div className="grid gap-3 max-h-96 overflow-y-auto">
          {filteredTurmas.map((turma) => (
            <div
              key={turma.id}
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{turma.nome}</h4>
                <Badge variant="outline">{turma.disciplina}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{turma.alunosCount} alunos</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{turma.questoesCount} questões</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{Math.round(turma.mediaAcerto * 100)}% acerto</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}