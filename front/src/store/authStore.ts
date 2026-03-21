/**
 * Store de autenticação global (Zustand)
 * Persiste tokens no localStorage e mantém o estado do usuário autenticado
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthUser } from "@/types";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;

  // Ações
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<AuthUser>) => void;

  // Getters computados
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
  isAdminOrCoordinator: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setAuth: (user, accessToken, refreshToken) => {
        // Persiste tokens no localStorage para o interceptor axios usar
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        set({ user, accessToken, refreshToken });
      },

      clearAuth: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ user: null, accessToken: null, refreshToken: null });
      },

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),

      isAuthenticated: () => !!get().user && !!get().accessToken,
      isAdmin: () => get().user?.role === "ADMIN",
      isAdminOrCoordinator: () =>
        get().user?.role === "ADMIN" || get().user?.role === "COORDINATOR",
    }),
    {
      name: "sc-ufrj-auth",
      // Persiste apenas os dados relevantes, não as funções
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
