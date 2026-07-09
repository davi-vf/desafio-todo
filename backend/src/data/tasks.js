let nextId = 4;

export const tasks = [
  { id: 1, title: "Estudar React", completed: false },
  { id: 2, title: "Revisar rotas da API", completed: true },
  { id: 3, title: "Publicar no GitHub", completed: false },
];

export function getNextId() {
  return nextId++;
}
