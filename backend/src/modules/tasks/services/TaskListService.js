import TaskRepository from "../repositories/TaskRepository.js";

class TaskListService {
  async execute(userId) {
    return TaskRepository.findAllByUser(userId);
  }
}

export default new TaskListService();
