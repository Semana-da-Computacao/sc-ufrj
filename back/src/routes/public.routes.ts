/**
 * Rotas Públicas — usadas pelo site SC-UFRJ para renderização dinâmica
 * Não requerem autenticação. Apenas eventos publicados são expostos.
 */
import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

// ─── GET /public/events ───────────────────────────────────────────────────────
/**
 * Lista eventos publicados com metadados SEO
 * Usada pela home do site para listar as edições
 */
router.get("/events", async (req: Request, res: Response) => {
  const year = req.query.year ? Number(req.query.year) : undefined;

  const events = await prisma.event.findMany({
    where: {
      isPublished: true,
      ...(year && !isNaN(year) ? { year } : {}),
    },
    select: {
      id: true, slug: true, name: true, year: true, edition: true,
      description: true, startDate: true, endDate: true, bannerUrl: true,
      location: true,
      seoTitle: true, seoDescription: true, seoKeywords: true, ogImage: true,
      _count: { select: { registrations: true, days: true, speakers: true, stands: true } },
      days: {
        select: {
          id: true, date: true, label: true,
          activities: { select: { id: true, title: true, type: true }, orderBy: { startTime: "asc" } },
        },
        orderBy: { date: "asc" },
      },
      speakers: { select: { id: true, name: true, title: true, photoUrl: true }, take: 20 },
      stands: { select: { id: true, name: true, company: true, category: true, logoUrl: true }, take: 20 },
    },
    orderBy: { year: "desc" },
  });

  res.json({ success: true, data: events });
});

// ─── GET /public/events/:slug ─────────────────────────────────────────────────
/**
 * Detalhes completos de um evento publicado pelo slug
 * Usado para gerar a página dinâmica da edição específica
 */
router.get("/events/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;

  const event = await prisma.event.findFirst({
    where: { slug, isPublished: true },
    include: {
      days: {
        orderBy: { order: "asc" },
        include: {
          activities: {
            orderBy: { startTime: "asc" },
            include: { location: true },
            where: { type: { not: "COFFEE_BREAK" } }, // Filtra coffee breaks da programação pública
          },
          locations: true,
        },
      },
      sponsors: { orderBy: [{ tier: "asc" }, { order: "asc" }] },
      _count: { select: { registrations: true } },
    },
  });

  if (!event) {
    res.status(404).json({ success: false, error: "Evento não encontrado" });
    return;
  }

  // Metadados SEO no response para uso pelo SSR/meta tags
  res.json({
    success: true,
    data: event,
    seo: {
      title: event.seoTitle || event.name,
      description: event.seoDescription || event.description,
      keywords: event.seoKeywords,
      ogImage: event.ogImage || event.bannerUrl,
    },
  });
});

// ─── GET /public/certificates/validate/:code ─────────────────────────────────
/**
 * Validação pública de certificados pelo código único
 */
router.get("/certificates/validate/:code", async (req: Request, res: Response) => {
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
    res.status(404).json({ success: false, valid: false });
    return;
  }

  res.json({
    success: true,
    valid: true,
    data: {
      holderName: certificate.user.name,
      eventName: certificate.event.name,
      eventYear: certificate.event.year,
      certificateType: certificate.template.name,
      type: certificate.template.type,
      totalHours: certificate.totalHours,
      issuedAt: certificate.issuedAt,
    },
  });
});

export default router;
