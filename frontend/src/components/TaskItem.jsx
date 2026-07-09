export default function TaskItem({ task, onToggle, onDelete, disabled }) {
  return (
    <li className={`task-item ${task.completed ? "completed" : ""}`}>
      <label className="task-check">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
          disabled={disabled}
        />
        <span className="task-title">{task.title}</span>
      </label>
      <button
        type="button"
        className="task-delete"
        onClick={() => onDelete(task.id)}
        disabled={disabled}
        aria-label={`Remover ${task.title}`}
      >
        Remover
      </button>
    </li>
  );
}
