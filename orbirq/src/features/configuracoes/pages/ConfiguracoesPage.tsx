import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  Bell,
  Shield,
  Palette,
  Settings as SettingsIcon,
  Save,
  Upload,
  Eye,
  EyeOff
} from "lucide-react"

export default function ConfiguracoesPage() {
  const [profile, setProfile] = useState({
    nome: "João Silva",
    email: "joao@email.com",
    telefone: "",
    bio: "",
    avatar: ""
  })

  const [notifications, setNotifications] = useState({
    emailQuestoes: true,
    emailRespostas: true,
    pushQuestoes: false,
    pushMensagens: true,
    smsUrgente: false
  })

  const [privacy, setPrivacy] = useState({
    perfilPublico: true,
    mostrarEstatisticas: true,
    permitirMensagens: true,
    linkPermanenteAtivo: true
  })

  const [theme, setTheme] = useState("light")

  const [password, setPassword] = useState({
    atual: "",
    nova: "",
    confirmar: ""
  })

  const [showPasswords, setShowPasswords] = useState({
    atual: false,
    nova: false,
    confirmar: false
  })

  const salvarPerfil = () => {
    console.log("Salvando perfil:", profile)
    // TODO: Implementar API
    alert("Perfil salvo com sucesso!")
  }

  const salvarNotificacoes = () => {
    console.log("Salvando notificações:", notifications)
    // TODO: Implementar API
    alert("Notificações salvas com sucesso!")
  }

  const salvarPrivacidade = () => {
    console.log("Salvando privacidade:", privacy)
    // TODO: Implementar API
    alert("Configurações de privacidade salvas!")
  }

  const alterarSenha = () => {
    if (password.nova !== password.confirmar) {
      alert("As senhas não coincidem!")
      return
    }
    console.log("Alterando senha")
    // TODO: Implementar API
    alert("Senha alterada com sucesso!")
    setPassword({ atual: "", nova: "", confirmar: "" })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Configurações</h1>
      </div>

      <Tabs defaultValue="perfil" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="privacidade">Privacidade</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
        </TabsList>

        {/* Perfil */}
        <TabsContent value="perfil" className="space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações do Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar} alt={profile.nome} />
                  <AvatarFallback className="text-lg">
                    {profile.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Alterar Foto
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG ou GIF. Máx. 2MB
                  </p>
                </div>
              </div>

              {/* Campos do perfil */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={profile.nome}
                    onChange={(e) => setProfile({...profile, nome: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={profile.telefone}
                    onChange={(e) => setProfile({...profile, telefone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    placeholder="Conte um pouco sobre você"
                  />
                </div>
              </div>

              <Button onClick={salvarPerfil}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notificacoes" className="space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Preferências de Notificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Notificações por Email</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Novas questões</p>
                      <p className="text-sm text-muted-foreground">
                        Receber email quando novas questões forem criadas
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailQuestoes}
                      onCheckedChange={(checked) =>
                        setNotifications({...notifications, emailQuestoes: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Respostas dos alunos</p>
                      <p className="text-sm text-muted-foreground">
                        Receber email quando alunos responderem questões
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailRespostas}
                      onCheckedChange={(checked) =>
                        setNotifications({...notifications, emailRespostas: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Notificações Push</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Atividades dos alunos</p>
                      <p className="text-sm text-muted-foreground">
                        Notificações sobre atividades dos alunos
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushQuestoes}
                      onCheckedChange={(checked) =>
                        setNotifications({...notifications, pushQuestoes: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mensagens</p>
                      <p className="text-sm text-muted-foreground">
                        Notificações de novas mensagens
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushMensagens}
                      onCheckedChange={(checked) =>
                        setNotifications({...notifications, pushMensagens: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <Button onClick={salvarNotificacoes}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Preferências
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacidade */}
        <TabsContent value="privacidade" className="space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configurações de Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Controle quem pode ver suas informações e interagir com seu perfil.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Perfil Público</p>
                    <p className="text-sm text-muted-foreground">
                      Permitir que outros usuários vejam seu perfil
                    </p>
                  </div>
                  <Switch
                    checked={privacy.perfilPublico}
                    onCheckedChange={(checked) =>
                      setPrivacy({...privacy, perfilPublico: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mostrar Estatísticas</p>
                    <p className="text-sm text-muted-foreground">
                      Exibir estatísticas de desempenho no perfil
                    </p>
                  </div>
                  <Switch
                    checked={privacy.mostrarEstatisticas}
                    onCheckedChange={(checked) =>
                      setPrivacy({...privacy, mostrarEstatisticas: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Permitir Mensagens</p>
                    <p className="text-sm text-muted-foreground">
                      Permitir que outros usuários enviem mensagens
                    </p>
                  </div>
                  <Switch
                    checked={privacy.permitirMensagens}
                    onCheckedChange={(checked) =>
                      setPrivacy({...privacy, permitirMensagens: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Link Permanente Ativo</p>
                    <p className="text-sm text-muted-foreground">
                      Manter link de convite permanente ativo
                    </p>
                  </div>
                  <Switch
                    checked={privacy.linkPermanenteAtivo}
                    onCheckedChange={(checked) =>
                      setPrivacy({...privacy, linkPermanenteAtivo: checked})
                    }
                  />
                </div>
              </div>

              <Button onClick={salvarPrivacidade}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aparência */}
        <TabsContent value="aparencia" className="space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Aparência da Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="theme">Tema</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="auto">Automático</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <Palette className="h-4 w-4" />
                <AlertDescription>
                  As configurações de tema serão aplicadas em toda a plataforma.
                </AlertDescription>
              </Alert>

              <Button>
                <Save className="w-4 h-4 mr-2" />
                Aplicar Tema
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="seguranca" className="space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Segurança da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Mantenha sua conta segura alterando regularmente sua senha.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="senha-atual">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="senha-atual"
                      type={showPasswords.atual ? "text" : "password"}
                      value={password.atual}
                      onChange={(e) => setPassword({...password, atual: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPasswords({...showPasswords, atual: !showPasswords.atual})}
                    >
                      {showPasswords.atual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="nova-senha">Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="nova-senha"
                      type={showPasswords.nova ? "text" : "password"}
                      value={password.nova}
                      onChange={(e) => setPassword({...password, nova: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPasswords({...showPasswords, nova: !showPasswords.nova})}
                    >
                      {showPasswords.nova ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmar-senha"
                      type={showPasswords.confirmar ? "text" : "password"}
                      value={password.confirmar}
                      onChange={(e) => setPassword({...password, confirmar: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPasswords({...showPasswords, confirmar: !showPasswords.confirmar})}
                    >
                      {showPasswords.confirmar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <Button onClick={alterarSenha}>
                <Save className="w-4 h-4 mr-2" />
                Alterar Senha
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Sessões Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Sessão Atual</p>
                    <p className="text-sm text-muted-foreground">
                      Chrome no Windows • São Paulo, SP
                    </p>
                  </div>
                  <Badge>Atual</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}