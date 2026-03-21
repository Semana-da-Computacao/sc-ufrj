/**
 * Controller de Atividades
 * Gerencia dias, locais e atividades do evento (palestras, workshops, mesas redondas, etc.)
 */
import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../types";

// ─── POST /events/:eventId/days ───────────────────────────────────────────────
/**
 * Cria um novo dia para o evento
 */
export async function createDay(req: AuthRequest, res: Response): Promise<void> {
  const { eventId } = req.params;
  const { date, label, order } = req.body;

  if (!date) {
    res.status(400).json({ success: false, error: "Data é obrigatória" });
    return;
  }

  const day = await prisma.eventDay.create({
    data: {
      eventId,
      date: new Date(date),
      label,
      order: order ? Number(order) : 0,
    },
  });

  res.status(201).json({ success: true, data: day });
}

// ─── PUT /events/:eventId/days/:dayId ────────────────────────────────────────
/**
 * Atualiza dados de um dia do evento
 */
export async function updateDay(req: AuthRequest, res: Response): Promise<void> {
  const { dayId } = req.params;
  const { date, label, order } = req.body;

  const day = await prisma.eventDay.update({
    where: { id: dayId },
    data: {
      ...(date && { date: new Date(date) }),
      ...(label !== undefined && { label }),
      ...(order !== undefined && { order: Number(order) }),
    },
  });

  res.json({ success: true, data: day });
}

// ─── DELETE /events/:eventId/days/:dayId ─────────────────────────────────────
/**
 * Remove um dia (cascade deleta atividades e locais)
 */
export async function deleteDay(req: AuthRequest, res: Response): Promise<void> {
  const { dayId } = req.params;

  await prisma.eventDay.delete({ where: { id: dayId } });

  res.json({ success: true, message: "Dia removido" });
}

// ─── POST /events/:eventId/days/:dayId/locations ──────────────────────────────
/**
 * Cria um local (sala/auditório) dentro de um dia
 */
export async function createLocation(req: AuthRequest, res: Response): Promise<void> {
  const { dayId } = req.params;
  const { name, capacity, description, building, floor } = req.body;

  if (!name) {
    res.status(400).json({ success: false, error: "Nome do local é obrigatório" });
    return;
  }

  const location = await prisma.eventLocation.create({
    data: {
      name,
      capacity: capacity ? Number(capacity) : null,
      description,
      building,
      floor,
      eventDayId: dayId,
    },
  });

  res.status(201).json({ success: true, data: location });
}

// ─── PUT /locations/:locationId ───────────────────────────────────────────────
/**
 * Atualiza dados de um local
 */
export async function updateLocation(req: AuthRequest, res: Response): Promise<void> {
  const { locationId } = req.params;
  const { name, capacity, description, building, floor } = req.body;

  const location = await prisma.eventLocation.update({
    where: { id: locationId },
    data: {
      ...(name && { name }),
      ...(capacity !== undefined && { capacity: capacity ? Number(capacity) : null }),
      ...(description !== undefined && { description }),
      ...(building !== undefined && { building }),
      ...(floor !== undefined && { floor }),
    },
  });

  res.json({ success: true, data: location });
}

// ─── DELETE /locations/:locationId ────────────────────────────────────────────
/**
 * Remove um local
 */
export async function deleteLocation(req: AuthRequest, res: Response): Promise<void> {
  const { locationId } = req.params;

  await prisma.eventLocation.delete({ where: { id: locationId } });

  res.json({ success: true, message: "Local removido" });
}

// ─── POST /events/:eventId/days/:dayId/activities ─────────────────────────────
/**
 * Cria uma nova atividade em um dia do evento
 * Suporta todos os tipos: TALK, WORKSHOP, PANEL, KEYNOTE, COFFEE_BREAK, OTHER
 */
export async function createActivity(req: AuthRequest, res: Response): Promise<void> {
  const { dayId } = req.params;
  const {
    title, description, type, startTime, endTime,
    locationId, durationHours, maxAttendees, streamUrl, level, tags,
  } = req.body;

  if (!title || !startTime || !endTime) {
    res.status(400).json({
      success: false,
      error: "Título, horário de início e fim são obrigatórios",
    });
    return;
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  // Calcula duração automaticamente se não informada
  const calcHours =
    durationHours != null
      ? Number(durationHours)
      : (end.getTime() - start.getTime()) / 3_600_000;

  const activity = await prisma.activity.create({
    data: {
      title, description,
      type: type ?? "TALK",
      startTime: start,
      endTime: end,
      eventDayId: dayId,
      locationId: locationId || null,
      durationHours: calcHours,
      maxAttendees: maxAttendees ? Number(maxAttendees) : null,
      streamUrl,
      level,
      tags: tags ? JSON.stringify(tags) : null,
    },
    include: {
      location: true,
      attendances: {
        include: {
          speaker: { select: { id: true, name: true, title: true, photoUrl: true } },
        },
      },
    },
  });

  res.status(201).json({ success: true, data: activity });
}

// ─── PUT /activities/:activityId ──────────────────────────────────────────────
/**
 * Atualiza dados de uma atividade
 */
export async function updateActivity(req: AuthRequest, res: Response): Promise<void> {
  const { activityId } = req.params;
  const data = { ...req.body };

  if (data.startTime) data.startTime = new Date(data.startTime);
  if (data.endTime) data.endTime = new Date(data.endTime);
  if (data.maxAttendees != null) data.maxAttendees = Number(data.maxAttendees);
  if (data.tags) data.tags = JSON.stringify(data.tags);

  // Recalcula duração se horários mudaram
  if (data.startTime && data.endTime) {
    data.durationHours =
      (data.endTime.getTime() - data.startTime.getTime()) / 3_600_000;
  }

  const activity = await prisma.activity.update({
    where: { id: activityId },
    data,
    include: {
      location: true,
      attendances: {
        include: {
          speaker: { select: { id: true, name: true, title: true, photoUrl: true } },
        },
      },
    },
  });

  res.json({ success: true, data: activity });
}

// ─── DELETE /activities/:activityId ───────────────────────────────────────────
/**
 * Remove uma atividade (cascade deleta presenças e vínculos com palestrantes)
 */
export async function deleteActivity(req: AuthRequest, res: Response): Promise<void> {
  const { activityId } = req.params;

  await prisma.activity.delete({ where: { id: activityId } });

  res.json({ success: true, message: "Atividade removida" });
}

// ─── GET /activities/:activityId ──────────────────────────────────────────────
/**
 * Detalhes de uma atividade com palestrantes e presenças
 */
export async function getActivity(req: AuthRequest, res: Response): Promise<void> {
  const { activityId } = req.params;

  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    include: {
      location: true,
      attendances: {
        include: {
          speaker: true,
        },
      },
      Attendance: {
        include: {
          user: { select: { id: true, name: true, email: true, institution: true } },
        },
      },
    },
  });

  if (!activity) {
    res.status(404).json({ success: false, error: "Atividade não encontrada" });
    return;
  }

  res.json({ success: true, data: activity });
}

// ─── GET /activities/:activityId/attendances ──────────────────────────────────
/**
 * Lista presenças de uma atividade específica
 */
export async function getActivityAttendances(req: AuthRequest, res: Response): Promise<void> {
  const { activityId } = req.params;

  const attendances = await prisma.attendance.findMany({
    where: { activityId },
    include: {
      user: {
        select: { id: true, name: true, email: true, institution: true },
      },
    },
    orderBy: { checkedAt: "asc" },
  });

  res.json({ success: true, data: attendances });
}
