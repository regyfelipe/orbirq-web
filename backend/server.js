import express from "express";
import cors from "cors";
import config from "./src/config/index.js";
import logger from "./src/shared/logger/index.js";

// Import modules
import { authRoutes } from "./src/modules/auth/index.js";
import usuariosRoutes from "./src/modules/users/routes/usuariosRoutes.js";
import { invitesRoutes } from "./src/modules/invites/index.js";
import { questionsRoutes } from "./src/modules/questions/index.js";
import respostasRoutes from "./src/modules/answers/routes/respostasRoutes.js";
import feedbacksRoutes from "./src/modules/feedback/routes/feedbacksRoutes.js";
import dashboardRoutes from "./src/modules/analytics/routes/dashboardRoutes.js";
import bancasRoutes from "./src/modules/bancas/routes/bancasRoutes.js";
import disciplinasRoutes from "./src/modules/disciplinas/routes/disciplinasRoutes.js";
import materiasRoutes from "./src/modules/materias/routes/materiasRoutes.js";
import assuntosRoutes from "./src/modules/assuntos/routes/assuntosRoutes.js";
import instituicoesRoutes from "./src/modules/instituicoes/routes/instituicoesRoutes.js";
import turmasRoutes from "./src/modules/turmas/routes/turmasRoutes.js";

const app = express();

// --- Middleware CORS ---
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // permitir requests sem origin (ex: Postman)
      if (config.cors.origin.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: config.cors.credentials,
  })
);

app.use(express.json());

// --- Routes ---
app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/invites", invitesRoutes);
app.use("/questions", questionsRoutes);
app.use("/respostas", respostasRoutes);
app.use("/feedbacks", feedbacksRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/api", bancasRoutes);
app.use("/api", disciplinasRoutes);
app.use("/api", materiasRoutes);
app.use("/api", assuntosRoutes);
app.use("/api", instituicoesRoutes);
app.use("/turmas", turmasRoutes);

// --- Health check ---
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// --- Error handling middleware ---
app.use((err, req, res, next) => {
  logger.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(config.port, () => {
  logger.info(`🚀 Server running on port ${config.port}`);
});
