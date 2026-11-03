# MICROVERSE: Interactive Laboratory of Embedded Intelligence

> A full-stack educational platform and simulation engine for microcontrollers, embedded systems, robotics, and Physical AI.

![System Status](https://img.shields.io/badge/System-ONLINE-55C7FF?style=for-the-badge&logo=cpu)
![Database](https://img.shields.io/badge/PostgreSQL-Prisma%20ORM-10B981?style=for-the-badge&logo=postgresql)
![Frontend](https://img.shields.io/badge/React%2019-Vite%208-55C7FF?style=for-the-badge&logo=react)
![Backend](https://img.shields.io/badge/Node.js-Express%204-A5E3FF?style=for-the-badge&logo=node.js)
![Tests](https://img.shields.io/badge/Tests-66%20Passed-10B981?style=for-the-badge&logo=checkmarx)

---

## 1. Project Overview

**MICROVERSE** is an interactive engineering platform dedicated to bridging the gap between theoretical computer architecture and real-world embedded robotics. It delivers deep architectural reference data, interactive register and pinout diagnostics, browser-based hardware simulations (signals, PWM, ultrasonic sensors, autonomous kinematics), structured curriculum progression, interactive quizzes with answer leak protection, silicon target bookmarks, an engineering research logbook, and administrative governance.

The platform distinguishes itself through high-density technical accuracy, real-time telemetry from PostgreSQL, responsive cyber-physical styling, and code-split performance.

---

## 2. Main Features

- **Microcontroller Silicon Registry (`/archive`):** Searchable reference archive of 19 verified chips across 7 families (ARM Cortex-M, STM32, ESP32, RP2040, PIC, AVR, 8051) with complete electrical matrices, interactive pinouts, and datasheet links.
- **Microcontroller Comparison Matrix (`/compare`):** Multi-device comparison tool aligning clock speeds, flash, SRAM, timers, peripherals, and robotics capability ratings side-by-side.
- **Embedded Curriculum Master Syllabus (`/lessons`):** 14 structured chapters with 30 in-depth lessons covering transistors, ALUs, registers, memory organization, GPIO, interrupts, communication buses (UART/SPI/I2C), RTOS, TinyML, and Physical AI.
- **Interactive Hardware Labs (`/lab`):** Five real-time browser simulations:
  1. *Signal Lab:* Digital logic levels, square waves, and timing diagrams.
  2. *PWM Lab:* Duty cycle, average voltage, and motor speed control.
  3. *Sensor Lab:* Ultrasonic HC-SR04 sonar with noise and distance filtering.
  4. *Robot Kinematics Lab:* 2D autonomous obstacle-avoiding mobile robot simulation.
  5. *Controller Selection Lab:* Hardware trade-off matrix for mission engineering.
- **Interactive Assessment & Quiz Engine (`/quizzes`):** Chapter knowledge-check quizzes with code snippets, backend grading, answer-leak protection, score calculations, and post-submission explanations.
- **Personalized Engineer Dashboard (`/dashboard`):** Real-time telemetry hub featuring progress percentage, completed modules, recently visited lessons with resume capability, assessment scorecards, saved circuits, and bookmarked silicon targets.
- **Engineering Research Logbook (`/research`):** Personal engineering notebook for recording firmware findings, register errata, and benchmark observations with tag indexing and silicon target linking.
- **Silicon Target Bookmarks:** One-click bookmarking on archive cards and spec modals, seamlessly persisted to PostgreSQL.
- **Laboratory Administration Panel (`/admin`):** Role-guarded governance interface for user role promotion/demotion, account management, silicon target authoring, curriculum management, and platform metric counters.

---

## 3. Technology Stack

### Frontend
- **Framework:** React 19 + Vite 8
- **Routing:** React Router v7 (with `React.lazy` route code-splitting)
- **Styling:** Tailwind CSS v4 + Space Grotesk / Inter / JetBrains Mono typography
- **Visuals & Icons:** Lucide React, Framer Motion, Three.js 3D Silicon visualizers
- **State & Context:** React Context (`AuthContext`) + LocalStorage fallback

### Backend
- **Runtime:** Node.js v20+
- **Framework:** Express 4.x
- **Database & ORM:** PostgreSQL + Prisma ORM 5.x
- **Authentication:** JWT Bearer tokens + `httpOnly` secure cookies + Bcrypt password hashing
- **Validation:** Zod 3.x schema validation on all incoming payloads
- **Security:** Helmet, CORS, Express Rate Limit, Parameterized SQL queries

---

## 4. Architecture Diagram

```mermaid
flowchart TD
    subgraph Client["Client Tier (React 19 + Vite 8 SPA)"]
        UI["Cyber-Physical UI & Interactive Visualizers"]
        Router["React Router v7 (Lazy Loaded Chunks)"]
        AuthCtx["Auth Context & Token Interceptor"]
        Labs["Browser Hardware Simulators (Signals, PWM, Robot Kinematics)"]
    end

    subgraph Gateway["API Gateway Tier (Express 4)"]
        SecHeaders["Helmet & CORS Security Headers"]
        RateLimiter["Rate Limiter (Brute-Force & DoS Guard)"]
        RouterAPI["REST API Router (/api)"]
        AuthMW["JWT & Cookie Authentication Middleware"]
        AdminMW["Role Guard (requireAdmin)"]
        ZodVal["Zod Input Validation Engine"]
    end

    subgraph ServiceTier["Service Logic Tier"]
        AuthSvc["Auth & Session Service"]
        CtrlSvc["Silicon Controller Registry"]
        CurricSvc["Curriculum & Progress Service"]
        QuizSvc["Quiz & Evaluation Engine"]
        ExpSvc["Experiment Configuration Service"]
        NoteSvc["Research Logbook Service"]
        AdminSvc["Admin Governance Service"]
    end

    subgraph Storage["Data Tier (PostgreSQL + Prisma ORM)"]
        DB[(PostgreSQL Database)]
        UserTbl["User & Session Records"]
        CtrlTbl["Silicon Controllers & Pinouts"]
        CurricTbl["Chapters, Lessons & Progress"]
        QuizTbl["Quizzes, Questions & Attempts"]
        ArtifactTbl["Bookmarks, Notes & Experiments"]
    end

    Client -->|HTTPS / REST API| Gateway
    Gateway --> ServiceTier
    ServiceTier -->|Parameterized Prisma Queries| Storage
```

---

## 5. Database Overview

The relational PostgreSQL database is managed via Prisma ORM and contains 10 primary models:

```mermaid
erDiagram
    USER ||--o{ USER_PROGRESS : tracks
    USER ||--o{ LESSON_PROGRESS : tracks
    USER ||--o{ QUIZ_ATTEMPT : attempts
    USER ||--o{ BOOKMARK : saves
    USER ||--o{ SAVED_EXPERIMENT : configures
    USER ||--o{ RESEARCH_NOTE : authors
    USER ||--o{ USER_BADGE : earns

    CHAPTER ||--|{ LESSON : contains
    CHAPTER ||--o| QUIZ : has
    QUIZ ||--|{ QUIZ_QUESTION : contains
    QUIZ ||--o{ QUIZ_ATTEMPT : receives

    CONTROLLER ||--o{ BOOKMARK : referenced_in
    CONTROLLER ||--o{ RESEARCH_NOTE : tagged_in
```

### Key Models & Constraints
- **`User`:** Identity, bcrypt hashed password, role (`USER` | `ADMIN`), bio, avatar.
- **`Controller`:** 35+ verified electrical attributes, pinouts, clock frequencies, bus counts, and datasheet links.
- **`Chapter` & `Lesson`:** Hierarchical curriculum records with markdown content and takeaway points.
- **`UserProgress` & `LessonProgress`:** Unique progress records guarded by `@@unique([userId, chapterId])` and `@@unique([userId, lessonId])`.
- **`Quiz`, `QuizQuestion`, `QuizAttempt`:** Assessment definitions with answer masking and historical scoring.
- **`Bookmark`:** Relational save state guarded by `@@unique([userId, itemType, itemId])`.
- **`ResearchNote`:** Engineering logbook records with category classification, tags, and controller linkage.
- **`SavedExperiment`:** Persisted circuit simulation states (PWM, sensor filters, robot parameters).

---

## 6. API Overview

All API endpoints are versioned under `/api`:

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Subsystem status and PostgreSQL ping latency |
| `POST` | `/api/auth/register` | Public | Register new engineer account |
| `POST` | `/api/auth/login` | Public | Authenticate session and receive JWT token |
| `POST` | `/api/auth/logout` | Authenticated | Disconnect engineer session |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated profile |
| `GET` | `/api/controllers` | Public | Search and filter silicon registry |
| `GET` | `/api/controllers/:slugOrId`| Public | Get controller specifications and pinout |
| `GET` | `/api/controllers/compare` | Public | Compare 2 to 4 microcontrollers |
| `POST` | `/api/controllers` | Admin Only | Create new silicon controller record |
| `PUT` | `/api/controllers/:id` | Admin Only | Update controller specifications |
| `DELETE`| `/api/controllers/:id` | Admin Only | Delete silicon controller record |
| `GET` | `/api/chapters` | Public | List all 14 curriculum chapters |
| `GET` | `/api/chapters/:slugOrId`| Public | Get chapter details and lessons |
| `GET` | `/api/lessons` | Public | List curriculum lessons |
| `POST` | `/api/lessons/:id/complete`| Authenticated | Mark lesson as completed |
| `GET` | `/api/quizzes` | Public | List quizzes (answers & explanations stripped) |
| `GET` | `/api/quizzes/attempts` | Authenticated | Get user's quiz attempt history |
| `POST` | `/api/quizzes/:id/submit`| Authenticated | Grade assessment answers and return scorecard |
| `GET` | `/api/bookmarks` | Authenticated | List user's bookmarked controllers |
| `POST` | `/api/bookmarks/toggle` | Authenticated | Toggle controller bookmark |
| `GET` | `/api/experiments` | Authenticated | List saved virtual lab circuits |
| `POST` | `/api/experiments` | Authenticated | Save virtual lab circuit configuration |
| `GET` | `/api/research-notes` | Authenticated | List personal engineering log notes |
| `POST` | `/api/research-notes` | Authenticated | Create research note with tags |
| `GET` | `/api/dashboard/stats` | Authenticated | Real-time user learning metrics & progress |
| `GET` | `/api/admin/metrics` | Admin Only | Platform-wide operational counts |
| `GET` | `/api/admin/users` | Admin Only | List registered users with search |
| `PUT` | `/api/admin/users/:id/role`| Admin Only | Elevate/demote role (self-demotion guarded) |
| `DELETE`| `/api/admin/users/:id` | Admin Only | Delete user account (self-deletion guarded) |

---

## 7. Local Setup

### Prerequisites
- **Node.js:** v18.0.0 or later (v20+ recommended)
- **PostgreSQL:** v14.0 or later running on port `5432`
- **npm:** v9.0.0 or later

### Step 1: Clone Repository
```bash
git clone https://github.com/Raksha-qq/microverse.git
cd microverse
```

### Step 2: Configure Environment Files
```bash
# In backend
cp backend/.env.example backend/.env

# In frontend
cp frontend/.env.example frontend/.env
```

### Step 3: Setup Backend & Database
```bash
cd backend
npm install

# Push Prisma schema to PostgreSQL
npx prisma db push

# Seed 19 controllers, 14 chapters, 30 lessons, and assessments
npm run prisma:seed
```

### Step 4: Run Application
In terminal 1 (Backend):
```bash
cd backend
npm run dev
```

In terminal 2 (Frontend):
```bash
cd frontend
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- Health Check: `http://localhost:5000/api/health`

---

## 8. Environment Configuration

### Backend (`backend/.env`)
```env
PORT=5000
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/microverse?schema=public"
JWT_SECRET="your_strong_jwt_secret_key_minimum_32_chars"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
NODE_ENV="development"
RATE_LIMIT_MAX=300
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL="/api"
```

---

## 9. Database Migration Instructions

When updating schema definitions in `backend/prisma/schema.prisma`:

1. **Development Migrations:**
   ```bash
   cd backend
   npx prisma migrate dev --name <migration_name>
   ```
2. **Production Migration Deployment:**
   ```bash
   cd backend
   npx prisma migrate deploy
   ```
3. **Re-generating Prisma Client:**
   ```bash
   npx prisma generate
   ```

---

## 10. Testing Instructions

MICROVERSE includes automated unit, integration, and full end-to-end user journey tests:

```bash
cd backend

# Run API integration test suite (38 tests)
npm test

# Run End-to-End User Journey test suite (28 tests)
npm run test:e2e

# Run complete test suite (66 tests)
npm run test:all
```

To test the frontend production build and bundle chunks:
```bash
cd frontend
npm run build
```

---

## 11. Deployment Instructions

### Frontend Deployment on Vercel
1. Link repository to Vercel.
2. Root directory: `frontend`.
3. Framework Preset: `Vite`.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Environment Variables:
   - `VITE_API_URL`: `https://your-backend-domain.onrender.com/api`
7. `vercel.json` handles SPA fallback rewrites and security headers automatically.

### Backend Deployment on Render
1. Create a **Blueprint** or **Web Service** linking the repository.
2. Select `render.yaml` at repository root or set:
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `node src/server.js`
   - Health Check Path: `/api/health`
3. Environment Variables:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Hosted PostgreSQL connection string
   - `JWT_SECRET`: Random 32+ character cryptographic secret
   - `CORS_ORIGIN`: Your Vercel frontend URL (`https://your-app.vercel.app`)

### Hosted PostgreSQL
- Supported providers: Supabase, Neon, Render PostgreSQL, AWS RDS, or Railway.
- Ensure SSL is enabled: append `?sslmode=require` to `DATABASE_URL` in production.

---

## 12. UI & Experience Preview

- **Silicon Archive Grid:** Glassmorphism cards with bit-width badges, clock frequencies, flash/SRAM stats, pinouts, and one-click bookmarking.
- **Hardware Simulation Console:** Interactive oscilloscope display with duty cycle sliders, real-time waveform canvas, ultrasonic echo timing, and 2D kinematics avoidance arena.
- **Engineering Assessment Suite:** Step-by-step multiple-choice quiz engine with syntax-highlighted code blocks, question selectors, and detailed post-submission technical explanations.
- **Laboratory Dashboard:** Cyber-physical telemetry cards, progress ring visualizations, recently visited lessons with resume buttons, and research logs.
- **Admin Governance Console:** System counters, user role toggles, security protections preventing self-demotion, and silicon target forms.

---

## 13. Known Limitations

- **Browser Audio:** Signal frequency generation uses Web Audio API; audio playback is subject to browser user-gesture policies on initial page load.
- **Offline Mode:** Initial page visits require an active internet connection to load 3D visualizer assets and WebGL fonts.
- **Cookie Cross-Origin Restrictions:** For decoupled frontends and backends on separate top-level domains, cookie sessions require HTTPS with `SameSite=None; Secure`; Bearer tokens are provided as the default cross-origin fallback.

---

## 14. Future Improvements

- **WebAssembly AVR / ARM Emulators:** In-browser compilation and execution of C/C++ firmware using GCC WebAssembly ports.
- **Collaborative Hardware Benches:** Multi-user real-time virtual breadboard editing via WebSockets.
- **Hardware In The Loop (HIL) Bridge:** WebSerial API integration to connect physical microcontrollers (STM32, ESP32, Arduino) directly to MICROVERSE for hardware telemetry streaming.
- **Expanded Physical AI Simulators:** Visualizing TinyML tensor operations, quantized neural network inference, and motor feedback loops in 3D.

---

## 15. License

MIT License. Designed and engineered for the **MICROVERSE Interactive Laboratory of Embedded Intelligence**.
