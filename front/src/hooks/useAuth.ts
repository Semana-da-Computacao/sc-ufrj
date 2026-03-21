/**
 * Hook de autenticação
 * Encapsula lógica de login/logout e redireciona conforme o papel do usuário:
 * - ADMIN / COORDINATOR → /admin/dashboard
 * - MEMBER              → /user/dashboard
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { LoginResponse } from "@/types";

export function useAuth() {
  const { user, isAuthenticated, isAdmin, isAdminOrCoordinator, setAuth, clearAuth } =
    useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post<{ success: boolean; data: LoginResponse }>(
        "/auth/login",
        { email, password }
      );
      const { user, accessToken, refreshToken } = data.data;
      setAuth(user, accessToken, refreshToken);

      // Redireciona conforme papel
      const destination =
        user.role === "ADMIN" || user.role === "COORDINATOR"
          ? "/admin/dashboard"
          : "/user/dashboard";
      navigate(destination, { replace: true });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Credenciais inválidas";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch {
      // Ignora erro no servidor — limpa localmente de qualquer forma
    } finally {
      clearAuth();
      navigate("/login", { replace: true });
    }
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    isAdminOrCoordinator: isAdminOrCoordinator(),
  };
}
