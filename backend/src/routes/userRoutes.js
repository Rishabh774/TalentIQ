import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { requireRole } from "../middleware/requireRole.js";
import { getMe, setMyRole, listUsers, updateUserRole } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/me/role", protectRoute, setMyRole);

router.get("/", protectRoute, requireRole("admin"), listUsers);
router.patch("/:id/role", protectRoute, requireRole("admin"), updateUserRole);

export default router;
