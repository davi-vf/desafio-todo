import cors from "cors";
import express from "express";
import tasksRoutes from "./routes/tasks.routes.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/tasks", tasksRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

export default app;
