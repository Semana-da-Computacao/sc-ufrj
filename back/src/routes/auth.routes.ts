/**
 * Rotas de Autenticação
 * Endpoints públicos e protegidos de auth
 */
import { Router } from "express";
import {
  register,
  login,
  refreshAccessToken,
  logout,
  getMe,
  changePassword,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Rotas públicas
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);

// Rotas protegidas
router.get("/me", authenticate, getMe);
router.put("/change-password", authenticate, changePassword);

export default router;
