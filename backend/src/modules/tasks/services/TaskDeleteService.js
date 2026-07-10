import { AppError } from "../../shared/errors/AppError.js";
import TaskRepository from "../repositories/TaskRepository.js";

class TaskDeleteService {
  async execute({ userId, id }) {
    const taskId = Number(id);

    if (Number.isNaN(taskId)) {
      throw new AppError("ID inválido.", 400);
    }

    const existing = await TaskRepository.findByIdForUser(taskId, userId);

    if (!existing) {
      throw new AppError("Tarefa não encontrada.", 404);
    }

    return TaskRepository.remove(taskId);
  }
}

export default new TaskDeleteService();
