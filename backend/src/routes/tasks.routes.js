import { Router } from "express";
import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
} from "../controllers/tasks.controller.js";

const router = Router();

router.get("/", listTasks);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
