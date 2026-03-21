/**
 * Rotas de Presenças (Check-in)
 */
import { Router } from "express";
import {
  checkIn, manualCheckIn, removeAttendance,
  getUserAttendances, getEventAttendanceSummary,
} from "../controllers/attendance.controller";
import { authenticate } from "../middleware/auth.middleware";
import { isAdmin, isAdminOrCoordinator } from "../middleware/role.middleware";

const router = Router();

// Check-in via QR code (coordenadores e admins)
router.post("/checkin", authenticate, isAdminOrCoordinator, checkIn);
router.post("/checkin/manual", authenticate, isAdminOrCoordinator, manualCheckIn);

// Remover presença (apenas admin)
router.delete("/:attendanceId", authenticate, isAdmin, removeAttendance);

// Consultas de presença
router.get("/user/:userId", authenticate, getUserAttendances);
router.get("/event/:eventId/summary", authenticate, isAdminOrCoordinator, getEventAttendanceSummary);

export default router;
