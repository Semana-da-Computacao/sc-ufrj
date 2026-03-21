/**
 * Controller de Stands / Estandes
 * Gerencia os estandes físicos de empresas, labs e instituições no evento.
 */
import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../types";

// ─── GET /events/:eventId/stands ──────────────────────────────────────────────
/**
 * Lista todos os estandes de um evento
 */
export async function listStands(req: AuthRequest, res: Response): Promise<void> {
  const { eventId } = req.params;

  const stands = await prisma.stand.findMany({
    where: { eventId },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  res.json({ success: true, data: stands });
}

// ─── GET /events/:eventId/stands/:standId ─────────────────────────────────────
/**
 * Detalhes de um estande
 */
export async function getStand(req: AuthRequest, res: Response): Promise<void> {
  const { eventId, standId } = req.params;

  const stand = await prisma.stand.findFirst({
    where: { id: standId, eventId },
  });

  if (!stand) {
    res.status(404).json({ success: false, error: "Estande não encontrado" });
    return;
  }

  res.json({ success: true, data: stand });
}

// ─── POST /events/:eventId/stands ─────────────────────────────────────────────
/**
 * Cadastra um novo estande no evento
 */
export async function createStand(req: AuthRequest, res: Response): Promise<void> {
  const { eventId } = req.params;
  const {
    name, company, description, logoUrl, contactEmail,
    contactPhone, website, category, standNumber, location, order,
  } = req.body;

  if (!name) {
    res.status(400).json({ success: false, error: "Nome do estande é obrigatório" });
    return;
  }

  const stand = await prisma.stand.create({
    data: {
      eventId, name, company, description, logoUrl,
      contactEmail, contactPhone, website,
      category: category ?? "COMPANY",
      standNumber, location,
      order: order ? Number(order) : 0,
    },
  });

  res.status(201).json({ success: true, data: stand });
}

// ─── PUT /events/:eventId/stands/:standId ─────────────────────────────────────
/**
 * Atualiza dados de um estande
 */
export async function updateStand(req: AuthRequest, res: Response): Promise<void> {
  const { eventId, standId } = req.params;

  const existing = await prisma.stand.findFirst({ where: { id: standId, eventId } });
  if (!existing) {
    res.status(404).json({ success: false, error: "Estande não encontrado" });
    return;
  }

  const data = { ...req.body };
  if (data.order !== undefined) data.order = Number(data.order);

  const stand = await prisma.stand.update({ where: { id: standId }, data });

  res.json({ success: true, data: stand });
}

// ─── DELETE /events/:eventId/stands/:standId ──────────────────────────────────
/**
 * Remove um estande do evento
 */
export async function deleteStand(req: AuthRequest, res: Response): Promise<void> {
  const { eventId, standId } = req.params;

  const existing = await prisma.stand.findFirst({ where: { id: standId, eventId } });
  if (!existing) {
    res.status(404).json({ success: false, error: "Estande não encontrado" });
    return;
  }

  await prisma.stand.delete({ where: { id: standId } });

  res.json({ success: true, message: "Estande removido" });
}

// ─── PUT /events/:eventId/stands/reorder ──────────────────────────────────────
/**
 * Reordena os estandes de um evento
 * Recebe array de { id, order }
 */
export async function reorderStands(req: AuthRequest, res: Response): Promise<void> {
  const { eventId } = req.params;
  const { items } = req.body as { items: { id: string; order: number }[] };

  if (!Array.isArray(items)) {
    res.status(400).json({ success: false, error: "items deve ser um array" });
    return;
  }

  // Atualiza todos em paralelo
  await Promise.all(
    items.map(({ id, order }) =>
      prisma.stand.updateMany({
        where: { id, eventId },
        data: { order },
      })
    )
  );

  res.json({ success: true, message: "Ordem atualizada" });
}
