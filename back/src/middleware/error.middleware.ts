/**
 * Middleware global de tratamento de erros
 * Captura erros não tratados e retorna resposta padronizada
 */
import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Erros do Prisma — conflito de unique constraint
  if (err.message.includes("Unique constraint")) {
    res.status(409).json({
      success: false,
      error: "Registro já existe com esses dados",
    });
    return;
  }

  // Erro genérico — não expõe detalhes em produção
  res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Erro interno do servidor",
  });
}
