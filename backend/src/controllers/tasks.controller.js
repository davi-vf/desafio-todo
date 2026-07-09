import { tasks, getNextId } from "../data/tasks.js";

export function listTasks(req, res) {
  res.json(tasks);
}

export function createTask(req, res) {
  const title = req.body?.title?.trim();

  if (!title) {
    return res.status(400).json({ error: "O título é obrigatório." });
  }

  const task = {
    id: getNextId(),
    title,
    completed: false,
  };

  tasks.push(task);
  return res.status(201).json(task);
}

export function updateTask(req, res) {
  const id = Number(req.params.id);
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }

  if (typeof req.body?.completed === "boolean") {
    task.completed = req.body.completed;
  } else {
    task.completed = !task.completed;
  }

  return res.json(task);
}

export function deleteTask(req, res) {
  const id = Number(req.params.id);
  const index = tasks.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }

  const [removed] = tasks.splice(index, 1);
  return res.json(removed);
}
