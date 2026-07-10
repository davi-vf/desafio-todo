import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";
    const method = error.config?.method || "";
    const isPublicAuthRoute =
      requestUrl.includes("/sessions/login") ||
      requestUrl.includes("/users/password/reset") ||
      (requestUrl.endsWith("/users") && method === "post");

    if (status === 401 && !isPublicAuthRoute) {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export async function registerUser({ name, email, password }) {
  const response = await api.post("/users", { name, email, password });
  return response.data;
}

export async function loginUser({ email, password }) {
  const response = await api.post("/sessions/login", { email, password });
  return response.data;
}

export async function resetPassword({ email, resetCode, password }) {
  const response = await api.post("/users/password/reset", {
    email,
    resetCode,
    password,
  });
  return response.data;
}

export async function getTasks() {
  const response = await api.get("/tasks");
  return response.data;
}

export async function createTask(title, category, description) {
  const response = await api.post("/tasks", { title, category, description });
  return response.data;
}

export async function updateTask(id, completed) {
  const response = await api.patch(`/tasks/${id}`, { completed });
  return response.data;
}

export async function deleteTask(id) {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
}

export default api;
