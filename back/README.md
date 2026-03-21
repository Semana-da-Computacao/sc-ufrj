# SC-UFRJ API

API REST para o sistema de gerenciamento da Semana da Computação UFRJ.

## Stack
- Node.js + Express + TypeScript
- Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- JWT com refresh token rotation

## Setup

```bash
cp .env.example .env
npm install
npx prisma db push
npx ts-node prisma/seed.ts
npm run dev
```

## Credenciais iniciais
- **Admin:** admin@sc.ufrj.br / admin123
- **Coord:** coord@sc.ufrj.br / coord123

## Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Renovar access token |
| GET | `/api/events` | Listar eventos |
| POST | `/api/events` | Criar evento (admin) |
| POST | `/api/attendance/checkin` | Check-in via QR code |
| POST | `/api/certificates/generate` | Gerar certificados em lote |
| GET | `/api/public/events/:slug` | Evento público (site) |
| GET | `/api/certificates/validate/:code` | Validar certificado |
