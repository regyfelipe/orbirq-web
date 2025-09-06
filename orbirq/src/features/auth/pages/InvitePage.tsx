import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
  ArrowRight,
  Crown,
  BookOpen,
  Users,
  LogIn,
  UserCheck
} from "lucide-react"

interface InviteData {
  token: string
  professorName: string
  professorEmail: string
  expiresAt?: string
  status: 'valid' | 'expired' | 'used' | 'invalid'
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


export default function InvitePage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [inviteData, setInviteData] = useState<InviteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ id: string; nome: string; role: string } | null>(null)

  useEffect(() => {
    // Verificar se usuário está logado
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null")
    setCurrentUser(usuario)

    loadInviteData()
  }, [token])

  const loadInviteData = async () => {
    try {
      // Fazer chamada real para a API
const response = await fetch(`${API_URL}/invites/${token}`);
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 404) {
          setInviteData({
            token: token || '',
            professorName: '',
            professorEmail: '',
            status: 'invalid'
          })
        } else if (response.status === 410) {
          setInviteData({
            token: token || '',
            professorName: '',
            professorEmail: '',
            status: 'expired'
          })
        } else {
          throw new Error(data.error || 'Erro ao carregar convite')
        }
        return
      }

      setInviteData({
        token: data.token,
        professorName: data.professorName,
        professorEmail: data.professorEmail,
        expiresAt: data.expiresAt,
        status: data.status === 'pending' ? 'valid' : data.status
      })
    } catch (error) {
      console.error('Erro ao carregar dados do convite:', error)
      setInviteData({
        token: token || '',
        professorName: '',
        professorEmail: '',
        status: 'invalid'
      })
    } finally {
      setLoading(false)
    }
  }

  const acceptInvite = async () => {
    if (!inviteData) return

    setAccepting(true)
    try {
      // Verificar se usuário está logado
      if (currentUser) {
        if (currentUser.role === 'aluno') {
          // Usuário já é aluno - aceitar convite diretamente via API
          const response = await fetch(`http://localhost:3000/invites/${token}/accept`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              alunoId: currentUser.id
            })
          })

          if (!response.ok) {
            throw new Error('Erro ao aceitar convite')
          }

          alert('Convite aceito com sucesso! Você foi vinculado ao professor.')
          navigate('/dashboard')
        } else {
          // Usuário é professor/admin - mostrar mensagem
          alert('Você já está logado como professor/admin. Use uma conta de aluno para aceitar convites.')
          navigate('/dashboard')
        }
      } else {
        // Usuário não está logado - redirecionar para cadastro
        navigate('/register', {
          state: {
            inviteToken: token,
            professorName: inviteData.professorName
          }
        })
      }
    } catch (error) {
      console.error('Erro ao aceitar convite:', error)
      alert('Erro ao aceitar convite. Tente novamente.')
    } finally {
      setAccepting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case 'expired':
        return <Clock className="w-8 h-8 text-yellow-500" />
      case 'used':
        return <XCircle className="w-8 h-8 text-blue-500" />
      case 'invalid':
        return <XCircle className="w-8 h-8 text-red-500" />
      default:
        return null
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'valid':
        return {
          title: 'Convite Válido!',
          description: 'Você foi convidado para se juntar à plataforma Orbirq.',
          type: 'success' as const
        }
      case 'expired':
        return {
          title: 'Convite Expirado',
          description: 'Este convite já expirou. Solicite um novo convite ao professor.',
          type: 'warning' as const
        }
      case 'used':
        return {
          title: 'Convite Já Utilizado',
          description: 'Este convite já foi utilizado. Faça login na sua conta.',
          type: 'info' as const
        }
      case 'invalid':
        return {
          title: 'Convite Inválido',
          description: 'Este convite não é válido. Verifique o link ou solicite um novo convite.',
          type: 'error' as const
        }
      default:
        return {
          title: 'Erro',
          description: 'Ocorreu um erro ao processar o convite.',
          type: 'error' as const
        }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Verificando convite...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!inviteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Erro ao Carregar Convite</h2>
            <p className="text-muted-foreground mb-4">
              Não foi possível carregar os dados do convite.
            </p>
            <Button onClick={() => navigate('/login')}>
              Ir para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusInfo = getStatusMessage(inviteData.status)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon(inviteData.status)}
          </div>
          <CardTitle className="text-2xl">{statusInfo.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className={`border-${statusInfo.type === 'success' ? 'green' : statusInfo.type === 'warning' ? 'yellow' : statusInfo.type === 'error' ? 'red' : 'blue'}-200 bg-${statusInfo.type === 'success' ? 'green' : statusInfo.type === 'warning' ? 'yellow' : statusInfo.type === 'error' ? 'red' : 'blue'}-50`}>
            <AlertDescription className="text-center">
              {statusInfo.description}
            </AlertDescription>
          </Alert>

          {inviteData.status === 'valid' && (
            <div className="space-y-4">
              <div className="bg-white/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">{inviteData.professorName}</p>
                    <p className="text-sm text-muted-foreground">Professor</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Convidou você para</p>
                    <p className="font-medium">Orbirq - Plataforma Educacional</p>
                  </div>
                </div>

                {inviteData.expiresAt && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Expira em</p>
                      <p className="font-medium">
                        {new Date(inviteData.expiresAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {currentUser && currentUser.role === 'aluno' && (
                <Alert className="border-blue-200 bg-blue-50">
                  <UserCheck className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Olá, {currentUser.nome}!</strong> Você está logado como aluno.
                    Ao aceitar este convite, será vinculado ao professor {inviteData.professorName}.
                  </AlertDescription>
                </Alert>
              )}

              {currentUser && currentUser.role !== 'aluno' && (
                <Alert className="border-orange-200 bg-orange-50">
                  <Crown className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Olá, {currentUser.nome}!</strong> Você está logado como {currentUser.role}.
                    Para aceitar convites, faça login com uma conta de aluno.
                  </AlertDescription>
                </Alert>
              )}

              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  O que você pode fazer na Orbirq:
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Responder questões e testes</li>
                  <li>• Acompanhar seu desempenho</li>
                  <li>• Receber feedback personalizado</li>
                  <li>• Participar de turmas virtuais</li>
                </ul>
              </div>

              <div className="flex gap-3">
                {currentUser ? (
                  // Usuário logado
                  currentUser.role === 'aluno' ? (
                    <Button
                      onClick={acceptInvite}
                      disabled={accepting}
                      className="flex-1"
                    >
                      {accepting ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Aceitando...
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4 mr-2" />
                          Aceitar Convite
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={acceptInvite}
                      disabled={accepting}
                      className="flex-1"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Continuar como {currentUser.role}
                    </Button>
                  )
                ) : (
                  // Usuário não logado
                  <>
                    <Button
                      onClick={acceptInvite}
                      disabled={accepting}
                      className="flex-1"
                    >
                      {accepting ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Criando conta...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Criar Conta
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => navigate('/login')}
                      className="flex-1"
                    >
                      Já tenho conta
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {inviteData.status !== 'valid' && (
            <div className="text-center space-y-4">
              <Button onClick={() => navigate('/login')}>
                Ir para Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}