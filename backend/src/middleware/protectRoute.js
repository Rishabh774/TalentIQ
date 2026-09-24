import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";
import { resolveInitialRole } from "../lib/roles.js";

export async function protectRoute(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - no token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, ENV.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Unauthorized - invalid token" });
    }

    const googleId = decoded.sub;
    if (!googleId) return res.status(401).json({ message: "Unauthorized - invalid token" });

    const user = await User.findOne({ googleId });
    if (!user) return res.status(401).json({ message: "Unauthorized - user not found" });

    if (resolveInitialRole(user.email).role === "admin" && user.role !== "admin") {
      user.role = "admin";
      user.roleSet = true;
      await user.save();
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
