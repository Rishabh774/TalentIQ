import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getMyProgress, recordSolved, getLeaderboard } from "../controllers/progressController.js";

const router = express.Router();

router.get("/me", protectRoute, getMyProgress);
router.post("/solved", protectRoute, recordSolved);
router.get("/leaderboard", protectRoute, getLeaderboard);

export default router;
