/**
 * Controller de Autenticação
 * Gerencia login, registro, renovação e revogação de tokens
 */
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import prisma from "../lib/prisma";
import { AuthRequest, JwtPayload } from "../types";
import { generateUserQRCode } from "../services/qrcode.service";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_DAYS = 7;

/** Gera um novo access token JWT */
function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES as jwt.SignOptions["expiresIn"],
  });
}

/** Gera e persiste um refresh token opaco no banco */
async function generateRefreshToken(userId: string): Promise<string> {
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_EXPIRES_DAYS);

  await prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  });

  return token;
}

// ─── POST /auth/register ──────────────────────────────────────────────────────
/**
 * Cadastro de novo membro
 * Qualquer pessoa pode se cadastrar como MEMBER
 */
export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password, cpf, phone, institution } = req.body;

  if (!name || !email || !password) {
    res
      .status(400)
      .json({ success: false, error: "Nome, email e senha são obrigatórios" });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ success: false, error: "Email já cadastrado" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, cpf, phone, institution },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      qrCodeToken: true,
    },
  });

  // Gera a URL do QR code do usuário
  const qrCodeUrl = await generateUserQRCode(user.qrCodeToken);

  res.status(201).json({
    success: true,
    message: "Cadastro realizado com sucesso",
    data: { ...user, qrCodeUrl },
  });
}

// ─── POST /auth/login ─────────────────────────────────────────────────────────
/**
 * Login com email e senha
 * Retorna access token (curto prazo) e refresh token (7 dias)
 */
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, error: "Email e senha são obrigatórios" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.isActive) {
    res.status(401).json({ success: false, error: "Credenciais inválidas" });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(401).json({ success: false, error: "Credenciais inválidas" });
    return;
  }

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role as import("../types").Role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(user.id);

  res.json({
    success: true,
    data: {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as import("../types").Role,
        qrCodeToken: user.qrCodeToken,
        avatarUrl: user.avatarUrl,
      },
    },
  });
}

// ─── POST /auth/refresh ───────────────────────────────────────────────────────
/**
 * Renova o access token usando o refresh token
 * O refresh token atual é invalidado e um novo é gerado (rotation)
 */
export async function refreshAccessToken(
  req: Request,
  res: Response
): Promise<void> {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res
      .status(400)
      .json({ success: false, error: "Refresh token não fornecido" });
    return;
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!stored || stored.expiresAt < new Date()) {
    // Token inválido ou expirado — limpa se existir
    if (stored) {
      await prisma.refreshToken.delete({ where: { id: stored.id } });
    }
    res.status(401).json({ success: false, error: "Refresh token inválido" });
    return;
  }

  if (!stored.user.isActive) {
    res.status(401).json({ success: false, error: "Usuário desativado" });
    return;
  }

  // Rotation: deleta o token usado e gera um novo par
  await prisma.refreshToken.delete({ where: { id: stored.id } });

  const payload: JwtPayload = {
    userId: stored.user.id,
    email: stored.user.email,
    role: stored.user.role as import("../types").Role,
  };

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = await generateRefreshToken(stored.user.id);

  res.json({
    success: true,
    data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
  });
}

// ─── POST /auth/logout ────────────────────────────────────────────────────────
/**
 * Logout — invalida o refresh token atual
 */
export async function logout(req: Request, res: Response): Promise<void> {
  const { refreshToken } = req.body;

  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }

  res.json({ success: true, message: "Logout realizado com sucesso" });
}

// ─── GET /auth/me ─────────────────────────────────────────────────────────────
/**
 * Retorna os dados do usuário autenticado
 */
export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      cpf: true,
      phone: true,
      institution: true,
      qrCodeToken: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  if (!user) {
    res.status(404).json({ success: false, error: "Usuário não encontrado" });
    return;
  }

  const qrCodeUrl = await generateUserQRCode(user.qrCodeToken);

  res.json({ success: true, data: { ...user, qrCodeUrl } });
}

// ─── PUT /auth/change-password ────────────────────────────────────────────────
/**
 * Troca a senha do usuário autenticado
 */
export async function changePassword(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ success: false, error: "Senhas não fornecidas" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
  });

  if (!user) {
    res.status(404).json({ success: false, error: "Usuário não encontrado" });
    return;
  }

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) {
    res.status(401).json({ success: false, error: "Senha atual incorreta" });
    return;
  }

  const hashedNew = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedNew },
  });

  // Invalida todos os refresh tokens do usuário
  await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

  res.json({
    success: true,
    message: "Senha alterada. Faça login novamente.",
  });
}
