# To-Do List

O projeto é um to-do list que permite ao usuário se cadastrar, adicionar tarefas por categorias, ver apenas as suas tarefas e marcar se já foram feitas ou não. Cada tarefa criada mostra a data e o horário de criação e pode ser concluída ou removida.

## Tecnologias

O sistema foi desenvolvido com arquitetura em camadas, cada uma com sua responsabilidade, utilizando JavaScript. No frontend, React (Vite) cuida da experiência visual. No backend, Node.js com Express, Prisma e PostgreSQL salvam as informações no banco. A autenticação usa JWT para proteger as rotas e bcrypt para fazer o hash das senhas. O projeto também inclui Docker Compose para subir API, frontend e banco juntos. Em produção (ou no `npm run dev` local), o `DATABASE_URL` pode apontar para o Supabase; o deploy previsto é Render (API) + Vercel (frontend).

## Arquitetura

Comecei pelo backend criando, em `modules`, duas pastas principais: `users` e `tasks`, além de `shared` para o que é comum (app, rotas, erros). A organização segue:

- **controller** — recebe a requisição da rota
- **service** — aplica as regras de negócio
- **repository** — acessa o banco de dados (Prisma)

## Como rodar com Docker

Neste modo o banco é o **Postgres do Compose** (não usa o Supabase). Com Docker Desktop instalado:

```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- API: http://localhost:3001
- Postgres: localhost:5432 (user/senha/db: `todo` / `todo` / `todo_db`)

Para parar: `Ctrl+C` ou `docker compose down`.

## Como rodar sem Docker (local)

### Pré-requisitos

- Node.js
- PostgreSQL local **ou** connection string do Supabase no `DATABASE_URL`

### Backend

```bash
cd backend
cp .env.example .env
# edite o .env com DATABASE_URL, JWT_SECRET e FRONTEND_URL
npm install
npx prisma migrate deploy
npm run dev
```

API em `http://localhost:3001`.

### Frontend

```bash
cd frontend
cp .env.example .env
# em dev, deixe VITE_API_URL vazio (usa o proxy do Vite)
npm install
npm run dev
```

App em `http://localhost:5173`.

**Atenção:** não rode Docker e Postgres local na porta `5432` ao mesmo tempo.

## Supabase (PostgreSQL na nuvem)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **Project Settings → Database**, copie a URI de conexão.
3. Cole em `DATABASE_URL` no `backend/.env` (local) e/ou nas variáveis do Render (produção).
4. Rode `npx prisma migrate deploy` (local) ou deixe o start do Render aplicar as migrations.

Não commite a URL real — só o `.env.example`. Nunca versione arquivos `.env`.

## Deploy (Render + Vercel)

Repositório: https://github.com/davi-vf/desafio-todo

Configs auxiliares já estão no repo: `render.yaml` e `frontend/vercel.json`.

### Render (API)

1. New → Web Service (ou Blueprint com o `render.yaml`).
2. Root directory: `backend`
3. Build: `npm install && npx prisma generate`
4. Start: `npx prisma migrate deploy && npm start`
5. Variáveis de ambiente:
   - `DATABASE_URL` — URI do Supabase
   - `JWT_SECRET` — segredo forte
   - `PASSWORD_RESET_CODE` — código de reset (dev)
   - `FRONTEND_URL` — URL do app na Vercel (ex.: `https://seu-app.vercel.app`)
   - `NODE_VERSION` — `22`

### Vercel (frontend)

1. Importar o mesmo repo; root directory: `frontend`
2. Framework: Vite; build `npm run build`; output `dist`
3. Variável de ambiente:
   - `VITE_API_URL` — `https://SEU-SERVICO.onrender.com/api`
4. Redeploy depois de salvar a env (Vite embute a variável no build).

## Endpoints principais

| Método | Rota | Auth | Descrição |
| ------ | ---- | ---- | --------- |
| POST | `/api/users` | não | Cadastro |
| POST | `/api/sessions/login` | não | Login (retorna JWT) |
| POST | `/api/users/password/reset` | não | Reset de senha (dev) |
| GET | `/api/tasks` | JWT | Listar tarefas do usuário |
| POST | `/api/tasks` | JWT | Criar tarefa |
| PATCH | `/api/tasks/:id` | JWT | Atualizar (ex.: concluir) |
| DELETE | `/api/tasks/:id` | JWT | Remover tarefa |

Nas rotas protegidas, envie o header: `Authorization: Bearer <token>`.

## Observação (reset de senha)

Em desenvolvimento, o código de reset fica em `PASSWORD_RESET_CODE` no `.env` (padrão do exemplo: `1234`). Não use isso em produção.
