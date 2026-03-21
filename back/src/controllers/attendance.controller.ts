/**
 * Controller de Presenças
 * Check-in via QR code do usuário ou busca por email/CPF
 */
import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../types";

// ─── POST /attendance/checkin ─────────────────────────────────────────────────
/**
 * Registra presença de um participante em uma atividade via QR code
 * O corpo contém o qrCodeToken do usuário e o activityId
 * Apenas coordenadores e admins podem fazer check-in
 */
export async function checkIn(req: AuthRequest, res: Response): Promise<void> {
  const { qrCodeToken, activityId } = req.body;

  if (!qrCodeToken || !activityId) {
    res.status(400).json({
      success: false,
      error: "qrCodeToken e activityId são obrigatórios",
    });
    return;
  }

  // Busca usuário pelo token do QR code
  const user = await prisma.user.findUnique({ where: { qrCodeToken } });

  if (!user || !user.isActive) {
    res.status(404).json({
      success: false,
      error: "Usuário não encontrado ou inativo",
    });
    return;
  }

  // Verifica se a atividade existe
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    include: { eventDay: { include: { event: true } } },
  });

  if (!activity) {
    res.status(404).json({ success: false, error: "Atividade não encontrada" });
    return;
  }

  // Verifica se o usuário está inscrito no evento
  const registration = await prisma.eventRegistration.findUnique({
    where: {
      eventId_userId: {
        eventId: activity.eventDay.eventId,
        userId: user.id,
      },
    },
  });

  if (!registration) {
    res.status(400).json({
      success: false,
      error: "Usuário não está inscrito neste evento",
    });
    return;
  }

  // Verifica check-in duplicado
  const existing = await prisma.attendance.findUnique({
    where: { userId_activityId: { userId: user.id, activityId } },
  });

  if (existing) {
    res.status(409).json({
      success: false,
      error: "Presença já registrada para esta atividade",
      data: existing,
    });
    return;
  }

  const attendance = await prisma.attendance.create({
    data: {
      userId: user.id,
      activityId,
      checkedBy: req.user!.userId,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      activity: { select: { id: true, title: true } },
    },
  });

  res.status(201).json({
    success: true,
    message: `Presença de ${user.name} registrada com sucesso!`,
    data: attendance,
  });
}

// ─── POST /attendance/checkin/manual ──────────────────────────────────────────
/**
 * Check-in manual por email ou CPF (sem QR code)
 * Útil quando o participante não tem acesso ao QR code
 */
export async function manualCheckIn(req: AuthRequest, res: Response): Promise<void> {
  const { email, cpf, activityId } = req.body;

  if (!activityId || (!email && !cpf)) {
    res.status(400).json({
      success: false,
      error: "activityId e (email ou cpf) são obrigatórios",
    });
    return;
  }

  const user = await prisma.user.findFirst({
    where: email ? { email } : { cpf },
  });

  if (!user || !user.isActive) {
    res.status(404).json({ success: false, error: "Usuário não encontrado" });
    return;
  }

  // Reutiliza a lógica de check-in passando o qrCodeToken
  req.body.qrCodeToken = user.qrCodeToken;
  return checkIn(req, res);
}

// ─── DELETE /attendance/:attendanceId ─────────────────────────────────────────
/**
 * Remove um registro de presença (desfaz check-in)
 * Apenas admins podem desfazer presenças
 */
export async function removeAttendance(req: AuthRequest, res: Response): Promise<void> {
  const { attendanceId } = req.params;

  const attendance = await prisma.attendance.findUnique({
    where: { id: attendanceId },
  });

  if (!attendance) {
    res.status(404).json({ success: false, error: "Presença não encontrada" });
    return;
  }

  await prisma.attendance.delete({ where: { id: attendanceId } });

  res.json({ success: true, message: "Presença removida com sucesso" });
}

// ─── GET /attendance/user/:userId ─────────────────────────────────────────────
/**
 * Retorna todas as presenças de um usuário em um evento específico
 */
export async function getUserAttendances(req: AuthRequest, res: Response): Promise<void> {
  const { userId } = req.params;
  const { eventId } = req.query;

  const attendances = await prisma.attendance.findMany({
    where: {
      userId,
      ...(eventId
        ? { activity: { eventDay: { eventId: String(eventId) } } }
        : {}),
    },
    include: {
      activity: {
        select: {
          id: true,
          title: true,
          startTime: true,
          endTime: true,
          durationHours: true,
          type: true,
        },
      },
    },
    orderBy: { checkedAt: "asc" },
  });

  // Calcula total de horas
  const totalHours = attendances.reduce(
    (sum, a) => sum + (a.activity.durationHours ?? 0),
    0
  );

  res.json({
    success: true,
    data: { attendances, totalHours },
  });
}

// ─── GET /attendance/event/:eventId/summary ───────────────────────────────────
/**
 * Sumário de presenças de todos os participantes em um evento
 * Para coordenadores gerenciarem quem tem horas suficientes para certificado
 */
export async function getEventAttendanceSummary(req: AuthRequest, res: Response): Promise<void> {
  const { eventId } = req.params;

  // Busca todos os inscritos e suas presenças
  const registrations = await prisma.eventRegistration.findMany({
    where: { eventId },
    include: {
      user: {
        select: { id: true, name: true, email: true, institution: true },
        include: {
          attendances: {
            where: { activity: { eventDay: { eventId } } },
            include: {
              activity: { select: { durationHours: true, title: true } },
            },
          },
        },
      },
    },
  });

  const summary = registrations.map((reg) => {
    const totalHours = reg.user.attendances.reduce(
      (sum, a) => sum + (a.activity.durationHours ?? 0),
      0
    );
    return {
      userId: reg.user.id,
      name: reg.user.name,
      email: reg.user.email,
      institution: reg.user.institution,
      attendances: reg.user.attendances.length,
      totalHours,
    };
  });

  res.json({ success: true, data: summary });
}
