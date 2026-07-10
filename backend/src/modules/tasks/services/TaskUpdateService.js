import { AppError } from "../../shared/errors/AppError.js";
import TaskRepository from "../repositories/TaskRepository.js";

class TaskUpdateService {
  async execute({ userId, id, completed }) {
    const taskId = Number(id);

    if (Number.isNaN(taskId)) {
      throw new AppError("ID inválido.", 400);
    }

    const existing = await TaskRepository.findByIdForUser(taskId, userId);

    if (!existing) {
      throw new AppError("Tarefa não encontrada.", 404);
    }

    const nextCompleted =
      typeof completed === "boolean" ? completed : !existing.completed;

    return TaskRepository.update(taskId, { completed: nextCompleted });
  }
}

export default new TaskUpdateService();
