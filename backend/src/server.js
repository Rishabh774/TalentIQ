import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import { ENV, validateEnv } from "./lib/env.js";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import executeRoutes from "./routes/executeRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";
import userRoutes from "./routes/userRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import dailyChallengeRoutes from "./routes/dailyChallengeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");

validateEnv();

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
const allowedOrigins = (ENV.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/execute", executeRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/daily-challenge", dailyChallengeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/problems", problemRoutes);

if (ENV.NODE_ENV === "production" && !process.env.VERCEL) {
  app.use(express.static(frontendDistPath));

  app.get("/{*any}", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, _next) => {
  console.error("Unhandled server error:", error);
  res.status(error.status || 500).json({
    message: ENV.NODE_ENV === "production" ? "Internal Server Error" : error.message,
  });
});

if (!process.env.VERCEL) {
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
    } catch (error) {
      console.error("💥 Error starting the server", error);
    }
  };

  startServer();
}

export default app;
