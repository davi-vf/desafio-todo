import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import {
  createTask,
  deleteTask,
  getTasks,
  toggleTask,
} from "./services/api.js";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function loadTasks({ resetError = true } = {}) {
    const data = await getTasks();
    if (resetError) {
      setError("");
    }
    setTasks(data);
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchInitialTasks() {
      try {
        const data = await getTasks();
        if (!cancelled) {
          setTasks(data);
          setError("");
        }
      } catch {
        if (!cancelled) {
          setError(
            "Não foi possível carregar as tarefas. Verifique se a API está rodando.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchInitialTasks();

    return () => {
      cancelled = true;
    };
  }, []);

  async function runAction(action) {
    setBusy(true);
    setError("");

    try {
      await action();
      await loadTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function handleCreate(title) {
    return runAction(() => createTask(title));
  }

  function handleToggle(task) {
    return runAction(() => toggleTask(task.id, !task.completed));
  }

  function handleDelete(id) {
    return runAction(() => deleteTask(id));
  }

  return (
    <main className="app">
      <div className="app-shell">
        <header className="app-header">
          <p className="app-eyebrow">Desafio Fullstack</p>
          <h1>To-Do List</h1>
          <p className="app-lead">
            Organize suas tarefas com uma API simples em Node e uma interface em React.
          </p>
        </header>

        <section className="app-panel">
          <TaskForm onSubmit={handleCreate} disabled={busy || loading} />

          {error && (
            <p className="app-error" role="alert">
              {error}
            </p>
          )}

          {loading ? (
            <p className="loading-state" role="status">
              Carregando tarefas...
            </p>
          ) : (
            <TaskList
              tasks={tasks}
              onToggle={handleToggle}
              onDelete={handleDelete}
              disabled={busy}
            />
          )}
        </section>
      </div>
    </main>
  );
}
