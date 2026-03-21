/**
 * Controller de Palestrantes
 * Registro centralizado de palestrantes por evento.
 * Um palestrante pode participar de múltiplas atividades (talks, panels, workshops).
 */
import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../types";

// ─── GET /events/:eventId/speakers ────────────────────────────────────────────
/**
 * Lista todos os palestrantes cadastrados em um evento
 */
export async function listSpeakers(req: AuthRequest, res: Response): Promise<void> {
  const { eventId } = req.params;

  const speakers = await prisma.speaker.findMany({
    where: { eventId },
    include: {
      activities: {
        include: {
          activity: {
            select: { id: true, title: true, type: true, startTime: true },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  res.json({ success: true, data: speakers });
}

// ─── GET /events/:eventId/speakers/:speakerId ─────────────────────────────────
/**
 * Detalhes de um palestrante
 */
export async function getSpeaker(req: AuthRequest, res: Response): Promise<void> {
  const { eventId, speakerId } = req.params;

  const speaker = await prisma.speaker.findFirst({
    where: { id: speakerId, eventId },
    include: {
      activities: {
        include: {
          activity: {
            select: {
              id: true, title: true, type: true,
              startTime: true, endTime: true,
              location: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  if (!speaker) {
    res.status(404).json({ success: false, error: "Palestrante não encontrado" });
    return;
  }

  res.json({ success: true, data: speaker });
}

// ─── POST /events/:eventId/speakers ───────────────────────────────────────────
/**
 * Cadastra um novo palestrante no evento
 */
export async function createSpeaker(req: AuthRequest, res: Response): Promise<void> {
  const { eventId } = req.params;
  const { name, title, bio, photoUrl, email, linkedin, github, website } = req.body;

  if (!name) {
    res.status(400).json({ success: false, error: "Nome do palestrante é obrigatório" });
    return;
  }

  const speaker = await prisma.speaker.create({
    data: { eventId, name, title, bio, photoUrl, email, linkedin, github, website },
  });

  res.status(201).json({ success: true, data: speaker });
}

// ─── PUT /events/:eventId/speakers/:speakerId ─────────────────────────────────
/**
 * Atualiza dados de um palestrante
 */
export async function updateSpeaker(req: AuthRequest, res: Response): Promise<void> {
  const { eventId, speakerId } = req.params;
  const { name, title, bio, photoUrl, email, linkedin, github, website } = req.body;

  const existing = await prisma.speaker.findFirst({ where: { id: speakerId, eventId } });
  if (!existing) {
    res.status(404).json({ success: false, error: "Palestrante não encontrado" });
    return;
  }

  const speaker = await prisma.speaker.update({
    where: { id: speakerId },
    data: {
      ...(name !== undefined && { name }),
      ...(title !== undefined && { title }),
      ...(bio !== undefined && { bio }),
      ...(photoUrl !== undefined && { photoUrl }),
      ...(email !== undefined && { email }),
      ...(linkedin !== undefined && { linkedin }),
      ...(github !== undefined && { github }),
      ...(website !== undefined && { website }),
    },
  });

  res.json({ success: true, data: speaker });
}

// ─── DELETE /events/:eventId/speakers/:speakerId ──────────────────────────────
/**
 * Remove um palestrante do evento (desvincula de todas as atividades)
 */
export async function deleteSpeaker(req: AuthRequest, res: Response): Promise<void> {
  const { eventId, speakerId } = req.params;

  const existing = await prisma.speaker.findFirst({ where: { id: speakerId, eventId } });
  if (!existing) {
    res.status(404).json({ success: false, error: "Palestrante não encontrado" });
    return;
  }

  await prisma.speaker.delete({ where: { id: speakerId } });

  res.json({ success: true, message: "Palestrante removido" });
}

// ─── POST /activities/:activityId/speakers ────────────────────────────────────
/**
 * Vincula um palestrante a uma atividade
 * Para palestras: um palestrante principal
 * Para mesas redondas: múltiplos panelistas + moderador
 */
export async function addSpeakerToActivity(req: AuthRequest, res: Response): Promise<void> {
  const { activityId } = req.params;
  const { speakerId, role } = req.body;

  if (!speakerId) {
    res.status(400).json({ success: false, error: "speakerId é obrigatório" });
    return;
  }

  // Valida role
  const validRoles = ["SPEAKER", "MODERATOR", "PANELIST"];
  const speakerRole = validRoles.includes(role) ? role : "SPEAKER";

  const existing = await prisma.activitySpeaker.findUnique({
    where: { activityId_speakerId: { activityId, speakerId } },
  });

  if (existing) {
    res.status(409).json({ success: false, error: "Palestrante já vinculado a esta atividade" });
    return;
  }

  const link = await prisma.activitySpeaker.create({
    data: { activityId, speakerId, role: speakerRole },
    include: {
      speaker: { select: { id: true, name: true, title: true, photoUrl: true } },
    },
  });

  res.status(201).json({ success: true, data: link });
}

// ─── DELETE /activities/:activityId/speakers/:speakerId ───────────────────────
/**
 * Desvincula um palestrante de uma atividade
 */
export async function removeSpeakerFromActivity(req: AuthRequest, res: Response): Promise<void> {
  const { activityId, speakerId } = req.params;

  await prisma.activitySpeaker.deleteMany({ where: { activityId, speakerId } });

  res.json({ success: true, message: "Palestrante removido da atividade" });
}
