# MICROVERSE — Interactive Laboratory of Embedded Intelligence

An interactive engineering learning platform for exploring **microcontrollers, embedded systems, robotics, and Physical AI** through structured lessons, controller reference data, and browser-based simulations.

> MICROVERSE is designed as a digital engineering laboratory: learn the concepts, inspect controller architectures, experiment with simulated signals and systems, and track your progress.

<!-- Add your actual application screenshot at docs/images/microverse-homepage.png -->
<p align="center">
  <img src="docs/images/microverse-homepage.png" alt="MICROVERSE homepage" width="100%">
</p>

## What you can explore

- **Controller archive and comparison** — browse controller specifications and compare device capabilities.
- **Embedded systems curriculum** — study chapters and lessons covering foundational hardware and embedded concepts.
- **Interactive anatomy and visualizers** — explore chip architecture, signals, pinouts, and related concepts.
- **Browser-based virtual labs** — experiment with signal behavior, PWM, sensor readings, robot behavior, and controller selection.
- **Quizzes and learning progress** — assess understanding and track completed learning content.
- **Personal engineering workspace** — save bookmarks, experiment configurations, and research notes.
- **Dashboard and administration** — view learning activity and manage platform content through role-restricted features.

The simulations are browser-based educational models. They do not execute firmware on a physical microcontroller or replace hardware measurements.

## Technology

| Area | Technologies |
|---|---|
| Frontend | React 19, Vite 8, React Router 7 |
| Styling and interaction | Tailwind CSS 4, Framer Motion, Lucide React |
| 3D / visualization | Three.js |
| Backend | Node.js, Express 4 |
| Database | PostgreSQL, Prisma ORM 5 |
| Validation and security | Zod, Helmet, CORS, express-rate-limit |
| Authentication | JSON Web Tokens, bcryptjs, HTTP-only cookies |

## Architecture

```mermaid
flowchart TD
    A[React + Vite frontend] -->|HTTP / JSON| B[Express API]
    B --> C[Routes]
    C --> D[Middleware and validation]
    D --> E[Controllers]
    E --> F[Services]
    F --> G[Prisma Client]
    G --> H[(PostgreSQL)]
    A --> I[Browser-based interactive labs]
```

The backend is organized into separate layers:

- `routes/` — API route definitions.
- `middleware/` — authentication, validation, rate limiting, and error handling.
- `controllers/` — request and response handling.
- `services/` — application and data-access logic.
- `validators/` — request schemas.
- `utilities/` — shared response and logging helpers.
- `prisma/` — database schema and seed scripts.

The frontend separates pages, reusable feature components, layouts, context, hooks, API clients, and service modules.

## Database model

The Prisma schema defines **14 models**:

`User`, `Controller`, `Chapter`, `Lesson`, `LessonProgress`, `Quiz`, `QuizQuestion`, `UserProgress`, `QuizAttempt`, `Bookmark`, `SavedExperiment`, `ResearchNote`, `Badge`, and `UserBadge`.

Together, these models represent user accounts, controller reference data, curriculum, assessments, progress, bookmarks, saved simulations, research notes, and achievements.

## Repository layout

```text
MICROVERSE/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── prisma/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utilities/
│   │   └── validators/
│   └── tests/
├── frontend/
│   └── src/
│       ├── api/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── data/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       └── styles/
├── docs/
├── .env.example
├── .gitignore
├── render.yaml
└── README.md
```

## Getting started

### Prerequisites

- Node.js (use a currently supported LTS release compatible with the installed Vite version).
- npm.
- PostgreSQL.
- Git.

### 1. Clone the repository

```bash
git clone https://github.com/Raksha-qq/MicroVerse.git
cd MicroVerse
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create `backend/.env` by copying `backend/.env.example`, then set your local PostgreSQL connection string and a unique JWT secret.

PowerShell:

```powershell
Copy-Item .env.example .env
```

Example backend environment:

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/microverse?schema=public"
JWT_SECRET="replace_with_a_unique_random_secret_of_at_least_32_characters"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
NODE_ENV="development"
RATE_LIMIT_MAX=300
```

Create the `microverse` database in PostgreSQL before continuing.

Generate the Prisma client and apply the schema to your development database:

```bash
npm run prisma:generate
npm run prisma:push
```

Seed the database:

```bash
npm run prisma:seed
```

The repository also contains additional seed scripts. Run those only if the project setup or seed script instructs you to do so; avoid blindly running multiple seed scripts against an existing database.

### 3. Configure the frontend

Open a second terminal at the repository root:

```bash
cd frontend
npm install
```

Create `frontend/.env` from its example:

PowerShell:

```powershell
Copy-Item .env.example .env
```

For local development, the frontend environment variable is:

```env
VITE_API_URL="/api"
```

The Vite development server proxies `/api` requests to `http://localhost:5000`.

### 4. Start the application

Terminal 1 — backend:

```bash
cd backend
npm run dev
```

Terminal 2 — frontend:

```bash
cd frontend
npm run dev
```

Open:

- Frontend: `http://localhost:5173`
- Backend health endpoint: `http://localhost:5000/api/health`

## Available scripts

### Backend

Run these from `backend/`:

| Command | Purpose |
|---|---|
| `npm run dev` | Start the API with Node's watch mode |
| `npm start` | Start the API |
| `npm test` | Run the API test script |
| `npm run test:e2e` | Run the end-to-end journey test script |
| `npm run test:all` | Run both test scripts sequentially |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:push` | Push the Prisma schema to the configured database |
| `npm run prisma:migrate` | Run Prisma development migrations |
| `npm run prisma:seed` | Run the primary seed script |

### Frontend

Run these from `frontend/`:

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

Test totals are intentionally not stated here. The scripts are present, but their exact test-case counts have not been independently verified.

## Environment variables

### Backend

| Variable | Purpose |
|---|---|
| `PORT` | Express server port (default: `5000`) |
| `DATABASE_URL` | PostgreSQL connection URL |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `JWT_EXPIRES_IN` | JWT lifetime (default: `7d`) |
| `CORS_ORIGIN` | Allowed frontend origin(s) |
| `NODE_ENV` | Runtime environment |
| `RATE_LIMIT_MAX` | General rate-limit maximum |

### Frontend

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | API base URL; `/api` is proxied by Vite during local development |

Do not commit `.env` files or put secrets in frontend variables. Variables prefixed with `VITE_` are exposed to the browser bundle and must never contain credentials.

## Database workflow

For local schema iteration, the project provides `npm run prisma:push` (`prisma db push`). For migration-based deployment, use Prisma migrations and ensure migration files have been created and committed before running `prisma migrate deploy`.

Do not assume `prisma migrate deploy` can deploy a schema that has never had migration files generated.

## Deployment notes

The repository includes a root `render.yaml`, which can be used as the starting point for backend deployment configuration. Review its service and environment settings before deploying.

For a separately hosted frontend and backend:

- Set the frontend's `VITE_API_URL` to the deployed API base URL, including `/api` if that is the API prefix expected by the frontend client.
- Set the backend's `CORS_ORIGIN` to the deployed frontend origin (for this Vercel deployment: `https://micro-verse.vercel.app`).
- Configure `DATABASE_URL` with the hosted PostgreSQL connection string.
- Set `NODE_ENV=production`.
- Set a strong, unique `JWT_SECRET` in the hosting provider's secret manager.
- Use HTTPS for production traffic.

The local Vite proxy applies only to the development server; it does not proxy requests in a deployed frontend build.

After the backend is connected to its production database, verify that `GET /api/chapters` returns curriculum chapters. If it returns an empty list, run `npm run prisma:seed:curriculum` once from the backend service shell. This seeds the curriculum without deleting user accounts; it does replace quiz questions for seeded chapters. Do not run `npm run prisma:seed` against production because that general development seed deletes existing user and application data.

## Security notes

- Keep real environment files out of version control.
- Use a unique, randomly generated JWT secret outside local development.
- Do not expose database credentials or signing secrets in frontend code.
- Restrict CORS to the intended frontend origin(s).
- Review dependency advisories before applying automatic or forceful dependency upgrades.

## Current scope and possible extensions

Potential future directions include firmware execution through an emulator, collaborative virtual benches, hardware-in-the-loop connectivity, and expanded Physical AI visualizations. These are future possibilities, not claims about currently implemented functionality.

## License

This repository declares the MIT License in its package metadata. See [`LICENSE`](LICENSE) for the license text.
