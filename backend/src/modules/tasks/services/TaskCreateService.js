import { AppError } from "../../shared/errors/AppError.js";
import TaskRepository from "../repositories/TaskRepository.js";

class TaskCreateService {
  async execute({ userId, title, category, description }) {
    const trimmedTitle = title?.trim();

    if (!trimmedTitle) {
      throw new AppError("O título é obrigatório.", 400);
    }

    const trimmedCategory = category?.trim() || "Geral";
    const trimmedDescription = description?.trim() || "";

    if (trimmedCategory.length > 40) {
      throw new AppError("A categoria deve ter no máximo 40 caracteres.", 400);
    }

    if (trimmedDescription.length > 500) {
      throw new AppError("A descrição deve ter no máximo 500 caracteres.", 400);
    }

    return TaskRepository.create({
      title: trimmedTitle,
      description: trimmedDescription,
      category: trimmedCategory,
      userId,
    });
  }
}

export default new TaskCreateService();
