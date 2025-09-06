import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  AlertCircle,
  MessageSquare,
  Target,
  User
} from "lucide-react"

interface Notificacao {
  id: string
  tipo: 'sistema' | 'aluno' | 'turma' | 'questao'
  titulo: string
  mensagem: string
  data: string
  lida: boolean
  aluno?: {
    id: string
    nome: string
    avatar?: string
  }
  acoes?: {
    label: string
    acao: () => void
  }[]
}

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [filtro, setFiltro] = useState<'todas' | 'nao_lidas' | 'lidas'>('todas')

  useEffect(() => {
    loadNotificacoes()
  }, [])

  const loadNotificacoes = async () => {
    try {
      // TODO: Implementar chamada real da API
      const mockNotificacoes: Notificacao[] = [
        {
          id: "1",
          tipo: "aluno",
          titulo: "João Silva respondeu uma questão",
          mensagem: "João respondeu à questão 'Equação do Segundo Grau' com 85% de acerto",
          data: "2024-01-15T10:30:00Z",
          lida: false,
          aluno: {
            id: "1",
            nome: "João Silva",
            avatar: ""
          },
          acoes: [
            { label: "Ver Resposta", acao: () => console.log("Ver resposta") }
          ]
        },
        {
          id: "2",
          tipo: "sistema",
          titulo: "Nova funcionalidade disponível",
          mensagem: "Agora você pode criar convites únicos para seus alunos!",
          data: "2024-01-14T15:20:00Z",
          lida: true
        },
        {
          id: "3",
          tipo: "turma",
          titulo: "Turma Matemática 8º Ano A",
          mensagem: "A média da turma subiu para 78%",
          data: "2024-01-14T09:15:00Z",
          lida: false,
          acoes: [
            { label: "Ver Estatísticas", acao: () => console.log("Ver estatísticas") }
          ]
        },
        {
          id: "4",
          tipo: "questao",
          titulo: "Questão revisada",
          mensagem: "A questão 'Revolução Francesa' foi atualizada com novas alternativas",
          data: "2024-01-13T14:45:00Z",
          lida: true
        }
      ]
      setNotificacoes(mockNotificacoes)
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    }
  }

  const marcarComoLida = (id: string) => {
    setNotificacoes(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, lida: true } : notif
      )
    )
  }

  const marcarTodasComoLidas = () => {
    setNotificacoes(prev =>
      prev.map(notif => ({ ...notif, lida: true }))
    )
  }

  const excluirNotificacao = (id: string) => {
    setNotificacoes(prev => prev.filter(notif => notif.id !== id))
  }

  const getIconeTipo = (tipo: string) => {
    switch (tipo) {
      case 'aluno':
        return <User className="w-4 h-4" />
      case 'turma':
        return <Target className="w-4 h-4" />
      case 'questao':
        return <MessageSquare className="w-4 h-4" />
      case 'sistema':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getCorTipo = (tipo: string) => {
    switch (tipo) {
      case 'aluno':
        return 'text-blue-600'
      case 'turma':
        return 'text-green-600'
      case 'questao':
        return 'text-purple-600'
      case 'sistema':
        return 'text-orange-600'
      default:
        return 'text-gray-600'
    }
  }

  const notificacoesFiltradas = notificacoes.filter(notif => {
    switch (filtro) {
      case 'nao_lidas':
        return !notif.lida
      case 'lidas':
        return notif.lida
      default:
        return true
    }
  })

  const naoLidasCount = notificacoes.filter(n => !n.lida).length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6" />
          Notificações
          {naoLidasCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {naoLidasCount}
            </Badge>
          )}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={marcarTodasComoLidas}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Marcar Todas como Lidas
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      <Tabs value={filtro} onValueChange={(value) => setFiltro(value as any)}>
        <TabsList>
          <TabsTrigger value="todas">
            Todas ({notificacoes.length})
          </TabsTrigger>
          <TabsTrigger value="nao_lidas">
            Não Lidas ({naoLidasCount})
          </TabsTrigger>
          <TabsTrigger value="lidas">
            Lidas ({notificacoes.length - naoLidasCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filtro} className="space-y-4">
          {notificacoesFiltradas.length === 0 ? (
            <Card className="rounded-2xl">
              <CardContent className="p-8 text-center">
                <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {filtro === 'nao_lidas'
                    ? "Nenhuma notificação não lida."
                    : filtro === 'lidas'
                    ? "Nenhuma notificação lida."
                    : "Nenhuma notificação encontrada."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            notificacoesFiltradas.map((notificacao) => (
              <Card
                key={notificacao.id}
                className={`rounded-2xl transition-all ${
                  !notificacao.lida ? 'border-l-4 border-l-primary bg-primary/5' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full bg-muted ${getCorTipo(notificacao.tipo)}`}>
                      {getIconeTipo(notificacao.tipo)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{notificacao.titulo}</h3>
                        {!notificacao.lida && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {notificacao.mensagem}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          {new Date(notificacao.data).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>

                        {notificacao.aluno && (
                          <div className="flex items-center gap-2">
                            <Avatar className="w-4 h-4">
                              <AvatarImage src={notificacao.aluno.avatar} alt={notificacao.aluno.nome} />
                              <AvatarFallback className="text-xs">
                                {notificacao.aluno.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span>{notificacao.aluno.nome}</span>
                          </div>
                        )}
                      </div>

                      {notificacao.acoes && notificacao.acoes.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {notificacao.acoes.map((acao, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={acao.acao}
                            >
                              {acao.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {!notificacao.lida && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => marcarComoLida(notificacao.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => excluirNotificacao(notificacao.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Resumo */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Resumo das Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{notificacoes.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{naoLidasCount}</p>
              <p className="text-sm text-muted-foreground">Não Lidas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {notificacoes.filter(n => n.tipo === 'aluno').length}
              </p>
              <p className="text-sm text-muted-foreground">De Alunos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {notificacoes.filter(n => n.tipo === 'sistema').length}
              </p>
              <p className="text-sm text-muted-foreground">Sistema</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}