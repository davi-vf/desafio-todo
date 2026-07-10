import { useCallback, useEffect, useMemo, useState } from "react";
import StatCard from "../components/StatCard.jsx";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";
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
  groupTasksByCategory,
} from "../utils/tasks.js";
import "../styles/Dashboard.css";
import "../styles/Tasks.css";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
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
      setError(err.message);
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
      setError(err.message);
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
      setError(err.message);
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
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  function handleSelectCategory(name) {
    setSelectedCategory(name);
    setStatusFilter("all");
  }

  function handleBackToCategories() {
    setSelectedCategory(null);
    setStatusFilter("all");
  }

  const knownCategories = useMemo(() => getUniqueCategories(tasks), [tasks]);

  const total = tasks.length;
  const todo = filterTasksByStatus(tasks, "todo").length;
  const done = filterTasksByStatus(tasks, "done").length;

  const categorySummaries = useMemo(() => {
    return groupTasksByCategory(tasks).map((group) => ({
      category: group.category,
      total: group.tasks.length,
      todo: group.tasks.filter((task) => !task.completed).length,
      done: group.tasks.filter((task) => task.completed).length,
    }));
  }, [tasks]);

  const categoryTasks = useMemo(() => {
    if (!selectedCategory) return [];

    return tasks.filter(
      (task) => (task.category?.trim() || "Geral") === selectedCategory,
    );
  }, [tasks, selectedCategory]);

  const visibleTasks = useMemo(
    () => filterTasksByStatus(categoryTasks, statusFilter),
    [categoryTasks, statusFilter],
  );

  useEffect(() => {
    if (
      selectedCategory &&
      !knownCategories.includes(selectedCategory) &&
      knownCategories.length > 0
    ) {
      setSelectedCategory(null);
    }
  }, [knownCategories, selectedCategory]);

  return (
    <div className="tasks-page">
      <section className="tasks-intro">
        <div>
          <h2>Minha lista</h2>
          <p>
            Escolha uma categoria para ver as tarefas. Depois filtre por Todas,
            A fazer ou Concluídas.
          </p>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard label="Total" value={loading ? "—" : total} />
        <StatCard
          label="A fazer"
          value={loading ? "—" : todo}
          tone="warning"
        />
        <StatCard
          label="Concluídas"
          value={loading ? "—" : done}
          tone="success"
        />
      </section>

      <section className="tasks-panel">
        <div className="panel-header">
          <h3>Nova tarefa</h3>
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

      {loading ? (
        <p className="empty-state">Carregando categorias...</p>
      ) : !selectedCategory ? (
        <section className="tasks-panel">
          <div className="panel-header">
            <h3>Categorias</h3>
            <span className="count-pill">{categorySummaries.length}</span>
          </div>

          {categorySummaries.length === 0 ? (
            <p className="empty-state">
              Nenhuma categoria ainda. Crie uma tarefa para começar.
            </p>
          ) : (
            <div className="category-picker">
              {categorySummaries.map((item) => (
                <button
                  key={item.category}
                  type="button"
                  className="category-picker-card"
                  onClick={() => handleSelectCategory(item.category)}
                >
                  <span className="category-picker-name">{item.category}</span>
                  <span className="category-picker-meta">
                    {item.total} tarefa{item.total === 1 ? "" : "s"}
                  </span>
                  <span className="category-picker-stats">
                    {item.todo} a fazer · {item.done} concluída
                    {item.done === 1 ? "" : "s"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <section className="tasks-toolbar">
            <button
              type="button"
              className="back-categories-btn"
              onClick={handleBackToCategories}
            >
              ← Categorias
            </button>

            <div className="filter-group" role="tablist" aria-label="Status">
              {STATUS_FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === item.id}
                  className={
                    statusFilter === item.id
                      ? "filter-btn active"
                      : "filter-btn"
                  }
                  onClick={() => setStatusFilter(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section className="tasks-panel">
            <div className="panel-header">
              <h3>{selectedCategory}</h3>
              <span className="count-pill">{visibleTasks.length}</span>
            </div>
            <TaskList
              tasks={visibleTasks}
              onToggle={handleToggle}
              onDelete={handleDelete}
              busyId={busyId}
            />
          </section>
        </>
      )}
    </div>
  );
}
