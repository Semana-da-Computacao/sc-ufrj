/**
 * Componente de rota protegida
 * - Se não autenticado → redireciona para /login
 * - Se autenticado mas sem permissão → redireciona para /user/dashboard
 */
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Role } from "@/types";

interface ProtectedRouteProps {
  /** Roles permitidos. Se vazio, qualquer autenticado pode acessar. */
  roles?: Role[];
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Role insuficiente — leva ao painel do usuário em vez de mostrar erro
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <Outlet />;
}
