import cors from "cors";
import express from "express";
import { errorHandler } from "../../../../../middlewares/errorHandler.js";
import routes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(routes);

app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

app.use(errorHandler);

export default app;
