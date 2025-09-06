import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import Header from "@/shared/components/Header"
import { api } from "@/shared/services/api"
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  UserPlus,
  BarChart3
} from "lucide-react"

interface Turma {
  id: string
  nome: string
  disciplina: string[]
  ano: string
  periodo: string
  alunos: Aluno[]
  questoesAtribuidas: number
  mediaTurma: number
  status: "ativa" | "inativa"
}

interface Aluno {
  id: string
  nome: string
  email: string
  avatar?: string
  desempenho: number
  questoesRespondidas: number
}

interface TurmaFromAPI {
  id: string
  nome: string
  disciplina: string[]
  ano: string
  periodo: string
  status: string
  professor_id: string | null
  created_at: string
  updated_at: string
  professor_nome?: string | null
}

// ---------------- MULTISELECT DISCIPLINAS ----------------
interface MultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  options: string[]
  setOptions: (opts: string[]) => void
}

function MultiSelectDisciplinas({
  value,
  onChange,
  options,
  setOptions,
}: MultiSelectProps) {
  const [inputValue, setInputValue] = useState("")

  const addOption = (option: string) => {
    if (!value.includes(option)) {
      onChange([...value, option])
    }
    if (!options.includes(option)) {
      setOptions([...options, option]) // salva para próximas turmas
    }
    setInputValue("")
  }

  const removeOption = (option: string) => {
    onChange(value.filter((v) => v !== option))
  }

  return (
    <div className="space-y-2">
      {/* Selecionados */}
      <div className="flex flex-wrap gap-2">
        {value.map((item) => (
          <Badge
            key={item}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {item}
            <button
              className="ml-1 text-gray-400 hover:text-gray-600"
              onClick={() => removeOption(item)}
            >
              ×
            </button>
          </Badge>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Digite ou selecione..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button
          type="button"
          onClick={() => {
            if (inputValue.trim()) addOption(inputValue.trim())
          }}
        >
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>

      {/* Sugestões */}
      <div className="flex flex-wrap gap-2 mt-2">
        {options
          .filter(
            (opt) =>
              opt.toLowerCase().includes(inputValue.toLowerCase()) &&
              !value.includes(opt)
          )
          .map((opt) => (
            <Badge
              key={opt}
              variant="outline"
              className="cursor-pointer"
              onClick={() => addOption(opt)}
            >
              {opt}
            </Badge>
          ))}
      </div>
    </div>
  )
}

// ---------------- PAGINA PRINCIPAL ----------------
export default function GerenciarTurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [filteredTurmas, setFilteredTurmas] = useState<Turma[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null)
  const [disciplinasDisponiveis, setDisciplinasDisponiveis] = useState([
    "Matemática",
    "Português",
    "História",
    "Ciências",
  ])

  const [novaTurma, setNovaTurma] = useState({
    nome: "",
    disciplina: [] as string[],
    ano: "",
    periodo: "",
  })

  const [editandoTurma, setEditandoTurma] = useState<Turma | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddAlunoDialog, setShowAddAlunoDialog] = useState(false)
  const [turmaParaAdicionar, setTurmaParaAdicionar] = useState<Turma | null>(null)
  const [alunosDisponiveis, setAlunosDisponiveis] = useState<Aluno[]>([])

  useEffect(() => {
    loadTurmas()
  }, [])

  useEffect(() => {
    filterTurmas()
  }, [turmas, searchTerm])

  const loadTurmas = async () => {
    try {
      console.log("📡 [FRONTEND] Carregando turmas do servidor")
      const response: TurmaFromAPI[] = await api.get('/turmas')
      console.log("✅ [FRONTEND] Resposta da API:", response)
      console.log("✅ [FRONTEND] Tipo da resposta:", typeof response)
      console.log("✅ [FRONTEND] É array?", Array.isArray(response))
      console.log("✅ [FRONTEND] Turmas recebidas:", response?.length || 0, "turmas")

      if (!Array.isArray(response)) {
        console.error("❌ [FRONTEND] Resposta não é um array:", response)
        setTurmas([])
        return
      }

      // Load students for each turma
      const turmasComAlunos = await Promise.all(
        response.map(async (turma: TurmaFromAPI) => {
          console.log("🔄 [FRONTEND] Carregando alunos da turma:", turma.nome)
          try {
            const alunosResponse = await api.get(`/turmas/${turma.id}/alunos`)
            console.log("✅ [FRONTEND] Alunos da turma", turma.nome, ":", alunosResponse?.length || 0, "alunos")

            const alunosFormatados = alunosResponse.map((aluno: any) => ({
              id: aluno.id,
              nome: aluno.nome_completo || aluno.nome || "Nome não disponível",
              email: aluno.email,
              avatar: aluno.foto_perfil_url || "",
              desempenho: aluno.desempenho || 0,
              questoesRespondidas: aluno.questoesRespondidas || 0
            }))

            return {
              ...turma,
              alunos: alunosFormatados,
              questoesAtribuidas: 0,
              mediaTurma: alunosFormatados.length > 0
                ? alunosFormatados.reduce((acc: number, aluno: Aluno) => acc + aluno.desempenho, 0) / alunosFormatados.length
                : 0,
              status: turma.status as "ativa" | "inativa"
            }
          } catch (error) {
            console.error("❌ [FRONTEND] Erro ao carregar alunos da turma", turma.nome, ":", error)
            // Return turma with empty alunos array if loading fails
            return {
              ...turma,
              alunos: [],
              questoesAtribuidas: 0,
              mediaTurma: 0,
              status: turma.status as "ativa" | "inativa"
            }
          }
        })
      )

      setTurmas(turmasComAlunos)
      console.log("✅ [FRONTEND] Turmas com alunos processadas e definidas no estado")
    } catch (error: any) {
      console.error("❌ [FRONTEND] Erro ao carregar turmas:", error)
      console.error("❌ [FRONTEND] Detalhes do erro:", {
        message: error.message,
        status: error.status,
        details: error.details
      })
      setTurmas([])
    }
  }

  const filterTurmas = () => {
    if (!searchTerm) {
      setFilteredTurmas(turmas)
      return
    }

    const filtered = turmas.filter(
      (turma) =>
        turma.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        turma.disciplina.some((d) =>
          d.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    setFilteredTurmas(filtered)
  }

  const criarTurma = async () => {
    try {
      const response: TurmaFromAPI = await api.post('/turmas', novaTurma)
      const turmaCompleta: Turma = {
        ...response,
        alunos: [],
        questoesAtribuidas: 0,
        mediaTurma: 0,
        status: response.status as "ativa" | "inativa"
      }
      setTurmas((prev) => [...prev, turmaCompleta])
      setShowCreateDialog(false)
      setNovaTurma({ nome: "", disciplina: [], ano: "", periodo: "" })
    } catch (error) {
      console.error("Erro ao criar turma:", error)
    }
  }

  const excluirTurma = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta turma?")) {
      try {
        await api.delete(`/turmas/${id}`)
        setTurmas((prev) => prev.filter((t) => t.id !== id))
      } catch (error) {
        console.error("Erro ao excluir turma:", error)
      }
    }
  }

  const adicionarAluno = async (turma: Turma) => {
    setTurmaParaAdicionar(turma)
    try {
      // Fetch available students from API
      const alunos = await api.get('/usuarios?role=aluno')
      // Filter out students who are already in this turma (use already loaded data)
      const alunosAtuaisIds = turma.alunos.map((aluno) => aluno.id)

      const alunosDisponiveis = alunos
        .filter((aluno: any) => !alunosAtuaisIds.includes(aluno.id))
        .map((aluno: any) => ({
          id: aluno.id,
          nome: aluno.nome_completo || aluno.nome || "Nome não disponível",
          email: aluno.email,
          avatar: aluno.foto_perfil_url || "",
          desempenho: 0, // Will be calculated from answers
          questoesRespondidas: 0 // Will be calculated from answers
        }))

      setAlunosDisponiveis(alunosDisponiveis)
    } catch (error) {
      console.error("Erro ao carregar alunos disponíveis:", error)
      // Fallback to empty list
      setAlunosDisponiveis([])
    }
    setShowAddAlunoDialog(true)
  }

  const adicionarAlunoATurma = async (alunoId: string) => {
    if (!turmaParaAdicionar) return

    console.log("🚀 [FRONTEND] Iniciando adição de aluno:", { alunoId, turmaId: turmaParaAdicionar.id })

    try {
      console.log("📡 [FRONTEND] Fazendo requisição POST para adicionar aluno")
      const response = await api.post(`/turmas/${turmaParaAdicionar.id}/alunos`, { alunoId })
      console.log("✅ [FRONTEND] Resposta da API:", response)

      // Update local state instead of refetching all data
      setTurmas(prev => prev.map(turma =>
        turma.id === turmaParaAdicionar.id
          ? { ...turma, alunos: [...turma.alunos, alunosDisponiveis.find(a => a.id === alunoId)!] }
          : turma
      ))

      // Remove from available students
      setAlunosDisponiveis(prev => prev.filter(a => a.id !== alunoId))
      console.log("✅ [FRONTEND] Aluno adicionado localmente com sucesso")
    } catch (error) {
      console.error("❌ [FRONTEND] Erro ao adicionar aluno:", error)
      // Fallback to reloading data if local update fails
      await loadTurmas()
    }
  }

  const criarConvitePermanente = async () => {
    if (!turmaParaAdicionar) return

    try {
      // This would create a permanent invite link for the turma
      const inviteLink = `http://localhost:5173/join-turma/${turmaParaAdicionar.id}`
      alert(`Convite permanente criado!\nLink: ${inviteLink}`)
    } catch (error) {
      console.error("Erro ao criar convite:", error)
    }
  }

  const verEstatisticas = async (turma: Turma) => {
    // Use already loaded alunos data and calculate statistics
    const mediaTurma = turma.alunos.length > 0
      ? turma.alunos.reduce((acc, aluno) => acc + aluno.desempenho, 0) / turma.alunos.length
      : 0

    setSelectedTurma({
      ...turma,
      mediaTurma: mediaTurma
    })
  }


  const editarTurma = async (turma: Turma) => {
    // Use already loaded alunos data
    setEditandoTurma(turma)
    setShowEditDialog(true)
  }

  const salvarEdicaoTurma = async () => {
    if (!editandoTurma) return

    try {
      const response: TurmaFromAPI = await api.put(`/turmas/${editandoTurma.id}`, {
        nome: editandoTurma.nome,
        disciplina: editandoTurma.disciplina,
        ano: editandoTurma.ano,
        periodo: editandoTurma.periodo
      })

      const turmaAtualizada: Turma = {
        ...response,
        alunos: editandoTurma.alunos,
        questoesAtribuidas: editandoTurma.questoesAtribuidas,
        mediaTurma: editandoTurma.mediaTurma,
        status: response.status as "ativa" | "inativa"
      }

      setTurmas((prev) => prev.map((t) => t.id === editandoTurma.id ? turmaAtualizada : t))
      setShowEditDialog(false)
      setEditandoTurma(null)
    } catch (error) {
      console.error("Erro ao editar turma:", error)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-light text-gray-900 tracking-tight">
              Gerenciar Turmas
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Gerencie suas turmas e alunos
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="border-gray-300 hover:bg-gray-50">
                <Plus className="w-5 h-5 mr-2" />
                Nova Turma
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Turma</DialogTitle>
                <DialogDescription>
                  Preencha os dados para criar uma nova turma no sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome da Turma</Label>
                  <Input
                    id="nome"
                    value={novaTurma.nome}
                    onChange={(e) =>
                      setNovaTurma({ ...novaTurma, nome: e.target.value })
                    }
                    placeholder="Ex: Matemática 8º Ano A"
                  />
                </div>

                {/* DISCIPLINAS MULTISELECT */}
                <div>
                  <Label>Disciplinas</Label>
                  <MultiSelectDisciplinas
                    value={novaTurma.disciplina}
                    onChange={(value) =>
                      setNovaTurma({ ...novaTurma, disciplina: value })
                    }
                    options={disciplinasDisponiveis}
                    setOptions={setDisciplinasDisponiveis}
                  />
                </div>

                <div>
                  <Label htmlFor="ano">Ano</Label>
                  <Input
                    id="ano"
                    value={novaTurma.ano}
                    onChange={(e) =>
                      setNovaTurma({ ...novaTurma, ano: e.target.value })
                    }
                    placeholder="Ex: 2024"
                  />
                </div>

                <div>
                  <Label htmlFor="periodo">Período</Label>
                  <Input
                    id="periodo"
                    value={novaTurma.periodo}
                    onChange={(e) =>
                      setNovaTurma({ ...novaTurma, periodo: e.target.value })
                    }
                    placeholder="Ex: Matutino"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={criarTurma}>Criar Turma</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Turma</DialogTitle>
                <DialogDescription>
                  Modifique os dados da turma selecionada.
                </DialogDescription>
              </DialogHeader>
              {editandoTurma && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-nome">Nome da Turma</Label>
                    <Input
                      id="edit-nome"
                      value={editandoTurma.nome}
                      onChange={(e) =>
                        setEditandoTurma({ ...editandoTurma, nome: e.target.value })
                      }
                      placeholder="Ex: Matemática 8º Ano A"
                    />
                  </div>

                  {/* DISCIPLINAS MULTISELECT */}
                  <div>
                    <Label>Disciplinas</Label>
                    <MultiSelectDisciplinas
                      value={editandoTurma.disciplina}
                      onChange={(value) =>
                        setEditandoTurma({ ...editandoTurma, disciplina: value })
                      }
                      options={disciplinasDisponiveis}
                      setOptions={setDisciplinasDisponiveis}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-ano">Ano</Label>
                    <Input
                      id="edit-ano"
                      value={editandoTurma.ano}
                      onChange={(e) =>
                        setEditandoTurma({ ...editandoTurma, ano: e.target.value })
                      }
                      placeholder="Ex: 2024"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-periodo">Período</Label>
                    <Input
                      id="edit-periodo"
                      value={editandoTurma.periodo}
                      onChange={(e) =>
                        setEditandoTurma({ ...editandoTurma, periodo: e.target.value })
                      }
                      placeholder="Ex: Matutino"
                    />
                  </div>

                  {/* Alunos atuais */}
                  <div>
                    <Label>Alunos Atuais ({editandoTurma.alunos?.length || 0})</Label>
                    <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                      {editandoTurma.alunos && editandoTurma.alunos.length > 0 ? (
                        editandoTurma.alunos.map((aluno) => (
                          <div key={aluno.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={aluno.avatar} alt={aluno.nome} />
                                <AvatarFallback className="text-xs">
                                  {aluno.nome.split(" ").map((n) => n[0]).join("").toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span>{aluno.nome}</span>
                            </div>
                            <span className="text-muted-foreground">{aluno.email}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Nenhum aluno nesta turma
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowEditDialog(false)
                        setEditandoTurma(null)
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={salvarEdicaoTurma}>Salvar Alterações</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Add Aluno Dialog */}
          <Dialog open={showAddAlunoDialog} onOpenChange={setShowAddAlunoDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Alunos - {turmaParaAdicionar?.nome}</DialogTitle>
                <DialogDescription>
                  Selecione os alunos que deseja adicionar à turma.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Alunos Disponíveis</h4>
                  <Button onClick={criarConvitePermanente} variant="outline" size="sm">
                    Criar Convite Permanente
                  </Button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {alunosDisponiveis.map((aluno) => (
                    <div
                      key={aluno.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={aluno.avatar} alt={aluno.nome} />
                          <AvatarFallback className="text-xs">
                            {aluno.nome
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{aluno.nome}</p>
                          <p className="text-sm text-muted-foreground">{aluno.email}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => adicionarAlunoATurma(aluno.id)}
                        size="sm"
                      >
                        Adicionar
                      </Button>
                    </div>
                  ))}
                </div>

                {alunosDisponiveis.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhum aluno disponível para adicionar</p>
                    <p className="text-sm">Use o botão "Criar Convite Permanente" para convidar novos alunos</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Busca */}
        <div className="max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar turmas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base border-gray-200 focus:border-gray-300"
            />
          </div>
        </div>

        {/* Lista de Turmas */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredTurmas.length === 0 ? (
            <div className="col-span-full">
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-light text-gray-500 mb-2">
                  Nenhuma turma encontrada
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm
                    ? "Tente ajustar os termos de busca"
                    : "Comece criando sua primeira turma"
                  }
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Turma
                  </Button>
                )}
              </div>
            </div>
          ) : (
            filteredTurmas.map((turma) => (
              <div key={turma.id} className="border border-gray-200 rounded-lg p-8 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-1">
                      {turma.nome}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {turma.disciplina.join(", ")}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {turma.ano} • {turma.periodo}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    turma.status === "ativa"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {turma.status}
                  </span>
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <p className="text-2xl font-light text-gray-900">
                      {turma.alunos.length}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Alunos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-light text-gray-900">
                      {turma.questoesAtribuidas}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Questões</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-light text-gray-900">
                      {Math.round(turma.mediaTurma * 100)}%
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Média</p>
                  </div>
                </div>

                {/* Alunos */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide mb-4">
                    Alunos ({turma.alunos.length})
                  </h4>
                  <div className="space-y-3">
                    {turma.alunos.length > 0 ? (
                      <>
                        {turma.alunos.slice(0, 3).map((aluno) => (
                          <div key={aluno.id} className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={aluno.avatar} alt={aluno.nome} />
                              <AvatarFallback className="text-xs bg-gray-100">
                                {aluno.nome
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {aluno.nome}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500">
                              {Math.round(aluno.desempenho * 100)}%
                            </span>
                          </div>
                        ))}
                        {turma.alunos.length > 3 && (
                          <p className="text-sm text-gray-400 text-center">
                            +{turma.alunos.length - 3} alunos
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-4">
                        Nenhum aluno ainda
                      </p>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <div className="grid grid-cols-2 gap-3">
  <Button
    variant="outline"
    size="sm"
    className="border-gray-300 hover:bg-gray-50"
    onClick={() => adicionarAluno(turma)}
  >
    <UserPlus className="w-4 h-4 mr-2" />
    Adicionar
  </Button>
  <Button
    variant="outline"
    size="sm"
    className="border-gray-300 hover:bg-gray-50"
    onClick={() => verEstatisticas(turma)}
  >
    <BarChart3 className="w-4 h-4 mr-2" />
    Estatísticas
  </Button>
  <Button
    variant="outline"
    size="sm"
    className="border-gray-300 hover:bg-gray-50"
    onClick={() => editarTurma(turma)}
  >
    <Edit className="w-4 h-4 mr-2" />
    Editar
  </Button>
  <Button
    variant="outline"
    size="sm"
    className="border-red-200 text-red-600 hover:bg-red-50"
    onClick={() => excluirTurma(turma.id)}
  >
    <Trash2 className="w-4 h-4 mr-2" />
    Excluir
  </Button>
</div>

              </div>
            ))
          )}
        </div>

        {/* Modal Estatísticas */}
        {selectedTurma && (
          <Dialog
            open={!!selectedTurma}
            onOpenChange={() => setSelectedTurma(null)}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Estatísticas - {selectedTurma.nome}</DialogTitle>
                <DialogDescription>
                  Visualize as estatísticas e desempenho da turma.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 border border-gray-200 rounded-lg">
                    <p className="text-3xl font-light text-gray-900">
                      {selectedTurma?.alunos?.length || 0}
                    </p>
                    <p className="text-sm text-gray-500 uppercase tracking-wide mt-1">
                      Total de Alunos
                    </p>
                  </div>
                  <div className="text-center p-6 border border-gray-200 rounded-lg">
                    <p className="text-3xl font-light text-gray-900">
                      {Math.round((selectedTurma?.mediaTurma || 0) * 100)}%
                    </p>
                    <p className="text-sm text-gray-500 uppercase tracking-wide mt-1">
                      Média da Turma
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Desempenho dos Alunos</h4>
                  <div className="space-y-2">
                    {selectedTurma?.alunos && selectedTurma.alunos.length > 0 ? (
                      selectedTurma.alunos.map((aluno) => (
                        <div
                          key={aluno.id}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={aluno.avatar} alt={aluno.nome} />
                              <AvatarFallback className="text-xs">
                                {aluno.nome
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{aluno.nome}</p>
                              <p className="text-sm text-muted-foreground">
                                {aluno.questoesRespondidas || 0} questões
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {Math.round((aluno.desempenho || 0) * 100)}%
                            </p>
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{
                                  width: `${(aluno.desempenho || 0) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Nenhum aluno nesta turma ainda</p>
                        <p className="text-sm">Adicione alunos para ver estatísticas</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
