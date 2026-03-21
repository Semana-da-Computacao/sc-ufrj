/**
 * Controller de Eventos
 * CRUD completo para eventos, incluindo gerenciamento de inscritos e coordenadores.
 */
import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../types";

// ─── GET /events ──────────────────────────────────────────────────────────────
/**
 * Lista todos os eventos.
 * Admin vê todos; coordenadores/membros veem apenas publicados.
 */
export async function listEvents(req: AuthRequest, res: Response): Promise<void> {
  const isAdmin = req.user?.role === "ADMIN";
  const { year, search } = req.query;

  const events = await prisma.event.findMany({
    where: {
      ...(isAdmin ? {} : { isPublished: true }),
      ...(year ? { year: Number(year) } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: String(search) } },
              { description: { contains: String(search) } },
            ],
          }
        : {}),
    },
    include: {
      _count: {
        select: { registrations: true, days: true, speakers: true, stands: true },
      },
    },
    orderBy: [{ year: "desc" }, { edition: "desc" }],
  });

  res.json({ success: true, data: events });
}

// ─── GET /events/:id ──────────────────────────────────────────────────────────
/**
 * Detalhes completos de um evento (por id ou slug).
 * Inclui dias, atividades com palestrantes, locais, stands, patrocinadores e coordenadores.
 */
export async function getEvent(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;

  const event = await prisma.event.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      days: {
        orderBy: { order: "asc" },
        include: {
          locations: { orderBy: { name: "asc" } },
          activities: {
            orderBy: { startTime: "asc" },
            include: {
              location: true,
              attendances: {
                include: {
                  speaker: { select: { id: true, name: true, title: true, photoUrl: true } },
                },
              },
            },
          },
        },
      },
      speakers: {
        orderBy: { name: "asc" },
        include: {
          activities: {
            include: {
              activity: { select: { id: true, title: true, type: true } },
            },
          },
        },
      },
      stands: { orderBy: [{ order: "asc" }, { name: "asc" }] },
      sponsors: { orderBy: [{ tier: "asc" }, { order: "asc" }] },
      coordinators: {
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
      },
      certificateTemplates: true,
      _count: { select: { registrations: true, speakers: true, stands: true } },
    },
  });

  if (!event) {
    res.status(404).json({ success: false, error: "Evento não encontrado" });
    return;
  }

  // Não-admins só veem eventos publicados (exceto coordenadores do próprio evento)
  if (!event.isPublished && req.user?.role !== "ADMIN") {
    const isCoord = event.coordinators.some((c) => c.user.id === req.user?.userId);
    if (!isCoord) {
      res.status(404).json({ success: false, error: "Evento não encontrado" });
      return;
    }
  }

  res.json({ success: true, data: event });
}

// ─── POST /events ─────────────────────────────────────────────────────────────
/**
 * Cria um novo evento (apenas admin).
 */
export async function createEvent(req: AuthRequest, res: Response): Promise<void> {
  const {
    slug, name, description, year, edition,
    startDate, endDate, location, maxCapacity,
    seoTitle, seoDescription, seoKeywords, ogImage,
  } = req.body;

  if (!slug || !name || !year || !startDate || !endDate) {
    res.status(400).json({
      success: false,
      error: "Campos obrigatórios: slug, name, year, startDate, endDate",
    });
    return;
  }

  const existing = await prisma.event.findUnique({ where: { slug } });
  if (existing) {
    res.status(409).json({ success: false, error: "Slug já está em uso" });
    return;
  }

  const event = await prisma.event.create({
    data: {
      slug, name, description,
      year: Number(year),
      edition: edition ? Number(edition) : null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location,
      maxCapacity: maxCapacity ? Number(maxCapacity) : null,
      seoTitle, seoDescription, seoKeywords, ogImage,
    },
  });

  res.status(201).json({ success: true, message: "Evento criado", data: event });
}

// ─── PUT /events/:id ──────────────────────────────────────────────────────────
/**
 * Atualiza dados do evento.
 * Coordenadores têm acesso limitado (não podem alterar slug, year ou isPublished).
 */
export async function updateEvent(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const isAdmin = req.user?.role === "ADMIN";

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    res.status(404).json({ success: false, error: "Evento não encontrado" });
    return;
  }

  const allowedForCoord = [
    "name", "description", "location", "maxCapacity",
    "seoTitle", "seoDescription", "seoKeywords", "ogImage", "bannerUrl",
  ];

  const rawData = isAdmin
    ? req.body
    : Object.fromEntries(
        Object.entries(req.body).filter(([k]) => allowedForCoord.includes(k))
      );

  if (rawData.startDate) rawData.startDate = new Date(rawData.startDate);
  if (rawData.endDate) rawData.endDate = new Date(rawData.endDate);
  if (rawData.year) rawData.year = Number(rawData.year);
  if (rawData.edition) rawData.edition = Number(rawData.edition);
  if (rawData.maxCapacity != null) rawData.maxCapacity = rawData.maxCapacity ? Number(rawData.maxCapacity) : null;

  const updated = await prisma.event.update({ where: { id }, data: rawData });

  res.json({ success: true, data: updated });
}

// ─── DELETE /events/:id ───────────────────────────────────────────────────────
/**
 * Remove um evento permanentemente (apenas admin).
 */
export async function deleteEvent(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    res.status(404).json({ success: false, error: "Evento não encontrado" });
    return;
  }

  await prisma.event.delete({ where: { id } });

  res.json({ success: true, message: "Evento removido" });
}

// ─── POST /events/:id/publish ─────────────────────────────────────────────────
/**
 * Publica ou despublica um evento (toggle).
 */
export async function togglePublish(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    res.status(404).json({ success: false, error: "Evento não encontrado" });
    return;
  }

  const updated = await prisma.event.update({
    where: { id },
    data: { isPublished: !event.isPublished },
  });

  res.json({
    success: true,
    message: updated.isPublished ? "Evento publicado" : "Evento despublicado",
    data: updated,
  });
}

// ─── POST /events/:id/coordinators ───────────────────────────────────────────
/**
 * Adiciona um coordenador ao evento (apenas admin).
 * Promove o usuário para COORDINATOR se ainda for MEMBER.
 */
export async function addCoordinator(req: AuthRequest, res: Response): Promise<void> {
  const { id: eventId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ success: false, error: "userId é obrigatório" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).json({ success: false, error: "Usuário não encontrado" });
    return;
  }

  if (user.role === "MEMBER") {
    await prisma.user.update({ where: { id: userId }, data: { role: "COORDINATOR" } });
  }

  const coordinator = await prisma.eventCoordinator.upsert({
    where: { userId_eventId: { userId, eventId } },
    update: {},
    create: { userId, eventId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  res.status(201).json({ success: true, data: coordinator });
}

// ─── DELETE /events/:id/coordinators/:userId ─────────────────────────────────
/**
 * Remove um coordenador do evento (apenas admin).
 */
export async function removeCoordinator(req: AuthRequest, res: Response): Promise<void> {
  const { id: eventId, userId } = req.params;

  await prisma.eventCoordinator.deleteMany({ where: { eventId, userId } });

  res.json({ success: true, message: "Coordenador removido" });
}

// ─── GET /events/:id/registrations ───────────────────────────────────────────
/**
 * Lista inscritos no evento com paginação e busca.
 */
export async function getRegistrations(req: AuthRequest, res: Response): Promise<void> {
  const { id: eventId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 50;
  const search = req.query.search ? String(req.query.search) : undefined;

  const where = {
    eventId,
    ...(search
      ? {
          user: {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } },
              { institution: { contains: search } },
            ],
          },
        }
      : {}),
  };

  const [registrations, total] = await Promise.all([
    prisma.eventRegistration.findMany({
      where,
      include: {
        user: {
          select: {
            id: true, name: true, email: true,
            institution: true, qrCodeToken: true, phone: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { registeredAt: "asc" },
    }),
    prisma.eventRegistration.count({ where }),
  ]);

  res.json({
    success: true,
    data: registrations,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

// ─── POST /events/:id/register ────────────────────────────────────────────────
/**
 * Inscreve o usuário autenticado no evento.
 */
export async function registerForEvent(req: AuthRequest, res: Response): Promise<void> {
  const { id: eventId } = req.params;
  const userId = req.user!.userId;

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event || !event.isPublished) {
    res.status(404).json({ success: false, error: "Evento não encontrado" });
    return;
  }

  // Verifica capacidade máxima
  if (event.maxCapacity) {
    const count = await prisma.eventRegistration.count({ where: { eventId } });
    if (count >= event.maxCapacity) {
      res.status(400).json({ success: false, error: "Evento com capacidade esgotada" });
      return;
    }
  }

  const existing = await prisma.eventRegistration.findUnique({
    where: { eventId_userId: { eventId, userId } },
  });

  if (existing) {
    res.status(409).json({ success: false, error: "Já inscrito neste evento" });
    return;
  }

  const registration = await prisma.eventRegistration.create({
    data: { eventId, userId },
  });

  res.status(201).json({
    success: true,
    message: "Inscrição realizada com sucesso",
    data: registration,
  });
}

// ─── DELETE /events/:id/registrations/:userId ─────────────────────────────────
/**
 * Cancela a inscrição de um usuário no evento (admin/coord ou próprio usuário).
 */
export async function cancelRegistration(req: AuthRequest, res: Response): Promise<void> {
  const { id: eventId, userId } = req.params;
  const requesterId = req.user!.userId;
  const isAdminOrCoord =
    req.user?.role === "ADMIN" || req.user?.role === "COORDINATOR";

  // Usuário comum só pode cancelar a própria inscrição
  if (!isAdminOrCoord && requesterId !== userId) {
    res.status(403).json({ success: false, error: "Acesso negado" });
    return;
  }

  await prisma.eventRegistration.deleteMany({ where: { eventId, userId } });

  res.json({ success: true, message: "Inscrição cancelada" });
}

// ─── GET /events/:id/stats ────────────────────────────────────────────────────
/**
 * Estatísticas resumidas do evento para o dashboard.
 */
export async function getEventStats(req: AuthRequest, res: Response): Promise<void> {
  const { id: eventId } = req.params;

  const [registrations, attendances, certificates, activities, speakers, stands] =
    await Promise.all([
      prisma.eventRegistration.count({ where: { eventId } }),
      prisma.attendance.count({
        where: { activity: { eventDay: { eventId } } },
      }),
      prisma.certificate.count({ where: { eventId } }),
      prisma.activity.count({ where: { eventDay: { eventId } } }),
      prisma.speaker.count({ where: { eventId } }),
      prisma.stand.count({ where: { eventId } }),
    ]);

  res.json({
    success: true,
    data: { registrations, attendances, certificates, activities, speakers, stands },
  });
}
