import TaskItem from "./TaskItem.jsx";

export default function TaskList({ tasks, onToggle, onDelete, disabled }) {
  if (tasks.length === 0) {
    return (
      <p className="empty-state" role="status">
        Nenhuma tarefa ainda. Adicione a primeira acima.
      </p>
    );
  }

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <section className="task-list-section">
      <p className="task-summary">
        {completedCount} de {tasks.length}{" "}
        {tasks.length === 1 ? "concluída" : "concluídas"}
      </p>
      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            disabled={disabled}
          />
        ))}
      </ul>
    </section>
  );
}
