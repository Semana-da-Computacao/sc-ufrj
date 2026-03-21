/**
 * Configuração do app Express
 * Registra middlewares globais e rotas
 */
import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.routes";
import eventRoutes from "./routes/event.routes";
import attendanceRoutes from "./routes/attendance.routes";
import certificateRoutes from "./routes/certificate.routes";
import userRoutes from "./routes/user.routes";
import publicRoutes from "./routes/public.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// ─── Middlewares globais ───────────────────────────────────────────────────────

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5174",
      process.env.PUBLIC_SITE_URL || "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve arquivos de upload estáticos
app.use("/uploads", express.static(process.env.UPLOAD_DIR || "./uploads"));

// ─── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Rotas da API ─────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/users", userRoutes);
app.use("/api/public", publicRoutes);

// ─── Tratamento de erros ──────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
