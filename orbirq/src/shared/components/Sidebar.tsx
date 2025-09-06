"use client"

import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  BookOpen,
  FileText,
  Upload,
  Users,
  BarChart3,
  LineChart,
  Trophy,
  ClipboardList,
  GraduationCap,
  CheckSquare,
  PieChart,
  Bell,
  MessageSquare,
  MessageCircle,
  Settings,
  Crown,
  UserCog,
  Library,
  CalendarDays,
  History,
  Info,
  Headphones,
} from "lucide-react"

type SidebarProps = {
  role: "professor" | "aluno"
  onClose: () => void
}

export default function Sidebar({ role, onClose }: SidebarProps) {
  const navigate = useNavigate()

  const professorMenu = [
    {
      title: "🎫 Convites",
      children: [
        { label: "Gerenciar Convites", icon: Crown, path: "/dashboard/professor/invites" },
      ],
    },
    {
      title: "📚 Questões & Conteúdo",
      children: [
        { label: "Criar Questões", icon: FileText, path: "/questoes/nova" },
        { label: "Ver Questões Criadas", icon: BookOpen, path: "/questoes" },
        { label: "Banco de Questões", icon: ClipboardList, path: "/questoes" },
        { label: "Importar/Exportar Questões", icon: Upload, path: "/questoes/importar" },
      ],
    },
    {
      title: "👨‍🎓 Alunos",
      children: [
        { label: "Desempenho Geral", icon: BarChart3, path: "/dashboard/professor/desempenho-geral" },
        { label: "Desempenho Individual", icon: LineChart, path: "/dashboard/professor/desempenho-individual" },
        { label: "Desempenho por Disciplina", icon: PieChart, path: "/dashboard/professor/desempenho-disciplina" },
        { label: "Desempenho por Matéria", icon: BookOpen, path: "/dashboard/professor/desempenho-materia" },
        { label: "Ranking de Alunos", icon: Trophy, path: "/dashboard/professor/ranking" },
        { label: "Relatórios Exportáveis", icon: ClipboardList, path: "/dashboard/professor/relatorios" },
      ],
    },
    {
      title: "🏫 Turmas",
      children: [
        { label: "Gerenciar Turmas", icon: Users, path: "/turmas" },
        { label: "Atribuir Questões/Provas", icon: CheckSquare, path: "/turmas/atribuir" },
        { label: "Estatísticas da Turma", icon: BarChart3, path: "/turmas/estatisticas" },
        { label: "Presença & Frequência", icon: GraduationCap, path: "/turmas/presenca" },
      ],
    },
    {
      title: "📊 Relatórios & Insights",
      children: [
        { label: "Relatório de Desempenho", icon: BarChart3, path: "/relatorios/desempenho" },
        { label: "Comparativo entre turmas/disciplina", icon: LineChart, path: "/relatorios/comparativo" },
        { label: "Sugestões de melhoria (IA)", icon: Crown, path: "/relatorios/ia" },
      ],
    },
    {
      title: "🔔 Comunicação",
      children: [
        { label: "Notificações", icon: Bell, path: "/notificacoes" },
        { label: "Mensagens", icon: MessageSquare, path: "/mensagens" },
        { label: "Fórum da Turma", icon: MessageCircle, path: "/forum" },
      ],
    },
    {
      title: "⚙️ Administração / Premium",
      children: [
        { label: "Configurações da Conta", icon: Settings, path: "/configuracoes" },
        { label: "Planos & Assinaturas", icon: Crown, path: "/planos" },
        { label: "Gestão de Professores/Alunos", icon: UserCog, path: "/gestao" },
      ],
    },
    {
      title: "📥 Recursos Extras",
      children: [
        { label: "Biblioteca de Materiais", icon: Library, path: "/biblioteca" },
        { label: "Agenda / Calendário", icon: CalendarDays, path: "/agenda" },
        { label: "Histórico de Provas", icon: History, path: "/provas/historico" },
      ],
    },
    { title: "Sobre", children: [{ label: "Informações", icon: Info, path: "/sobre" }] },
    { title: "Suporte", children: [{ label: "Ajuda e Contato", icon: Headphones, path: "/suporte" }] },
  ]

  const alunoMenu = [
    {
      title: "📚 Questões & Conteúdo",
      children: [
        { label: "Ver Questões", icon: BookOpen, path: "/questoes" },
        { label: "Banco de Questões", icon: ClipboardList, path: "/questoes" },
      ],
    },
    {
      title: "👨‍🎓 Desempenho",
      children: [
        { label: "Desempenho Geral", icon: BarChart3, path: "/dashboard/aluno/desempenho-geral" },
        { label: "Desempenho Individual", icon: LineChart, path: "/dashboard/aluno/desempenho-individual" },
        { label: "Desempenho por Disciplina", icon: PieChart, path: "/dashboard/aluno/desempenho-disciplina" },
        { label: "Desempenho por Matéria", icon: BookOpen, path: "/dashboard/aluno/desempenho-materia" },
        { label: "Ranking", icon: Trophy, path: "/dashboard/aluno/ranking" },
      ],
    },
    {
      title: "🔔 Comunicação",
      children: [
        { label: "Notificações", icon: Bell, path: "/notificacoes" },
        { label: "Mensagens", icon: MessageSquare, path: "/mensagens" },
        { label: "Fórum da Turma", icon: MessageCircle, path: "/forum" },
      ],
    },
    {
      title: "📥 Recursos Extras",
      children: [
        { label: "Biblioteca de Materiais", icon: Library, path: "/biblioteca" },
        { label: "Agenda / Calendário", icon: CalendarDays, path: "/agenda" },
        { label: "Histórico de Provas", icon: History, path: "/provas/historico" },
      ],
    },
    { title: "Sobre", children: [{ label: "Informações", icon: Info, path: "/sobre" }] },
    { title: "Suporte", children: [{ label: "Ajuda e Contato", icon: Headphones, path: "/suporte" }] },
  ]

  const menuItems = role === "professor" ? professorMenu : alunoMenu

  return (
    <motion.aside
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl border-r border-gray-200 p-6 overflow-y-auto"
    >
      <h2 className="text-xl font-bold mb-6">📌 Menu</h2>
      <nav className="space-y-6">
        {menuItems.map((item) => (
          <div key={item.title}>
            <p className="font-semibold text-gray-900">{item.title}</p>
            {item.children && (
              <ul className="ml-4 mt-3 space-y-3 text-sm text-gray-700">
                {item.children.map((subItem) => (
                  <li
                    key={subItem.label}
                    className="flex items-center gap-2 cursor-pointer hover:text-primary hover:font-medium transition"
                    onClick={() => {
                      if (subItem.path) navigate(subItem.path)
                      onClose()
                    }}
                  >
                    <subItem.icon className="w-4 h-4 text-gray-500" />
                    {subItem.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </motion.aside>
  )
}
