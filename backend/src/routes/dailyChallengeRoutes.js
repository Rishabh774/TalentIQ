import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getTodayChallenge, completeDailyChallenge } from "../controllers/dailyChallengeController.js";

const router = express.Router();

router.get("/today", protectRoute, getTodayChallenge);
router.post("/complete", protectRoute, completeDailyChallenge);

export default router;
