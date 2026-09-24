import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { requireRole } from "../middleware/requireRole.js";
import {
  submitFeedback,
  getFeedbackForSession,
  getMyGivenFeedback,
} from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/", protectRoute, requireRole("interviewer", "admin"), submitFeedback);
router.get("/mine", protectRoute, requireRole("interviewer", "admin"), getMyGivenFeedback);
router.get("/session/:sessionId", protectRoute, getFeedbackForSession);

export default router;
