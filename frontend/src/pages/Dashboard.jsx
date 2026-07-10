import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";
import { AuthContext } from "../contexts/authContext.js";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/api.js";
import {
  STATUS_FILTERS,
  filterTasksByStatus,
  getUniqueCategories,
} from "../utils/tasks.js";
import "../styles/Dashboard.css";
import "../styles/Tasks.css";

export default function Dashboard() {
  const { userName, userEmail } = useContext(AuthContext);
  const displayName = userName || userEmail || "usuário";

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    try {
      setError("");
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Não foi possível carregar as tarefas.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) return;

    try {
      setSubmitting(true);
      setError("");
      const task = await createTask(title, category, description);
      setTasks((current) => [task, ...current]);
      setTitle("");
      setCategory("");
      setDescription("");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Não foi possível criar a tarefa.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(task) {
    try {
      setBusyId(task.id);
      setError("");
      const updated = await updateTask(task.id, !task.completed);
      setTasks((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Não foi possível atualizar a tarefa.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id) {
    try {
      setBusyId(id);
      setError("");
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task.id !== id));
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Não foi possível remover a tarefa.",
      );
    } finally {
      setBusyId(null);
    }
  }

  const knownCategories = useMemo(() => getUniqueCategories(tasks), [tasks]);

  const visibleTasks = useMemo(() => {
    const byStatus = filterTasksByStatus(tasks, statusFilter);

    if (categoryFilter === "all") {
      return byStatus;
    }

    return byStatus.filter(
      (task) => (task.category?.trim() || "Geral") === categoryFilter,
    );
  }, [tasks, statusFilter, categoryFilter]);

  const listTitle = useMemo(() => {
    const statusLabel =
      STATUS_FILTERS.find((item) => item.id === statusFilter)?.label || "Todas";

    if (categoryFilter === "all") {
      return statusLabel;
    }

    return `${statusLabel} · ${categoryFilter}`;
  }, [statusFilter, categoryFilter]);

  return (
    <div className="dashboard">
      <section className="dashboard-intro">
        <div>
          <h2>Início</h2>
          <p>
            Olá <span className="welcome-name">{displayName}</span>! Seja bem
            vindo a sua lista de tarefas.
          </p>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-header">
          <h3>Adicionar à lista</h3>
        </div>
        <TaskForm
          title={title}
          category={category}
          description={description}
          categories={knownCategories}
          onTitleChange={setTitle}
          onCategoryChange={setCategory}
          onDescriptionChange={setDescription}
          onSubmit={handleSubmit}
          loading={submitting}
        />
        {error && <p className="error">{error}</p>}
      </section>

      <section className="dashboard-toolbar">
        <div className="filter-group" role="tablist" aria-label="Status">
          {STATUS_FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={statusFilter === item.id}
              className={
                statusFilter === item.id ? "filter-btn active" : "filter-btn"
              }
              onClick={() => setStatusFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <label className="category-filter">
          <span className="category-filter-label">Categoria</span>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            aria-label="Filtrar por categoria"
          >
            <option value="all">Todas as categorias</option>
            {knownCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="dashboard-panel">
        <div className="panel-header">
          <h3>{listTitle}</h3>
          <span className="count-pill">{visibleTasks.length}</span>
        </div>
        {loading ? (
          <p className="empty-state">Carregando tarefas...</p>
        ) : (
          <TaskList
            tasks={visibleTasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            busyId={busyId}
          />
        )}
      </section>
    </div>
  );
}
