# TaskFlix — To-Do List

## Apresentação do sistema

To-do com login. Nomeado como **TaskFlix**: a ideia é uma experiência semelhante ao aplicativo Netflix, muito mais interessante que um to-do genérico. O sistema permite criar tarefas no geral e também separar em categorias como esportes, trabalho, lazer ou qualquer outra. Basta criar a categoria e selecioná-la na hora de criar tarefas relacionadas a cada categoria.

As tarefas aparecem na página **Início** (dashboard principal) e podem ser filtradas por status (a fazer, concluídas, todas) e por categoria. Cada tarefa pode receber uma descrição opcional. Na criação, o horário e a data são registrados automaticamente. Dá pra remover a tarefa ou marcar como concluída.

Também existe a página **Minha lista**. Nela aparecem o número total de tarefas criadas, o total a fazer e o total concluídas, além das categorias. Depois de escolher uma categoria, dá pra filtrar por a fazer, concluídas ou todas, e marcar ou remover tarefas. A criação de tarefas fica só no **Início**.

Só o usuário logado vê as próprias tarefas.

## Como montei

Comecei desenvolvendo o backend com arquitetura em camadas pra eu organizar melhor o código e cada parte ter uma responsabilidade clara. Utilizei meu outro projeto como referência e criei `src/modules/users` e depois `src/modules/tasks`. O que é comum (app, rotas e erros) ficou em `src/modules/shared`.

Dentro da pasta `users` criei:

- `controllers` pra lidar com as requisições
- `services` pra regras de negócio
- `repositories` pra conversar com o banco através do Prisma

Também criei uma pasta `middlewares` na raiz do backend. Dentro dela ficaram dois arquivos: um responsável por aplicar o token de autenticação nas requisições do usuário já logado e outro pra capturar e tratar erros.

Dentro da pasta `tasks` segue a mesma arquitetura e a mesma ideia de responsabilidade única da pasta `users`: controllers, services e repositories.

O enunciado aceitava API só em memória, mas eu quis banco de verdade pra ficar mais profissional. Por isso usei **PostgreSQL** com Prisma desde o início. Rodei localmente e testei as requisições pelo **Insomnia** antes de começar a desenvolver o frontend. Nessa hora eu já tinha decidido que o sistema ia rodar no Render + Vercel e que utilizaria o Supabase como banco na nuvem, mas deixei essas alterações pra depois que o frontend estivesse finalizado e com resultado visual.

No frontend separei por `pages` e criei três arquivos, cada um responsável por uma página:

- `Login` — login, cadastro e recuperação de senha
- `Dashboard` — página principal (Início)
- `Tasks` — Minha lista

Criei uma pasta `styles` pra lidar com o CSS de cada área e manter a organização. Além disso:

- `components` — partes reutilizáveis das telas (layout, formulário de tarefa, item da lista, cards de estatística, etc.)
- `contexts` — estado de autenticação (token, dados do usuário, login e logout), pra não ficar espalhado em toda página
- `services` — chamadas HTTP pra API
- `utils` — funções auxiliares das tarefas: filtros (a fazer / concluídas / todas), categorias e formatação da data e horário de criação

No início o frontend tinha um visual bem básico. Utilizei a IA pra ajudar no estilo, enviando prints do visual da Netflix e do YouTube como referência. O primeiro resultado que ela entregou não batia com o que eu queria, então comecei a refinar o visual pedindo ajustes e testando até bater o que eu tinha idealizado.

No meio desse processo fui tendo ideias de melhorias — “isso ficaria melhor mais pro lado”, “isso deveria ficar na Minha lista”, “isso não tá legal, vou remover”. Usei engenharia de prompt e minha experiência diária com modelos de IA pra alinhar o visual. Depois de cada entrega eu checava o código pra ver se a arquitetura não tinha sido ferida. Também usei o modo de planejamento da IA: antes de executar a ideia eu lia o plano gerado pra ver se batia com o que eu precisava, e só então rodava e testava o resultado.

## Desafios

Os principais desafios foram no frontend. Foi a parte mais difícil de deixar exatamente do jeito que eu tinha idealizado. Cada pedaço do visual eu testava e mudava várias vezes até ficar harmônico.

Enquanto fazia esses testes, aproveitei pra encontrar erros e corrigir. Testei o caminho feliz (usuário que se cadastra e usa o sistema direito) e também o caminho de erro: errar e-mail no cadastro, errar senha no login, tentar entrar pela URL sem estar logado.

Outro desafio foi subir o backend no Render e o frontend na Vercel. Deu problema nos logs e precisei investigar. No banco, a conexão Direct do Supabase não funcionava bem com o Render (rede IPv6); resolvi usando a URI do **Session pooler**. No frontend de produção, as requisições estavam indo pra `/api` na própria Vercel em vez da API no Render — faltava configurar a variável `VITE_API_URL` e fazer redeploy. Também precisei ajustar o `FRONTEND_URL` no Render por causa do CORS.

## Stack

O sistema foi desenvolvido em JavaScript com arquitetura em camadas. No frontend, React (Vite) cuida da experiência visual. No backend, Node.js com Express, Prisma e PostgreSQL. A autenticação usa JWT pra proteger as rotas e bcrypt pro hash das senhas. O projeto inclui Docker Compose pra subir API, frontend e banco juntos. Em produção o banco fica no Supabase; a API está no Render e o frontend na Vercel.

## Como rodar

### Produção

- Frontend: https://desafio-todo-eta.vercel.app
- API: https://desafio-todo.onrender.com
- Health: https://desafio-todo.onrender.com/health
- Repositório: https://github.com/davi-vf/desafio-todo

No plano free do Render a API pode “dormir”. A primeira requisição depois de um tempo parado pode demorar uns 30–50 segundos.

### Com Docker

Sobe API, frontend e Postgres juntos:

```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- API: http://localhost:3001

Pra parar: `Ctrl+C` ou `docker compose down`.

Nesse modo o banco é o Postgres do Compose (não usa o Supabase).

### Sem Docker (local)

**Backend**

```bash
cd backend
cp .env.example .env
```

Edite o `.env` com `DATABASE_URL` (Postgres local ou URI do Supabase — de preferência Session pooler), `JWT_SECRET` e `FRONTEND_URL`.

```bash
npm install
npx prisma migrate deploy
npm run dev
```

API em http://localhost:3001.

**Frontend**

```bash
cd frontend
cp .env.example .env
```

Em desenvolvimento, deixe `VITE_API_URL` vazio pra usar o proxy do Vite.

```bash
npm install
npm run dev
```

App em http://localhost:5173.

Evite rodar Docker e Postgres local na porta `5432` ao mesmo tempo.

### Observação

O código de reset de senha em desenvolvimento fica em `PASSWORD_RESET_CODE` no `.env` (no exemplo: `1234`). Não use isso em produção de verdade.

## Testes

Testei o caminho feliz e os casos de erro que mais quebram um to-do com login.

### Onde testei
- Local (backend + frontend)
- Docker Compose
- Produção (Vercel + Render + Supabase)

### O que cobri
- Cadastro, login, logout e recuperação de senha (código de demo)
- E-mail incompleto (ex.: `sabado@gmail`) — precisa ser barrado no front e na API
- Rotas protegidas sem token e redirect quando já está logado
- Criar tarefas no **Início** (com e sem descrição/categoria), filtros, concluir e apagar
- **Minha lista**: contagens, categorias, drill-down e filtros (sem formulário de criação)
- Isolamento: um usuário não vê as tarefas do outro
- Smoke em produção: health da API, CORS e chamadas indo pro Render (não pra `/api` na Vercel)

### Observações
- No plano free do Render a API pode “dormir”; a primeira request depois de um tempo parado demora mais
- O reset de senha usa código fixo de desenvolvimento — não é fluxo de e-mail real
