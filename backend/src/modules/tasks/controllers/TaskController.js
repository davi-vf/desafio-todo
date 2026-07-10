import TaskCreateService from "../services/TaskCreateService.js";
import TaskDeleteService from "../services/TaskDeleteService.js";
import TaskListService from "../services/TaskListService.js";
import TaskUpdateService from "../services/TaskUpdateService.js";

class TaskController {
  async index(req, res) {
    const tasks = await TaskListService.execute(req.userId);
    return res.json(tasks);
  }

  async create(req, res) {
    const task = await TaskCreateService.execute({
      userId: req.userId,
      title: req.body?.title,
      category: req.body?.category,
      description: req.body?.description,
    });
    return res.status(201).json(task);
  }

  async update(req, res) {
    const task = await TaskUpdateService.execute({
      userId: req.userId,
      id: req.params.id,
      completed: req.body?.completed,
    });
    return res.json(task);
  }

  async delete(req, res) {
    const task = await TaskDeleteService.execute({
      userId: req.userId,
      id: req.params.id,
    });
    return res.json(task);
  }
}

export default new TaskController();
