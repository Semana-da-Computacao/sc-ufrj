/**
 * Seed inicial do banco de dados
 * Cria o usuário admin padrão e dados de exemplo
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Admin padrão
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@sc.ufrj.br" },
    update: {},
    create: {
      name: "Administrador SC-UFRJ",
      email: "admin@sc.ufrj.br",
      password: adminPassword,
      role: "ADMIN",
      institution: "UFRJ",
    },
  });

  console.log(`✅ Admin criado: ${admin.email}`);

  // Coordenador de exemplo
  const coordPassword = await bcrypt.hash("coord123", 12);
  const coordinator = await prisma.user.upsert({
    where: { email: "coord@sc.ufrj.br" },
    update: {},
    create: {
      name: "Coordenador Exemplo",
      email: "coord@sc.ufrj.br",
      password: coordPassword,
      role: "COORDINATOR",
      institution: "UFRJ",
    },
  });

  console.log(`✅ Coordenador criado: ${coordinator.email}`);

  // Evento de exemplo
  const event = await prisma.event.upsert({
    where: { slug: "semana-computacao-2026" },
    update: {},
    create: {
      slug: "semana-computacao-2026",
      name: "Semana da Computação 2026",
      description:
        "O maior evento de computação da UFRJ, reunindo estudantes, professores e profissionais da área.",
      year: 2026,
      edition: 1,
      startDate: new Date("2026-10-19"),
      endDate: new Date("2026-10-23"),
      isPublished: true,
      seoTitle: "Semana da Computação UFRJ 2026",
      seoDescription:
        "Participe da Semana da Computação UFRJ 2026. Palestras, workshops e muito mais!",
      seoKeywords:
        "computação, UFRJ, semana da computação, tecnologia, programação",
    },
  });

  console.log(`✅ Evento criado: ${event.name}`);

  // Coordenador no evento
  await prisma.eventCoordinator.upsert({
    where: {
      userId_eventId: { userId: coordinator.id, eventId: event.id },
    },
    update: {},
    create: {
      userId: coordinator.id,
      eventId: event.id,
    },
  });

  // Dia do evento de exemplo
  const day1 = await prisma.eventDay.create({
    data: {
      eventId: event.id,
      date: new Date("2026-10-19"),
      label: "Dia 1 – Abertura",
      order: 1,
    },
  });

  // Local de exemplo
  const auditorio = await prisma.eventLocation.create({
    data: {
      name: "Auditório Principal",
      capacity: 300,
      description: "Bloco H - CT",
      eventDayId: day1.id,
    },
  });

  // Atividade de exemplo
  await prisma.activity.create({
    data: {
      title: "Cerimônia de Abertura",
      description: "Abertura oficial da Semana da Computação UFRJ 2026",
      type: "KEYNOTE",
      startTime: new Date("2026-10-19T09:00:00"),
      endTime: new Date("2026-10-19T10:00:00"),
      speaker: "Prof. Dr. Exemplo",
      eventDayId: day1.id,
      locationId: auditorio.id,
      durationHours: 1,
    },
  });

  // Template de certificado
  await prisma.certificateTemplate.create({
    data: {
      name: "Certificado de Participação",
      eventId: event.id,
      type: "PARTICIPATION",
      minHours: 4,
      htmlTemplate: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Georgia', serif; margin: 0; padding: 40px; background: #fff; }
    .certificate { border: 8px solid #1a1a2e; padding: 60px; text-align: center; }
    h1 { font-size: 48px; color: #1a1a2e; margin-bottom: 0; }
    .subtitle { font-size: 24px; color: #555; margin: 10px 0 40px; }
    .name { font-size: 36px; font-weight: bold; color: #e94560; border-bottom: 2px solid #e94560; padding-bottom: 10px; }
    .text { font-size: 18px; color: #333; margin: 30px 0; line-height: 1.6; }
    .hours { font-size: 22px; font-weight: bold; color: #1a1a2e; }
    .footer { margin-top: 60px; font-size: 14px; color: #888; }
    .code { font-family: monospace; font-size: 12px; margin-top: 20px; color: #aaa; }
  </style>
</head>
<body>
  <div class="certificate">
    <h1>Semana da Computação UFRJ</h1>
    <p class="subtitle">{{event}}</p>
    <p class="text">Certificamos que</p>
    <p class="name">{{name}}</p>
    <p class="text">participou da <strong>{{event}}</strong>, realizada nos dias {{dates}},
    com carga horária total de</p>
    <p class="hours">{{hours}} horas</p>
    <div class="footer">
      <p>{{date}}</p>
      <p class="code">Código de validação: {{code}}</p>
    </div>
  </div>
</body>
</html>
      `.trim(),
    },
  });

  console.log("✅ Template de certificado criado");
  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("\n📋 Credenciais:");
  console.log("   Admin: admin@sc.ufrj.br / admin123");
  console.log("   Coord: coord@sc.ufrj.br / coord123");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
