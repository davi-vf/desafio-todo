import { useEffect, useState } from "react";

const NEW_CATEGORY = "__new__";

export default function TaskForm({
  title,
  category,
  description,
  categories = [],
  onTitleChange,
  onCategoryChange,
  onDescriptionChange,
  onSubmit,
  loading,
}) {
  const [showDescription, setShowDescription] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);

  useEffect(() => {
    if (!title && !category && !description) {
      setCreatingNew(false);
      setShowDescription(false);
    }
  }, [title, category, description]);

  const knownCategories = categories.filter(
    (item) => item && item !== "Geral",
  );

  const selectValue = creatingNew ? NEW_CATEGORY : category || "Geral";

  function handleCategorySelect(event) {
    const value = event.target.value;

    if (value === NEW_CATEGORY) {
      setCreatingNew(true);
      onCategoryChange("");
      return;
    }

    setCreatingNew(false);
    onCategoryChange(value);
  }

  return (
    <form className="task-form" onSubmit={onSubmit}>
      <button
        type="button"
        className={`desc-toggle ${showDescription ? "open" : ""}`}
        onClick={() => setShowDescription((current) => !current)}
        disabled={loading}
      >
        Descrição
      </button>

      {showDescription && (
        <textarea
          className="task-description-input"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="Escreva uma descrição (opcional)"
          disabled={loading}
          aria-label="Descrição da tarefa"
          maxLength={500}
          rows={3}
        />
      )}

      <input
        type="text"
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        placeholder="O que você vai fazer?"
        disabled={loading}
        aria-label="Título da tarefa"
      />

      <select
        value={selectValue}
        onChange={handleCategorySelect}
        disabled={loading}
        aria-label="Categoria da tarefa"
      >
        <option value="Geral">Geral</option>
        {knownCategories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
        <option value={NEW_CATEGORY}>Nova categoria</option>
      </select>

      {creatingNew && (
        <input
          type="text"
          className="new-category-input"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          placeholder="Digite a nova categoria"
          disabled={loading}
          aria-label="Nome da nova categoria"
          maxLength={40}
          autoFocus
        />
      )}

      <button
        type="submit"
        className="submit-btn"
        disabled={loading || !title.trim()}
      >
        {loading ? "Adicionando..." : "Adicionar"}
      </button>
    </form>
  );
}
