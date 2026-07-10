import { formatTaskDateTime } from "../utils/tasks.js";

export default function TaskItem({ task, onToggle, onDelete, busy }) {
  return (
    <article className={`task-card ${task.completed ? "completed" : ""}`}>
      <div className="task-card-top">
        <span className="task-category">{task.category || "Geral"}</span>
        <span className="task-status">
          {task.completed ? "Concluída" : "A fazer"}
        </span>
      </div>

      <h3 className="task-title">{task.title}</h3>

      {task.description ? (
        <p className="task-description">{task.description}</p>
      ) : null}

      <p className="task-date">{formatTaskDateTime(task.createdAt)}</p>

      <div className="task-actions">
        <button
          type="button"
          className="action-btn primary"
          onClick={() => onToggle(task)}
          disabled={busy}
        >
          {task.completed ? "Reabrir" : "Concluir"}
        </button>
        <button
          type="button"
          className="action-btn danger"
          onClick={() => onDelete(task.id)}
          disabled={busy}
          aria-label={`Remover tarefa ${task.title}`}
        >
          Remover
        </button>
      </div>
    </article>
  );
}
