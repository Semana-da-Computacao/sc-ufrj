/**
 * Cliente HTTP da API
 * Axios com interceptores para refresh token automático
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ─── Interceptor de request ────────────────────────────────────────────────────
// Injeta o access token em todas as requisições autenticadas
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Interceptor de response ───────────────────────────────────────────────────
// Tenta renovar o access token automaticamente quando recebe 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Não tenta refresh na rota de refresh (evita loop infinito)
    if (originalRequest.url?.includes("/auth/refresh")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    try {
      const { data } = await api.post("/auth/refresh", { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      api.defaults.headers.Authorization = `Bearer ${accessToken}`;
      processQueue(null, accessToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
