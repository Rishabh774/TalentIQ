import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { requireRole } from "../middleware/requireRole.js";
import {
  createSession,
  endSession,
  getActiveSessions,
  getMyRecentSessions,
  getSessionById,
  joinSession,
  updateSessionProblem,
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/", protectRoute, requireRole("interviewer", "admin"), createSession);
router.get("/active", protectRoute, getActiveSessions);
router.get("/my-recent", protectRoute, getMyRecentSessions);

router.get("/:id", protectRoute, getSessionById);
router.post("/:id/join", protectRoute, joinSession);
router.post("/:id/end", protectRoute, endSession);
router.patch(
  "/:id/problem",
  protectRoute,
  requireRole("interviewer", "admin"),
  updateSessionProblem
);

export default router;
