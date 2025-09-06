import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Link,
  Copy,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  ExternalLink,
  Crown,
  Users
} from "lucide-react"

interface Invite {
  token: string
  tipo: 'permanente' | 'unico'
  status: 'pending' | 'accepted' | 'expired'
  expiresAt?: string
  createdAt: string
  professorId?: string
  professorName?: string
}

export default function ProfessorInvitesPage() {
  const [invites, setInvites] = useState<Invite[]>([])
  const [loading, setLoading] = useState(true)
  const [permanentLink, setPermanentLink] = useState('')
  const [permanentActive, setPermanentActive] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [expiresIn, setExpiresIn] = useState('')

  useEffect(() => {
    loadInvites()
    loadPermanentLink()
  }, [])

  const loadInvites = async () => {
    try {
      // Verificar se usuário está logado como professor
      const usuario = JSON.parse(localStorage.getItem("usuario") || "null")

      if (usuario && usuario.role === 'professor') {
        // Buscar convites reais do professor via API
        const response = await fetch(`http://localhost:3000/invites/professor/${usuario.id}`)
        const invitesData = await response.json()

        if (response.ok) {
          setInvites(invitesData)
        } else {
          console.error('Erro ao buscar convites:', invitesData)
          setInvites([])
        }
      } else {
        // Usuário não é professor ou não está logado
        setInvites([])
      }
    } catch (error) {
      console.error('Erro ao carregar convites:', error)
      setInvites([])
    } finally {
      setLoading(false)
    }
  }

  const loadPermanentLink = async () => {
    try {
      // Pegar dados do professor logado
      const usuario = JSON.parse(localStorage.getItem("usuario") || "null")

      if (usuario && usuario.role === 'professor') {
        // Usar ID real do professor logado
        const professorId = usuario.id || '123' // Fallback para mock se não houver ID
        setPermanentLink(`http://localhost:5173/invite/${professorId}`)
      } else {
        // Usuário não é professor ou não está logado
        console.warn('Usuário não autorizado para gerar links de convite')
        setPermanentLink('')
      }
    } catch (error) {
      console.error('Erro ao carregar link permanente:', error)
      setPermanentLink('')
    }
  }

  const createInvite = async () => {
    try {
      // Pegar dados do professor logado
      const usuario = JSON.parse(localStorage.getItem("usuario") || "null")

      if (!usuario || usuario.role !== 'professor') {
        alert('Apenas professores podem criar convites')
        return
      }

      const expiresInHours = expiresIn && expiresIn !== 'infinito' ? parseInt(expiresIn) : null

      // Fazer chamada real para a API
      const response = await fetch('http://localhost:3000/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          professorId: usuario.id,
          expiresIn: expiresInHours,
          tipo: 'unico'
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao criar convite')
      }

      const newInvite = await response.json()

      // Atualizar a lista de convites
      setInvites(prev => [newInvite, ...prev])
      setShowCreateDialog(false)
      setExpiresIn('')
      alert('Convite criado com sucesso!')
    } catch (error) {
      console.error('Erro ao criar convite:', error)
      alert('Erro ao criar convite. Tente novamente.')
    }
  }

  const deleteInvite = async (token: string) => {
    try {
      // TODO: Implementar chamada real da API
      setInvites(prev => prev.filter(invite => invite.token !== token))
    } catch (error) {
      console.error('Erro ao deletar convite:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // TODO: Mostrar toast de sucesso
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'expired':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente'
      case 'accepted':
        return 'Aceito'
      case 'expired':
        return 'Expirado'
      default:
        return status
    }
  }

  const getTipoText = (tipo: string) => {
    return tipo === 'permanente' ? 'Permanente' : 'Único'
  }

  if (loading) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">🎫 Gerenciar Convites</h1>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Criar Convite Único
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Convite Único</DialogTitle>
              <AlertDescription>
                Configure a duração do convite único para controlar o acesso dos alunos.
              </AlertDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="expiresIn">Duração (horas)</Label>
                <Select value={expiresIn} onValueChange={setExpiresIn}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a duração" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hora</SelectItem>
                    <SelectItem value="24">24 horas</SelectItem>
                    <SelectItem value="168">7 dias</SelectItem>
                    <SelectItem value="infinito">Infinito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={createInvite}>
                  Criar Convite
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Link Permanente */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Link Permanente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Link className="h-4 w-4" />
            <AlertDescription>
              Este link nunca expira e pode ser compartilhado livremente.
              Qualquer aluno que clicar será vinculado automaticamente.
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-2">
            <Input value={permanentLink} readOnly className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(permanentLink)}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(permanentLink, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={permanentActive ? "default" : "secondary"}>
              {permanentActive ? "Ativo" : "Inativo"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPermanentActive(!permanentActive)}
            >
              {permanentActive ? "Desativar" : "Ativar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Convites */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Convites Criados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invites.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhum convite criado ainda.
            </p>
          ) : (
            <div className="space-y-3">
              {invites.map((invite) => (
                <div
                  key={invite.token}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(invite.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {invite.token}
                        </code>
                        <Badge variant="outline">
                          {getTipoText(invite.tipo)}
                        </Badge>
                        <Badge
                          variant={
                            invite.status === 'accepted' ? 'default' :
                            invite.status === 'pending' ? 'secondary' : 'destructive'
                          }
                        >
                          {getStatusText(invite.status)}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Criado em {new Date(invite.createdAt).toLocaleDateString('pt-BR')}
                        {invite.expiresAt && (
                          <span className="ml-2">
                            • Expira em {new Date(invite.expiresAt).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`${window.location.origin}/invite/${invite.token}`)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    {invite.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteInvite(invite.token)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}