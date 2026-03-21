/**
 * Rotas de Usuários
 */
import { Router } from "express";
import {
  listUsers, getUser, createUser, updateUser,
  deactivateUser, changeUserRole, getUserQRCode,
} from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { isAdmin, isAdminOrCoordinator } from "../middleware/role.middleware";

const router = Router();

router.get("/", authenticate, isAdmin, listUsers);
router.post("/", authenticate, isAdmin, createUser);
router.get("/:id", authenticate, isAdminOrCoordinator, getUser);
router.put("/:id", authenticate, isAdmin, updateUser);
router.delete("/:id", authenticate, isAdmin, deactivateUser);
router.put("/:id/role", authenticate, isAdmin, changeUserRole);
router.get("/:id/qrcode", authenticate, getUserQRCode);

export default router;
