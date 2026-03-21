# SC-UFRJ

Sistema da **Semana da Computação da UFRJ** com:

- API REST para gestão do evento
- painel web para organização (admin/coordenadores)
- fluxo de participante (cadastro, inscrição, check-in e certificados)
- rotas públicas para exibição das edições publicadas

## O que este projeto resolve

O SC-UFRJ centraliza a operação do evento em um único sistema:

- gestão de eventos por edição/ano
- organização da programação por dias, locais e atividades
- cadastro de palestrantes e estandes
- controle de inscrições
- check-in por QR Code
- geração e validação de certificados com template HTML

## Arquitetura

Este repositório é dividido em dois projetos independentes:

- `back/`: API em Node.js + Express + Prisma
- `front/`: painel web em React + Vite + TypeScript

Não há workspace de monorepo na raiz. Os comandos devem ser executados dentro de `back/` e `front/`.

## Stack técnica

### Backend (`back/`)

- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite (desenvolvimento)
- JWT + refresh token rotation
- bcryptjs, qrcode, zod

### Frontend (`front/`)

- React 19
- Vite
- TypeScript
- React Router
- TanStack Query
- Axios
- Zustand
- Tailwind CSS v4
- shadcn/ui + Radix UI

## Perfis de acesso

- `ADMIN`: gestão completa (usuários, eventos, publicação, certificados, check-in, etc.)
- `COORDINATOR`: gestão operacional do evento (programação, check-in, certificados)
- `MEMBER`: participante (cadastro/login e inscrição)

## Estrutura do repositório

```text
sc-ufrj/
├── back/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── app.ts
│       └── server.ts
├── front/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── lib/
│   │   ├── store/
│   │   └── App.tsx
│   └── index.html
└── README.md
```

## Funcionalidades implementadas

- autenticação com login, refresh token e logout
- CRUD de eventos com publicação/despublicação
- gestão da programação por dia/local/atividade
- gestão de palestrantes e vínculo em atividades
- gestão de estandes
- inscrições com paginação e busca
- check-in por QR Code (scanner de câmera + entrada manual)
- templates de certificado e geração em lote por carga horária
- validação pública de certificados por código
- endpoints públicos para listar eventos publicados e detalhes por slug

## Modelo de dados (resumo)

Principais entidades do Prisma:

- `User`
- `RefreshToken`
- `Event`
- `EventDay`
- `EventLocation`
- `Activity`
- `Speaker` + `ActivitySpeaker`
- `Stand`
- `EventRegistration`
- `Attendance`
- `Certificate`
- `CertificateTemplate`
- `Sponsor`

## Endpoints principais

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Eventos e programação

- `GET /api/events`
- `POST /api/events`
- `GET /api/events/:id`
- `PUT /api/events/:id`
- `POST /api/events/:id/publish`
- `POST /api/events/:eventId/days`
- `POST /api/events/:eventId/days/:dayId/activities`
- `POST /api/events/:eventId/speakers`
- `POST /api/events/:eventId/stands`

### Presença e certificados

- `POST /api/attendance/checkin`
- `POST /api/attendance/checkin/manual`
- `GET /api/attendance/event/:eventId/summary`
- `POST /api/certificates/templates`
- `POST /api/certificates/generate`
- `GET /api/certificates/validate/:code`

### Público

- `GET /api/public/events`
- `GET /api/public/events/:slug`
- `GET /api/public/certificates/validate/:code`

## Como rodar localmente

Abra dois terminais, um para o backend e outro para o frontend.

### 1) Backend

```bash
cd back
cp .env.example .env
npm install
npx prisma db push
npm run dev
```

API disponível em `http://localhost:3001`  
Health check: `http://localhost:3001/health`

### 2) Frontend

```bash
cd front
npm install
npm run dev
```

Painel disponível em `http://localhost:5174`.

### 3) Variáveis de ambiente

#### Backend (`back/.env`)

Baseado em `back/.env.example`:

- `PORT`
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`
- `FRONTEND_URL`
- `PUBLIC_SITE_URL`
- `UPLOAD_DIR`
- `API_BASE_URL`

#### Frontend (`front/.env`, opcional)

Se quiser sobrescrever o endereço da API:

```bash
VITE_API_URL=http://localhost:3001/api
```

## Comandos úteis

### Backend

```bash
npm run dev
npm run build
npm run start
npm run db:migrate
npm run db:generate
npm run db:studio
npm run db:seed
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Status atual da branch (21/03/2026)

Durante a análise deste repositório:

- `back`: `npm run build` executa com sucesso
- `front`: `npm run build` falha por erros de tipagem/lint TypeScript
- `back`: `npm run db:seed` falha por incompatibilidade no campo `speaker` em `prisma/seed.ts`

Ou seja: o fluxo principal de desenvolvimento funciona via `npm run dev`, mas há pendências para build de produção do frontend e para seed do banco.
