export const STATUS_FILTERS = [
  { id: "todo", label: "A fazer" },
  { id: "done", label: "Concluídas" },
  { id: "all", label: "Todas" },
];

export function formatTaskDateTime(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function filterTasksByStatus(tasks, status) {
  if (status === "todo") {
    return tasks.filter((task) => !task.completed);
  }

  if (status === "done") {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
}

function sortCategoriesWithGeralLast(categories) {
  return [...categories].sort((a, b) => {
    if (a === "Geral") return 1;
    if (b === "Geral") return -1;
    return a.localeCompare(b, "pt-BR");
  });
}

export function getUniqueCategories(tasks) {
  const categories = [];

  for (const task of tasks) {
    const category = task.category?.trim() || "Geral";
    if (!categories.includes(category)) {
      categories.push(category);
    }
  }

  return sortCategoriesWithGeralLast(categories);
}

export function groupTasksByCategory(tasks) {
  const groups = new Map();

  for (const task of tasks) {
    const category = task.category?.trim() || "Geral";
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category).push(task);
  }

  return sortCategoriesWithGeralLast([...groups.keys()]).map((category) => ({
    category,
    tasks: groups.get(category),
  }));
}
