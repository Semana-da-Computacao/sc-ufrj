/**
 * Roteamento principal da aplicação SC-UFRJ
 *
 * Estrutura de rotas:
 *   /              → Landing page geral (público)
 *   /:ano          → Landing page de uma edição (ex: /2026)
 *   /login         → Tela de login
 *   /cadastro      → Tela de cadastro
 *   /admin/*       → Painel admin/coordenador (protegido)
 *   /user/*        → Painel do participante (protegido)
 */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ── Layouts ──
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { UserLayout } from "@/components/layout/UserLayout";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";

// ── Páginas públicas ──
import { LandingPage } from "@/pages/public/LandingPage";
import { YearPage } from "@/pages/public/YearPage";

// ── Auth ──
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";

// ── Admin ──
import { DashboardPage } from "@/pages/admin/DashboardPage";
import { EventsPage } from "@/pages/admin/EventsPage";
import { EventDetailPage } from "@/pages/admin/EventDetailPage";
import { CheckInPage } from "@/pages/admin/CheckInPage";
import { UsersPage } from "@/pages/admin/UsersPage";
import { CertificatesPage } from "@/pages/admin/CertificatesPage";

// ── User (participante) ──
import { UserDashboardPage } from "@/pages/user/UserDashboardPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 min de cache
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* ── Páginas públicas com header/footer ── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            {/* /:ano DEVE vir após todas as rotas estáticas para não capturá-las */}
            <Route path="/:ano" element={<YearPage />} />
          </Route>

          {/* ── Auth (sem layout de painel) ── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />

          {/* ── Painel Admin / Coordenador ── */}
          <Route element={<ProtectedRoute roles={["ADMIN", "COORDINATOR"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="eventos" element={<EventsPage />} />
              <Route path="eventos/:id" element={<EventDetailPage />} />

              {/* Admin + Coordenador */}
              <Route path="checkin" element={<CheckInPage />} />
              <Route path="certificados" element={<CertificatesPage />} />

              {/* Apenas Admin */}
              <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
                <Route path="usuarios" element={<UsersPage />} />
              </Route>
            </Route>
          </Route>

          {/* ── Painel do Participante ── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<Navigate to="/user/dashboard" replace />} />
              <Route path="dashboard" element={<UserDashboardPage />} />
              {/* Rotas futuras: /user/eventos, /user/qrcode, /user/certificados */}
              <Route path="eventos" element={<UserDashboardPage />} />
              <Route path="qrcode" element={<UserDashboardPage />} />
              <Route path="certificados" element={<UserDashboardPage />} />
            </Route>
          </Route>

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
