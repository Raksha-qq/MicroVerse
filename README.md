# MICROVERSE: Interactive Laboratory of Embedded Intelligence

> A full-stack educational and simulation engine for microcontrollers, embedded firmware, real-time operating systems, and Physical AI.

![MICROVERSE Architecture Status](https://img.shields.io/badge/System-ONLINE-55C7FF?style=for-the-badge&logo=cpu)
![Database](https://img.shields.io/badge/PostgreSQL-Prisma%20ORM-10B981?style=for-the-badge&logo=postgresql)
![Frontend](https://img.shields.io/badge/React%2019-Vite%208-55C7FF?style=for-the-badge&logo=react)
![Backend](https://img.shields.io/badge/Node.js-Express%204-A5E3FF?style=for-the-badge&logo=node.js)

---

## 1. Project Overview

**MICROVERSE** is an interactive engineering platform dedicated to bridging the gap between theoretical computer architecture and real-world embedded systems. It provides deep architectural benchmarks, interactive register manipulation, memory-mapped I/O visualizations, virtual oscilloscope diagnostics, and a structured curriculum spanning 8 silicon families:
- **ARM Cortex-M** (STM32, RP2040, NXP LPC, SAMD)
- **Espressif Xtensa / RISC-V** (ESP32, ESP32-S3, ESP32-C3)
- **Microchip AVR** (ATmega328P, ATtiny85)
- **Microchip PIC** (PIC16F877A)
- **Intel 8051** (AT89C51 legacy bare-metal)

---

## 2. Full-Stack Architecture

MICROVERSE is built on a clean, decoupled, layered full-stack architecture:

```
microverse/
├── backend/                        # Node.js + Express REST API Engine
│   ├── prisma/
│   │   ├── schema.prisma           # Relational schema (PostgreSQL)
│   │   └── seed.js                 # Database seeder (14 controllers, 8 chapters, 16 lessons)
│   ├── src/
│   │   ├── config/                 # Centralized environment & app settings
│   │   │   └── index.js
│   │   ├── controllers/            # Request orchestration layer
│   │   │   ├── admin.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── bookmarks.controller.js
│   │   │   ├── controllers.controller.js
│   │   │   ├── experiments.controller.js
│   │   │   ├── lessons.controller.js
│   │   │   ├── progress.controller.js
│   │   │   ├── quizzes.controller.js
│   │   │   └── researchNotes.controller.js
│   │   ├── middleware/             # Security, JWT auth, rate-limiting, error handling
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js
│   │   │   └── validate.js
│   │   ├── routes/                 # RESTful route definitions
│   │   │   ├── admin.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── bookmarks.routes.js
│   │   │   ├── chapters.routes.js
│   │   │   ├── controllers.routes.js
│   │   │   ├── experiments.routes.js
│   │   │   ├── index.js
│   │   │   ├── lessons.routes.js
│   │   │   ├── progress.routes.js
│   │   │   ├── quizzes.routes.js
│   │   │   └── researchNotes.routes.js
│   │   ├── services/               # Core business logic & database queries
│   │   │   ├── admin.service.js
│   │   │   ├── auth.service.js
│   │   │   ├── bookmarks.service.js
│   │   │   ├── controllers.service.js
│   │   │   ├── experiments.service.js
│   │   │   ├── lessons.service.js
│   │   │   ├── progress.service.js
│   │   │   ├── quizzes.service.js
│   │   │   └── researchNotes.service.js
│   │   ├── utilities/              # Standardized API response and logger helpers
│   │   │   ├── apiResponse.js
│   │   │   └── logger.js
│   │   ├── validators/             # Zod input validation schemas
│   │   │   ├── auth.validator.js
│   │   │   ├── bookmarks.validator.js
│   │   │   ├── controllers.validator.js
│   │   │   ├── experiments.validator.js
│   │   │   ├── lessons.validator.js
│   │   │   ├── progress.validator.js
│   │   │   ├── quizzes.validator.js
│   │   │   └── researchNotes.validator.js
│   │   └── server.js               # Application bootstrap & health check
│   ├── .env.example
│   └── package.json
│
├── frontend/                       # React 19 + Vite 8 SPA Client
│   ├── public/                     # Static assets & icons
│   ├── src/
│   │   ├── assets/                 # SVGs, diagrams, and hero assets
│   │   ├── components/             # Reusable UI component library
│   │   │   └── common/             # Navbar, Footer, Button, Card, Badge, StatusPill
│   │   ├── context/                # Global React context (AuthContext)
│   │   ├── data/                   # Navigation links, constants, design token constants
│   │   ├── hooks/                  # Custom hooks (useAuth, useFetch, useLocalStorage)
│   │   ├── layouts/                # Master layout shell (MainLayout)
│   │   ├── pages/                  # Page route components
│   │   │   ├── ControllersPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LabPage.jsx
│   │   │   ├── LessonsPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── QuizzesPage.jsx
│   │   │   └── ResearchNotesPage.jsx
│   │   ├── services/               # API clients (controllerService, lessonService, etc.)
│   │   ├── styles/                 # Design system tokens and custom CSS
│   │   │   └── tokens.css
│   │   ├── App.jsx                 # React Router routing tree
│   │   ├── index.css               # Tailwind CSS v4 directives & root theme
│   │   └── main.jsx                # DOM entrypoint
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── docs/                           # Architecture Specifications
│   ├── API_ARCHITECTURE.md         # Exhaustive REST API specification
│   └── DATABASE_ER_DIAGRAM.md      # Mermaid ER diagram & relational schema notes
├── .env.example                    # Global environment variables template
├── .gitignore                      # Git exclusion rules (secrets protected)
└── README.md                       # Platform documentation
```

---

## 3. Visual Foundation & Design Tokens

MICROVERSE implements a dedicated cyber-physical design system:

| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Midnight** | `#0B1220` | Primary dark laboratory canvas background |
| **Deep Blue** | `#111E30` | Card, modal, and panel background surfaces |
| **Slate Blue** | `#192B40` | Structural borders, dividers, subtle grid lines |
| **Cyan Glow** | `#55C7FF` | Primary telemetry accent, active beacons, glowing pulses |
| **Ice Blue** | `#A5E3FF` | Secondary headings, subtitle accents, active highlights |
| **Cool White** | `#EAF5FF` | High-contrast readable typography |
| **Muted Blue** | `#8FA6BC` | Secondary text, register offsets, timing metadata |

### Typography
- **Headings:** `'Space Grotesk', sans-serif`
- **Body:** `'Inter', sans-serif`
- **Registers & Code:** `'JetBrains Mono', monospace`

---

## 4. Getting Started & Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **PostgreSQL**: v14.0 or later running on port `5432`

---

### Step 1: Clone and Configure Environment

```bash
git clone https://github.com/Raksha-qq/microverse.git
cd microverse
```

Copy the example environment files:

```bash
# Backend environment setup
cp backend/.env.example backend/.env

# Frontend environment setup
cp frontend/.env.example frontend/.env
```

Ensure `backend/.env` has your PostgreSQL credentials:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/microverse?schema=public"
JWT_SECRET="your_strong_jwt_secret_key_minimum_32_chars"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
NODE_ENV="development"
```

---

### Step 2: Database Initialization & Seeding

Navigate to `backend/`, push the Prisma schema to PostgreSQL, and seed the dataset:

```bash
cd backend
npm install

# Push relational schema & generate Prisma Client
npx prisma db push

# Seed 14 microcontrollers, 8 curriculum chapters, 16 lessons, and assessments
npm run prisma:seed
```

---

### Step 3: Run the Backend API

```bash
# In backend/
npm run dev
```

The backend server starts on `http://localhost:5000`.  
Verify health by visiting `http://localhost:5000/api/health`.

---

### Step 4: Run the Frontend Client

In a separate terminal:

```bash
cd frontend
npm install

# Start Vite development server
npm run dev
```

The frontend client starts on `http://localhost:5173`.

---

## 5. Verification & Health Checks

MICROVERSE includes a live database and subsystem telemetry check:

```bash
curl http://localhost:5000/api/health
```

Expected Response:
```json
{
  "status": "ONLINE",
  "laboratory": "MICROVERSE Embedded Intelligence Engine",
  "version": "1.0.0",
  "uptimeSeconds": 142,
  "environment": "development",
  "database": {
    "status": "CONNECTED",
    "engine": "PostgreSQL",
    "latencyMs": 2
  },
  "subsystems": {
    "auth": "OPERATIONAL",
    "controllers": "OPERATIONAL",
    "curriculum": "OPERATIONAL",
    "simulation": "OPERATIONAL",
    "researchNotebook": "OPERATIONAL"
  }
}
```

---

## 6. Security & Quality Control

- **Environment Secrets:** All `.env` files are excluded in `.gitignore` and untracked from the Git index.
- **Input Validation:** Every mutating endpoint is validated with Zod schemas.
- **Authentication:** Passwords are encrypted using Bcrypt (10 rounds) and access is guarded by JWT Bearer tokens.
- **Rate Limiting:** Protects endpoints against denial-of-service and brute force attacks.
- **Security Headers:** Enforced via Helmet with tuned Cross-Origin Resource Policies.

---

## 7. Architecture Documentation Links

- [Database ER Diagram & Relational Model](docs/DATABASE_ER_DIAGRAM.md)
- [REST API Architecture Specification](docs/API_ARCHITECTURE.md)

