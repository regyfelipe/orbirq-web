import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "../../features/auth/pages/Login"
import Register from "../../features/auth/pages/Register"
import ForgotPassword from "../../features/auth/pages/ForgotPassword"
import InvitePage from "../../features/auth/pages/InvitePage"
import PrivateRoute from "./PrivateRoute"

// Dashboards
import AdminDashboard from "../../features/dashboard/pages/AdminDashboard"
import ProfessorDashboard from "../../features/dashboard/pages/ProfessorDashboard"
import AlunoDashboard from "../../features/dashboard/pages/AlunoDashboard"
import ProfessorInvitesPage from "../../features/dashboard/pages/ProfessorInvitesPage"
import DashboardLayout from "../../features/dashboard/components/DashboardLayout"
import { AuthProvider } from "../../features/auth/components/AuthProvider"

// Questões
import CriarQuestaoPage from "../../features/questions/pages/CriarQuestaoPage"
import VerQuestoesPage from "../../features/questions/pages/VerQuestoesPage"

// Turmas
import GerenciarTurmasPage from "../../features/turmas/pages/GerenciarTurmasPage"

// Relatórios
import RelatoriosPage from "../../features/relatorios/pages/RelatoriosPage"

// Notificações
import NotificacoesPage from "../../features/notificacoes/pages/NotificacoesPage"

// Configurações
import ConfiguracoesPage from "../../features/configuracoes/pages/ConfiguracoesPage"

// 👇 importa o provider

function DashboardRedirect() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}")

  switch (usuario?.role) {
    case "admin":
      return (
        <DashboardLayout>
          <AdminDashboard />
        </DashboardLayout>
      )
    case "professor":
      return (
        <DashboardLayout>
          <ProfessorDashboard />
        </DashboardLayout>
      )
    case "aluno":
      return (
        <DashboardLayout>
          <AlunoDashboard />
        </DashboardLayout>
      )
    default:
      return <Navigate to="/login" replace />
  }
}

export default function AppRouter() {
  return (
    <AuthProvider> {/* ✅ envolve toda a aplicação */}
      <Router>
        <Routes>
          {/* Redireciona raiz para login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Rotas protegidas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardRedirect />
              </PrivateRoute>
            }
          />

          {/* Dashboard do Professor - Páginas específicas */}
          <Route
            path="/dashboard/professor/invites"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <ProfessorInvitesPage />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          {/* Questões */}
          <Route
            path="/questoes"
            element={
              <PrivateRoute>
                <VerQuestoesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/questoes/nova"
            element={
              <PrivateRoute>
                <CriarQuestaoPage />
              </PrivateRoute>
            }
          />

          {/* Turmas */}
          <Route
            path="/turmas"
            element={
              <PrivateRoute>
                <GerenciarTurmasPage />
              </PrivateRoute>
            }
          />

          {/* Relatórios */}
          <Route
            path="/relatorios"
            element={
              <PrivateRoute>
                <RelatoriosPage />
              </PrivateRoute>
            }
          />

          {/* Notificações */}
          <Route
            path="/notificacoes"
            element={
              <PrivateRoute>
                <NotificacoesPage />
              </PrivateRoute>
            }
          />

          {/* Configurações */}
          <Route
            path="/configuracoes"
            element={
              <PrivateRoute>
                <ConfiguracoesPage />
              </PrivateRoute>
            }
          />

          {/* Página de Convite para Alunos (Pública) */}
          <Route
            path="/invite/:token"
            element={<InvitePage />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
