/**
 * Controller de Usuários
 * Gerenciamento de membros pelo admin
 */
import { Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { AuthRequest } from "../types";
import { generateUserQRCode } from "../services/qrcode.service";

// ─── GET /users ───────────────────────────────────────────────────────────────
/**
 * Lista todos os usuários com paginação e busca
 */
export async function listUsers(req: AuthRequest, res: Response): Promise<void> {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const search = req.query.search ? String(req.query.search) : undefined;
  const role = req.query.role ? String(req.query.role) : undefined;

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {}),
    ...(role ? { role: role as "ADMIN" | "COORDINATOR" | "MEMBER" } : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        institution: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { registrations: true, certificates: true },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({
    success: true,
    data: users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

// ─── GET /users/:id ───────────────────────────────────────────────────────────
/**
 * Detalhes de um usuário com suas inscrições e certificados
 */
export async function getUser(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      cpf: true,
      phone: true,
      institution: true,
      isActive: true,
      qrCodeToken: true,
      avatarUrl: true,
      createdAt: true,
      registrations: {
        include: {
          event: { select: { id: true, name: true, year: true } },
        },
      },
      certificates: {
        include: {
          event: { select: { id: true, name: true, year: true } },
          template: { select: { name: true, type: true } },
        },
      },
    },
  });

  if (!user) {
    res.status(404).json({ success: false, error: "Usuário não encontrado" });
    return;
  }

  const qrCodeUrl = await generateUserQRCode(user.qrCodeToken);

  res.json({ success: true, data: { ...user, qrCodeUrl } });
}

// ─── POST /users ──────────────────────────────────────────────────────────────
/**
 * Cria usuário manualmente (admin pode definir qualquer role)
 */
export async function createUser(req: AuthRequest, res: Response): Promise<void> {
  const { name, email, password, role, cpf, phone, institution } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({
      success: false,
      error: "Nome, email e senha são obrigatórios",
    });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ success: false, error: "Email já cadastrado" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name, email,
      password: hashedPassword,
      role: role ?? "MEMBER",
      cpf, phone, institution,
    },
    select: {
      id: true, name: true, email: true, role: true, createdAt: true,
    },
  });

  res.status(201).json({ success: true, data: user });
}

// ─── PUT /users/:id ───────────────────────────────────────────────────────────
/**
 * Atualiza dados de um usuário
 */
export async function updateUser(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { name, email, role, cpf, phone, institution, isActive } = req.body;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    res.status(404).json({ success: false, error: "Usuário não encontrado" });
    return;
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
      ...(cpf !== undefined && { cpf }),
      ...(phone !== undefined && { phone }),
      ...(institution !== undefined && { institution }),
      ...(isActive !== undefined && { isActive }),
    },
    select: {
      id: true, name: true, email: true, role: true,
      institution: true, isActive: true, updatedAt: true,
    },
  });

  res.json({ success: true, data: updated });
}

// ─── DELETE /users/:id ────────────────────────────────────────────────────────
/**
 * Desativa um usuário (soft delete — não remove do banco)
 */
export async function deactivateUser(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;

  // Impede auto-desativação
  if (id === req.user!.userId) {
    res.status(400).json({
      success: false,
      error: "Você não pode desativar sua própria conta",
    });
    return;
  }

  await prisma.user.update({
    where: { id },
    data: { isActive: false },
  });

  res.json({ success: true, message: "Usuário desativado" });
}

// ─── PUT /users/:id/role ──────────────────────────────────────────────────────
/**
 * Altera o papel (role) de um usuário
 */
export async function changeUserRole(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !["ADMIN", "COORDINATOR", "MEMBER"].includes(role)) {
    res.status(400).json({ success: false, error: "Role inválido" });
    return;
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });

  res.json({ success: true, data: updated });
}

// ─── GET /users/:id/qrcode ────────────────────────────────────────────────────
/**
 * Retorna a imagem do QR code do usuário em base64
 */
export async function getUserQRCode(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;

  // Usuário só pode ver seu próprio QR code (admin pode ver qualquer um)
  if (id !== req.user!.userId && req.user!.role === "MEMBER") {
    res.status(403).json({ success: false, error: "Acesso negado" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: { qrCodeToken: true, name: true },
  });

  if (!user) {
    res.status(404).json({ success: false, error: "Usuário não encontrado" });
    return;
  }

  const qrCodeUrl = await generateUserQRCode(user.qrCodeToken);

  res.json({ success: true, data: { qrCodeUrl, name: user.name } });
}
