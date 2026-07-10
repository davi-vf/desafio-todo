import TaskItem from "./TaskItem.jsx";

export default function TaskList({ tasks, onToggle, onDelete, busyId }) {
  if (tasks.length === 0) {
    return <p className="empty-state">Nenhuma tarefa por aqui ainda.</p>;
  }

  return (
    <div className="task-rail">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          busy={busyId === task.id}
        />
      ))}
    </div>
  );
}
