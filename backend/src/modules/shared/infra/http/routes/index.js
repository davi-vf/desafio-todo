import { Router } from "express";
import { sessionRoutes } from "./sessions.routes.js";
import { taskRoutes } from "./tasks.routes.js";
import { userRoutes } from "./users.routes.js";

const routes = Router();

routes.use("/api/users", userRoutes);
routes.use("/api/sessions", sessionRoutes);
routes.use("/api/tasks", taskRoutes);

export default routes;
