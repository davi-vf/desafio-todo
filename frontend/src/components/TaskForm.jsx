import { useState } from "react";

export default function TaskForm({ onSubmit, disabled }) {
  const [title, setTitle] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    await onSubmit(trimmed);
    setTitle("");
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="task-title">
        Nova tarefa
      </label>
      <input
        id="task-title"
        type="text"
        placeholder="O que você precisa fazer?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={disabled}
        maxLength={120}
      />
      <button type="submit" disabled={disabled || !title.trim()}>
        Adicionar
      </button>
    </form>
  );
}
