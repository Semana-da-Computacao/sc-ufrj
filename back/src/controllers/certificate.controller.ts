/**
 * Controller de Certificados
 * Geração baseada em templates HTML, com código único de validação
 */
import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import prisma from "../lib/prisma";
import { AuthRequest } from "../types";
import { renderCertificate } from "../services/certificate.service";

// ─── POST /certificates/templates ─────────────────────────────────────────────
/**
 * Cria um template de certificado para um evento
 */
export async function createTemplate(req: AuthRequest, res: Response): Promise<void> {
  const { eventId, name, htmlTemplate, minHours, type } = req.body;

  if (!eventId || !name || !htmlTemplate) {
    res.status(400).json({
      success: false,
      error: "eventId, name e htmlTemplate são obrigatórios",
    });
    return;
  }

  const template = await prisma.certificateTemplate.create({
    data: {
      eventId,
      name,
      htmlTemplate,
      minHours: minHours ? Number(minHours) : 0,
      type: type ?? "PARTICIPATION",
    },
  });

  res.status(201).json({ success: true, data: template });
}

// ─── PUT /certificates/templates/:templateId ──────────────────────────────────
/**
 * Atualiza um template de certificado
 */
export async function updateTemplate(req: AuthRequest, res: Response): Promise<void> {
  const { templateId } = req.params;
  const { name, htmlTemplate, minHours, type } = req.body;

  const template = await prisma.certificateTemplate.update({
    where: { id: templateId },
    data: {
      ...(name && { name }),
      ...(htmlTemplate && { htmlTemplate }),
      ...(minHours !== undefined && { minHours: Number(minHours) }),
      ...(type && { type }),
    },
  });

  res.json({ success: true, data: template });
}

// ─── DELETE /certificates/templates/:templateId ───────────────────────────────
/**
 * Remove um template (apenas se não tiver certificados emitidos)
 */
export async function deleteTemplate(req: AuthRequest, res: Response): Promise<void> {
  const { templateId } = req.params;

  const count = await prisma.certificate.count({ where: { templateId } });
  if (count > 0) {
    res.status(409).json({
      success: false,
      error: `Não é possível remover: ${count} certificados já emitidos com este template`,
    });
    return;
  }

  await prisma.certificateTemplate.delete({ where: { id: templateId } });

  res.json({ success: true, message: "Template removido" });
}

// ─── POST /certificates/generate ─────────────────────────────────────────────
/**
 * Gera certificados para todos os participantes elegíveis de um evento
 * Verifica horas mínimas de acordo com o template
 */
export async function generateCertificates(req: AuthRequest, res: Response): Promise<void> {
  const { eventId, templateId } = req.body;

  if (!eventId || !templateId) {
    res.status(400).json({
      success: false,
      error: "eventId e templateId são obrigatórios",
    });
    return;
  }

  const [event, template] = await Promise.all([
    prisma.event.findUnique({ where: { id: eventId } }),
    prisma.certificateTemplate.findUnique({ where: { id: templateId } }),
  ]);

  if (!event || !template) {
    res.status(404).json({ success: false, error: "Evento ou template não encontrado" });
    return;
  }

  // Busca todos os inscritos com suas horas de presença
  const registrations = await prisma.eventRegistration.findMany({
    where: { eventId },
    include: {
      user: {
        include: {
          attendances: {
            where: { activity: { eventDay: { eventId } } },
            include: { activity: { select: { durationHours: true } } },
          },
        },
      },
    },
  });

  let generated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const reg of registrations) {
    const totalHours = reg.user.attendances.reduce(
      (sum, a) => sum + (a.activity.durationHours ?? 0),
      0
    );

    // Verifica horas mínimas
    if (totalHours < template.minHours) {
      skipped++;
      continue;
    }

    try {
      // Evita duplicata (upsert com update vazio)
      await prisma.certificate.upsert({
        where: {
          userId_eventId_templateId: {
            userId: reg.userId,
            eventId,
            templateId,
          },
        },
        update: { totalHours },
        create: {
          userId: reg.userId,
          eventId,
          templateId,
          totalHours,
          code: uuidv4(),
        },
      });
      generated++;
    } catch (err) {
      errors.push(`Erro para ${reg.user.email}: ${String(err)}`);
    }
  }

  res.json({
    success: true,
    message: `${generated} certificados gerados, ${skipped} ignorados por horas insuficientes`,
    data: { generated, skipped, errors },
  });
}

// ─── GET /certificates/event/:eventId ────────────────────────────────────────
/**
 * Lista todos os certificados emitidos de um evento
 */
export async function listEventCertificates(req: AuthRequest, res: Response): Promise<void> {
  const { eventId } = req.params;

  const certificates = await prisma.certificate.findMany({
    where: { eventId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      template: { select: { name: true, type: true } },
    },
    orderBy: { issuedAt: "desc" },
  });

  res.json({ success: true, data: certificates });
}

// ─── GET /certificates/validate/:code ────────────────────────────────────────
/**
 * Valida um certificado pelo código único (rota pública)
 * Retorna informações básicas sem precisar de autenticação
 */
export async function validateCertificate(req: AuthRequest, res: Response): Promise<void> {
  const { code } = req.params;

  const certificate = await prisma.certificate.findUnique({
    where: { code },
    include: {
      user: { select: { name: true } },
      event: { select: { name: true, year: true } },
      template: { select: { name: true, type: true } },
    },
  });

  if (!certificate) {
    res.status(404).json({
      success: false,
      error: "Certificado não encontrado ou código inválido",
    });
    return;
  }

  res.json({
    success: true,
    data: {
      valid: true,
      holderName: certificate.user.name,
      eventName: certificate.event.name,
      eventYear: certificate.event.year,
      templateName: certificate.template.name,
      type: certificate.template.type,
      totalHours: certificate.totalHours,
      issuedAt: certificate.issuedAt,
    },
  });
}

// ─── GET /certificates/user/me ────────────────────────────────────────────────
/**
 * Lista os certificados do usuário autenticado
 */
export async function myMyCertificates(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId;

  const certificates = await prisma.certificate.findMany({
    where: { userId },
    include: {
      event: { select: { id: true, name: true, year: true, slug: true } },
      template: { select: { name: true, type: true } },
    },
    orderBy: { issuedAt: "desc" },
  });

  res.json({ success: true, data: certificates });
}

// ─── GET /certificates/:id/render ─────────────────────────────────────────────
/**
 * Renderiza o HTML do certificado para visualização/impressão
 */
export async function renderCertificateHtml(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user!.userId;
  const isAdmin = req.user?.role === "ADMIN" || req.user?.role === "COORDINATOR";

  const certificate = await prisma.certificate.findUnique({
    where: { id },
    include: {
      user: { select: { name: true } },
      event: { select: { name: true, startDate: true, endDate: true } },
      template: true,
    },
  });

  if (!certificate) {
    res.status(404).json({ success: false, error: "Certificado não encontrado" });
    return;
  }

  // Apenas o dono ou admin pode ver
  if (certificate.userId !== userId && !isAdmin) {
    res.status(403).json({ success: false, error: "Acesso negado" });
    return;
  }

  const html = renderCertificate(certificate.template.htmlTemplate, {
    name: certificate.user.name,
    event: certificate.event.name,
    hours: certificate.totalHours.toString(),
    date: new Date(certificate.issuedAt).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "long", year: "numeric",
    }),
    dates: `${new Date(certificate.event.startDate).toLocaleDateString("pt-BR")} a ${new Date(certificate.event.endDate).toLocaleDateString("pt-BR")}`,
    code: certificate.code,
  });

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
}
