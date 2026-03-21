/**
 * Rotas de Eventos — inclui dias, locais, atividades, palestrantes e stands
 */
import { Router } from "express";
import {
  listEvents, getEvent, createEvent, updateEvent, deleteEvent,
  togglePublish, addCoordinator, removeCoordinator,
  getRegistrations, registerForEvent, cancelRegistration, getEventStats,
} from "../controllers/event.controller";
import {
  createDay, updateDay, deleteDay,
  createLocation, updateLocation, deleteLocation,
  createActivity, updateActivity, deleteActivity,
  getActivity, getActivityAttendances,
} from "../controllers/activity.controller";
import {
  listSpeakers, getSpeaker, createSpeaker, updateSpeaker, deleteSpeaker,
  addSpeakerToActivity, removeSpeakerFromActivity,
} from "../controllers/speaker.controller";
import {
  listStands, getStand, createStand, updateStand, deleteStand, reorderStands,
} from "../controllers/stand.controller";
import { authenticate } from "../middleware/auth.middleware";
import { isAdmin, isAdminOrCoordinator, isAnyRole } from "../middleware/role.middleware";

const router = Router();

// ─── Eventos ──────────────────────────────────────────────────────────────────
router.get("/", authenticate, listEvents);
router.get("/:id", authenticate, getEvent);
router.post("/", authenticate, isAdmin, createEvent);
router.put("/:id", authenticate, isAdminOrCoordinator, updateEvent);
router.delete("/:id", authenticate, isAdmin, deleteEvent);
router.post("/:id/publish", authenticate, isAdmin, togglePublish);
router.get("/:id/stats", authenticate, isAdminOrCoordinator, getEventStats);

// ─── Inscrições ───────────────────────────────────────────────────────────────
router.get("/:id/registrations", authenticate, isAdminOrCoordinator, getRegistrations);
router.post("/:id/register", authenticate, isAnyRole, registerForEvent);
router.delete("/:id/registrations/:userId", authenticate, isAnyRole, cancelRegistration);

// ─── Coordenadores ────────────────────────────────────────────────────────────
router.post("/:id/coordinators", authenticate, isAdmin, addCoordinator);
router.delete("/:id/coordinators/:userId", authenticate, isAdmin, removeCoordinator);

// ─── Palestrantes do evento ───────────────────────────────────────────────────
router.get("/:eventId/speakers", authenticate, listSpeakers);
router.get("/:eventId/speakers/:speakerId", authenticate, getSpeaker);
router.post("/:eventId/speakers", authenticate, isAdminOrCoordinator, createSpeaker);
router.put("/:eventId/speakers/:speakerId", authenticate, isAdminOrCoordinator, updateSpeaker);
router.delete("/:eventId/speakers/:speakerId", authenticate, isAdminOrCoordinator, deleteSpeaker);

// ─── Stands ───────────────────────────────────────────────────────────────────
router.get("/:eventId/stands", authenticate, listStands);
router.get("/:eventId/stands/:standId", authenticate, getStand);
router.post("/:eventId/stands", authenticate, isAdminOrCoordinator, createStand);
router.put("/:eventId/stands/reorder", authenticate, isAdminOrCoordinator, reorderStands);
router.put("/:eventId/stands/:standId", authenticate, isAdminOrCoordinator, updateStand);
router.delete("/:eventId/stands/:standId", authenticate, isAdminOrCoordinator, deleteStand);

// ─── Dias do evento ───────────────────────────────────────────────────────────
router.post("/:eventId/days", authenticate, isAdminOrCoordinator, createDay);
router.put("/:eventId/days/:dayId", authenticate, isAdminOrCoordinator, updateDay);
router.delete("/:eventId/days/:dayId", authenticate, isAdmin, deleteDay);

// ─── Locais ───────────────────────────────────────────────────────────────────
router.post("/:eventId/days/:dayId/locations", authenticate, isAdminOrCoordinator, createLocation);
router.put("/:eventId/days/:dayId/locations/:locationId", authenticate, isAdminOrCoordinator, updateLocation);
router.delete("/:eventId/days/:dayId/locations/:locationId", authenticate, isAdmin, deleteLocation);

// ─── Atividades ───────────────────────────────────────────────────────────────
router.get("/:eventId/days/:dayId/activities/:activityId", authenticate, getActivity);
router.post("/:eventId/days/:dayId/activities", authenticate, isAdminOrCoordinator, createActivity);
router.put("/:eventId/days/:dayId/activities/:activityId", authenticate, isAdminOrCoordinator, updateActivity);
router.delete("/:eventId/days/:dayId/activities/:activityId", authenticate, isAdmin, deleteActivity);
router.get("/:eventId/days/:dayId/activities/:activityId/attendances", authenticate, isAdminOrCoordinator, getActivityAttendances);

// ─── Palestrantes em atividades ───────────────────────────────────────────────
router.post("/activities/:activityId/speakers", authenticate, isAdminOrCoordinator, addSpeakerToActivity);
router.delete("/activities/:activityId/speakers/:speakerId", authenticate, isAdminOrCoordinator, removeSpeakerFromActivity);

export default router;
