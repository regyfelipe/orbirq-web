import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getAlunoDashboard,
  getAlunoConquistas,
  getAtividadeRecente,
  getRecomendacoesIA,
  getPrevisaoAprovacao,
  getStreaks,
  getAgendaEstudo,
  getAlertasFadiga,
  getJornadaAprendizado,
  getMapaForca,
  resetarConquistas,
  type AlunoDashboardData,
  type ConquistasData,
  type AtividadeRecente,
  type RecomendacaoIA,
  type PrevisaoAprovacao,
  type StreaksData,
  type AgendaItem,
  type AlertaFadiga,
  type JornadaItem,
  type MapaForcaItem,
  type ComparativoTurma
} from "../services/dashboardService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Flame,
  Star,
  Calendar,
  Bell,
  Download,
  Share2,
  Zap,
  Brain,
  Heart,
  Users,
  Award,
  BookOpen,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

// Types for enhanced dashboard features

// Dados serão carregados dinamicamente do banco

// Função para formatar tempo (minutos e segundos)
function toMinSec(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}m ${s}s`;
}

// Componente para mensagens personalizadas
function PersonalizedMessage({ type, name, metric }: { type: string; name: string; metric?: number }) {
  const messages = {
    welcome: `Olá, ${name}! Pronto para mais uma jornada de aprendizado? 🚀`,
    streak: `Incrível, ${name}! Você está em uma sequência de ${metric} dias! 🔥`,
    achievement: `Parabéns, ${name}! Você desbloqueou uma nova conquista! 🏆`,
    low_performance: `${name}, vamos juntos melhorar seu desempenho? 💪`,
    high_performance: `Fantástico, ${name}! Você está arrasando! 🌟`
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200"
    >
      <p className="text-blue-800 font-medium">{messages[type as keyof typeof messages]}</p>
    </motion.div>
  );
}

export default function AlunoDashboard() {
  const [data, setData] = useState<AlunoDashboardData | null>(null);
  const [conquistas, setConquistas] = useState<ConquistasData | null>(null);
  const [atividadeRecente, setAtividadeRecente] = useState<AtividadeRecente[]>([]);
  const [recomendacoesIA, setRecomendacoesIA] = useState<RecomendacaoIA[]>([]);
  const [previsaoAprovacao, setPrevisaoAprovacao] = useState<number>(75);
  const [streaks, setStreaks] = useState<StreaksData>({ dias: 5, recorde: 12 });
  const [agendaEstudo, setAgendaEstudo] = useState<AgendaItem[]>([]);
  const [alertasFadiga, setAlertasFadiga] = useState<AlertaFadiga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userData, setUserData] = useState<any>({
    foto: null,
    taxaAcerto: 0,
    questoesRespondidas: 0,
    tempoMedio: 0,
    level: 1,
    xp: 0
  });
  const [journeyData, setJourneyData] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [achievementNotifications, setAchievementNotifications] = useState<string[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Verificar autenticação básica
        const token = localStorage.getItem('token');
        const usuarioSalvo = localStorage.getItem('usuario');

        if (!token || !usuarioSalvo) {
          setError('Usuário não está logado ou sessão expirou. Faça login novamente para ver seus dados.');
          setLoading(false);
          return;
        }

        // Verificar se o token não expirou (básico)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          if (payload.exp && payload.exp < currentTime) {
            setError('Sessão expirada. Faça login novamente.');
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            setLoading(false);
            return;
          }
        } catch {
          setError('Token inválido. Faça login novamente.');
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          setLoading(false);
          return;
        }

        // Carregar dados básicos do dashboard
        const dashboardData = await getAlunoDashboard();
        console.log('📊 [DASHBOARD] Dados básicos recebidos:', {
          taxaAcertoGeral: dashboardData?.taxaAcertoGeral,
          tempoMedioRespostaSegundos: dashboardData?.tempoMedioRespostaSegundos,
          respostasCorretas: dashboardData?.respostasCorretas,
          respostasErradas: dashboardData?.respostasErradas,
          totalQuestoes: (dashboardData?.respostasCorretas || 0) + (dashboardData?.respostasErradas || 0),
          acertoPorDisciplina: dashboardData?.acertoPorDisciplina,
          recomendadas: dashboardData?.recomendadas,
          desempenhoTempo: dashboardData?.desempenhoTempo
        });

        // Verificar se os dados estão sendo retornados corretamente
        if (!dashboardData) {
          throw new Error('Não foi possível carregar os dados do dashboard. Verifique se você está logado.');
        }

        setData(dashboardData);

        // Set user data from dashboard data
        const questoesRespondidas = dashboardData?.respostasCorretas + dashboardData?.respostasErradas || 0;
        const userDataCalculated = {
          foto: null, // Will be loaded from user profile if available
          taxaAcerto: questoesRespondidas > 0 ? Math.round((dashboardData?.taxaAcertoGeral || 0) * 100) : 0,
          questoesRespondidas: questoesRespondidas,
          tempoMedio: Math.round(dashboardData?.tempoMedioRespostaSegundos || 0),
          level: 1,
          xp: questoesRespondidas * 10
        };
        console.log('👤 [USER DATA] Dados calculados para exibição:', userDataCalculated);
        setUserData(userDataCalculated);

        // Set user name from authenticated user
        const usuarioLogado = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
        setUserName(usuarioLogado?.nome_completo || usuarioLogado?.nome || "Estudante");
        console.log('👤 [USER NAME] Nome definido:', usuarioLogado?.nome_completo || usuarioLogado?.nome || "Estudante");

        // Carregar conquistas
        console.log('🏆 [CONQUISTAS] Carregando conquistas...');
        try {
          const conquistasData = await getAlunoConquistas();
          console.log('🏆 [CONQUISTAS] Dados recebidos:', conquistasData);
          setConquistas(conquistasData);
        } catch (e) {
          console.warn('Erro ao carregar conquistas:', e);
          setConquistas({
            questoesRespondidas: 0,
            taxaAcertoGeral: 0,
            sequenciaAtual: 0,
            nivel: 0
          });
        }

        // Carregar atividade recente
        console.log('📅 [ATIVIDADE] Carregando atividade recente...');
        try {
          const atividadeData = await getAtividadeRecente(5);
          console.log('📅 [ATIVIDADE] Dados recebidos:', atividadeData);
          setAtividadeRecente(atividadeData || []);
        } catch (e) {
          console.warn('Erro ao carregar atividade recente:', e);
          setAtividadeRecente([]);
        }

        // Carregar dados reais do banco (sem fallbacks mock)
        console.log('🤖 [IA] Carregando recomendações IA...');
        console.log('🎯 [PREVISÃO] Carregando previsão de aprovação...');
        console.log('🔥 [STREAKS] Carregando dados de streaks...');
        console.log('📅 [AGENDA] Carregando agenda de estudo...');
        console.log('⚠️ [ALERTAS] Carregando alertas de fadiga...');
        console.log('📈 [JORNADA] Carregando jornada de aprendizado...');
        console.log('🗺️ [MAPA] Carregando mapa de força...');

        try {
          const [recs, prev, strks, agenda, alertas, jornada, mapa] = await Promise.all([
            getRecomendacoesIA(),
            getPrevisaoAprovacao(),
            getStreaks(),
            getAgendaEstudo(),
            getAlertasFadiga(),
            getJornadaAprendizado(),
            getMapaForca()
          ]);

          console.log('🤖 [IA] Recomendações recebidas:', recs);
          console.log('🎯 [PREVISÃO] Previsão recebida:', prev);
          console.log('🔥 [STREAKS] Streaks recebidos:', strks);
          console.log('📅 [AGENDA] Agenda recebida:', agenda);
          console.log('⚠️ [ALERTAS] Alertas recebidos:', alertas);
          console.log('📈 [JORNADA] Jornada recebida:', jornada);
          console.log('🗺️ [MAPA] Mapa de força recebido:', mapa);

          // Usar apenas dados reais do banco
          setRecomendacoesIA(recs || []);
          setPrevisaoAprovacao(prev?.previsao || 0);
          setStreaks(strks || { dias: 0, recorde: 0 });
          setAgendaEstudo(agenda || []);
          setAlertasFadiga(alertas || []);
          setJourneyData(jornada || []);
          setHeatmapData(mapa || []);

          console.log('✅ [DASHBOARD] Todos os dados carregados com sucesso!');
          console.log('📊 [RESUMO] Status dos dados:', {
            dashboardBasico: !!dashboardData,
            recomendacoesIA: recs?.length || 0,
            previsaoAprovacao: prev?.previsao || 0,
            streaks: strks,
            agendaEstudo: agenda?.length || 0,
            alertasFadiga: alertas?.length || 0,
            jornadaAprendizado: jornada?.length || 0,
            mapaForca: mapa?.length || 0
          });
        } catch (e) {
          console.warn('Erro ao carregar dados avançados:', e);
          // Sem fallbacks - dados ficam vazios se não conseguir carregar
          setRecomendacoesIA([]);
          setPrevisaoAprovacao(0);
          setStreaks({ dias: 0, recorde: 0 });
          setAgendaEstudo([]);
          setAlertasFadiga([]);
          setJourneyData([]);
          setHeatmapData([]);
        }

      } catch (e) {
        console.error('Erro crítico ao carregar dashboard:', e);

        // Verificar se é erro de autenticação
        if (e instanceof Error && e.message.includes('401')) {
          setError('Sessão expirada. Faça login novamente.');
        } else if (e instanceof Error && e.message.includes('Token')) {
          setError('Token inválido. Faça login novamente.');
        } else {
          setError(e instanceof Error ? e.message : "Erro ao carregar dashboard");
        }

        // Dados vazios como fallback
        setData({
          taxaAcertoGeral: 0,
          tempoMedioRespostaSegundos: 0,
          respostasCorretas: 0,
          respostasErradas: 0,
          acertoPorDisciplina: [],
          recomendadas: [],
          desempenhoTempo: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return (
    <div className="p-6 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
      />
    </div>
  );

  if (error) return (
    <div className="p-6 max-w-md mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erro ao carregar dashboard</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  if (!data) return null;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header com Avatar e Mensagem Personalizada */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={userData?.foto || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
              {userName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Olá, {userName}! 👋</h1>
            <p className="text-gray-600">Seu mentor digital de aprendizado</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResetConfirm(true)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            🔄 Resetar Conquistas
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </motion.div>

      {/* Mensagem Personalizada */}
      <PersonalizedMessage type="welcome" name={userName} />

      {/* KPIs Essenciais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-700 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Taxa de Acerto Global
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-800">
              {userData.taxaAcerto}%
            </p>
            <p className="text-xs text-green-600 mt-1">Baseado em {userData.questoesRespondidas} respostas</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Tempo Médio/Resposta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-800">
              {toMinSec(userData.tempoMedio)}
            </p>
            <p className="text-xs text-blue-600 mt-1">Média das {userData.questoesRespondidas} respostas</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-700 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Questões Respondidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-800">
              {userData.questoesRespondidas}
            </p>
            <p className="text-xs text-purple-600 mt-1">Total de respostas no sistema</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-orange-700 flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Sequência Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-800">
              {userData.level} nível
            </p>
            <p className="text-xs text-orange-600 mt-1">{userData.xp} XP acumulados</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Jornada e Progresso */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Gráfico de Evolução */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Sua Jornada de Aprendizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={journeyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="acertos"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mapa de Calor de Desempenho */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Mapa de Força por Disciplina
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(heatmapData || []).map((item) => (
              <div key={item.disciplina} className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.disciplina}</span>
                <div className="flex items-center gap-2">
                  <Progress
                    value={item.desempenho}
                    className="w-20"
                  />
                  <Badge
                    variant={item.status === 'forte' ? 'default' : item.status === 'medio' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {item.desempenho}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* IA Preditiva e Engajamento */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Recomendações IA */}
        <Card className="rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-800">
              <Zap className="w-5 h-5" />
              Recomendações IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(recomendacoesIA || []).slice(0, 3).map((rec, index) => (
              <div key={index} className="p-3 bg-white/50 rounded-lg">
                <p className="text-sm font-medium text-cyan-900">{rec.titulo}</p>
                <p className="text-xs text-cyan-700">{rec.descricao}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Previsão de Aprovação */}
        <Card className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Trophy className="w-5 h-5" />
              Previsão de Aprovação
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray={`${previsaoAprovacao}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-800">{previsaoAprovacao}%</span>
              </div>
            </div>
            <p className="text-sm text-emerald-700">Baseado no seu desempenho atual</p>
          </CardContent>
        </Card>

        {/* Conquistas e Gamificação */}
        <Card className="rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Award className="w-5 h-5" />
              Suas Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Nível Atual</span>
              <Badge className="bg-orange-500">{conquistas?.nivel ?? 1}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">XP Total</span>
              <span className="font-bold">{(conquistas?.questoesRespondidas ?? 0) * 10} XP</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Próximo nível</span>
                <span>750/1000 XP</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Atividade Recente e Rotina Automatizada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Atividade Recente Aprimorada */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {atividadeRecente.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma atividade recente. Que tal começar agora? 🚀
              </p>
            )}

            <div className="space-y-3">
              {(atividadeRecente || []).map((atividade, index) => (
                <motion.div
                  key={atividade.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{atividade.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {atividade.time}
                      {atividade.questoes && ` • ${atividade.acertos}/${atividade.questoes} corretas`}
                    </p>
                  </div>
                  {atividade.acertos === atividade.questoes && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Star className="w-5 h-5 text-yellow-500" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agenda de Estudo e Alertas */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Sua Agenda de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {agendaEstudo.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum estudo agendado. Vamos planejar sua rotina? 📅
              </p>
            ) : (
              (agendaEstudo || []).map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.titulo}</p>
                    <p className="text-xs text-muted-foreground">{item.horario}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Iniciar
                  </Button>
                </div>
              ))
            )}

            {/* Alertas de Fadiga */}
            {alertasFadiga.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800 font-medium">Alerta de Fadiga Cognitiva</p>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Você estudou por 3h seguidas. Que tal uma pausa de 15min? ☕
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Engajamento Social e Integrações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Comparativo Social */}
        <Card className="rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-800">
              <Users className="w-5 h-5" />
              Como você está na turma?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-800">Top 15%</p>
              <p className="text-sm text-pink-600">da sua turma</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Você</span>
                <span>85%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Média da Turma</span>
                <span>72%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Top 3</span>
                <span>92%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integrações e Ações Rápidas */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Ações e Integrações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Sincronizar com Google Calendar
            </Button>
            <Button className="w-full" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar Relatório PDF
            </Button>
            <Button className="w-full" variant="outline">
              <Bell className="w-4 h-4 mr-2" />
              Configurar Notificações
            </Button>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Heart className="w-4 h-4 mr-2" />
              Convidar Amigos
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievement Notifications */}
      {achievementNotifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50 space-y-2"
        >
          {achievementNotifications.map((notification, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-3 rounded-lg shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span className="font-medium">{notification}</span>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resetar Conquistas
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja resetar todas as suas conquistas? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  try {
                    const usuarioSalvo = localStorage.getItem('usuario');
                    if (usuarioSalvo) {
                      const usuario = JSON.parse(usuarioSalvo);
                      await resetarConquistas(usuario.id);
                      setConquistas({
                        questoesRespondidas: 0,
                        taxaAcertoGeral: 0,
                        sequenciaAtual: 0,
                        nivel: 1
                      });
                      setAchievementNotifications(['Conquistas resetadas com sucesso!']);
                      setTimeout(() => setAchievementNotifications([]), 3000);
                    }
                  } catch (error) {
                    console.error('Erro ao resetar conquistas:', error);
                    setAchievementNotifications(['Erro ao resetar conquistas']);
                    setTimeout(() => setAchievementNotifications([]), 3000);
                  }
                  setShowResetConfirm(false);
                }}
                className="flex-1"
              >
                Resetar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}


