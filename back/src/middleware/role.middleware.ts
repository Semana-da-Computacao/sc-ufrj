/**
 * Middleware de autorização por papel (role)
 * Deve ser usado após o middleware `authenticate`
 */
import { Response, NextFunction } from "express";
import { AuthRequest, Role } from "../types";

/**
 * Verifica se o usuário autenticado possui um dos papéis permitidos
 * @param roles Lista de papéis que têm acesso à rota
 */
export function authorize(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Não autenticado" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: "Permissão insuficiente para esta ação",
      });
      return;
    }

    next();
  };
}

/** Atalhos semânticos para os papéis mais comuns */
export const isAdmin = authorize("ADMIN");
export const isAdminOrCoordinator = authorize("ADMIN", "COORDINATOR");
export const isAnyRole = authorize("ADMIN", "COORDINATOR", "MEMBER");
