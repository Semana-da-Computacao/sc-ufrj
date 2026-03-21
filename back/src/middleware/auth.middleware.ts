/**
 * Middleware de autenticação JWT
 * Valida o access token e injeta o usuário na requisição
 */
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JwtPayload } from "../types";

/**
 * Verifica e decodifica o JWT do header Authorization
 * Injeta `req.user` com os dados do token
 */
export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "Token não fornecido" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || "fallback_secret"
    ) as JwtPayload;

    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, error: "Token expirado" });
    } else {
      res.status(401).json({ success: false, error: "Token inválido" });
    }
  }
}

/**
 * Middleware opcional — não bloqueia se não houver token
 * Útil para rotas públicas que têm comportamento diferente para usuários autenticados
 */
export function optionalAuthenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET || "fallback_secret"
      ) as JwtPayload;
      req.user = payload;
    } catch {
      // Token inválido ou expirado — ignora e continua sem usuário
    }
  }

  next();
}
