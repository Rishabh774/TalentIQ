import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { requireRole } from "../middleware/requireRole.js";
import {
  listProblems,
  listAllProblems,
  createProblem,
  updateProblem,
  deleteProblem,
} from "../controllers/problemController.js";

const router = express.Router();

router.get("/", protectRoute, listProblems);
router.get("/all", protectRoute, requireRole("admin"), listAllProblems);
router.post("/", protectRoute, requireRole("admin"), createProblem);
router.patch("/:id", protectRoute, requireRole("admin"), updateProblem);
router.delete("/:id", protectRoute, requireRole("admin"), deleteProblem);

export default router;
