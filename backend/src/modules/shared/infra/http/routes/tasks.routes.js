import { Router } from "express";
import { authMiddleware } from "../../../../../../middlewares/authMiddleware.js";
import TaskController from "../../../../tasks/controllers/TaskController.js";

const taskRoutes = Router();

taskRoutes.use(authMiddleware);

taskRoutes.get("/", (req, res, next) => {
  TaskController.index(req, res).catch(next);
});

taskRoutes.post("/", (req, res, next) => {
  TaskController.create(req, res).catch(next);
});

taskRoutes.patch("/:id", (req, res, next) => {
  TaskController.update(req, res).catch(next);
});

taskRoutes.delete("/:id", (req, res, next) => {
  TaskController.delete(req, res).catch(next);
});

export { taskRoutes };
