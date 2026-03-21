/**
 * Tipos compartilhados da API
 */
import { Request } from "express";

export type Role = "ADMIN" | "COORDINATOR" | "MEMBER";

// ─── Autenticação ─────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// ─── Respostas padronizadas ───────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Parâmetros de paginação ─────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}
