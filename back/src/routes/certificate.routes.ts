/**
 * Rotas de Certificados
 */
import { Router } from "express";
import {
  createTemplate, updateTemplate, deleteTemplate,
  generateCertificates, listEventCertificates,
  validateCertificate, myMyCertificates, renderCertificateHtml,
} from "../controllers/certificate.controller";
import { authenticate } from "../middleware/auth.middleware";
import { isAdmin, isAdminOrCoordinator } from "../middleware/role.middleware";

const router = Router();

// Templates
router.post("/templates", authenticate, isAdmin, createTemplate);
router.put("/templates/:templateId", authenticate, isAdmin, updateTemplate);
router.delete("/templates/:templateId", authenticate, isAdmin, deleteTemplate);

// Geração em lote
router.post("/generate", authenticate, isAdminOrCoordinator, generateCertificates);

// Consultas
router.get("/event/:eventId", authenticate, isAdminOrCoordinator, listEventCertificates);
router.get("/user/me", authenticate, myMyCertificates);
router.get("/:id/render", authenticate, renderCertificateHtml);

// Validação pública (sem autenticação)
router.get("/validate/:code", validateCertificate);

export default router;
