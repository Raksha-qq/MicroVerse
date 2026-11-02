# MICROVERSE API Architecture Specification

**Version:** 1.0.0  
**Environment:** Development & Production  
**Protocol:** RESTful JSON over HTTPS  
**Default Base URL:** `http://localhost:5000/api`  
**Authentication Scheme:** Bearer JWT in `Authorization` header

---

## 1. Global Architectural Conventions

### 1.1 Envelope Format

All API responses follow a uniform JSON envelope to guarantee predictable client-side consumption:

#### Standard Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

#### Standard Error Response
```json
{
  "success": false,
  "error": "Descriptive error message",
  "details": [
    {
      "field": "email",
      "message": "Valid engineering email address is required"
    }
  ]
}
```

### 1.2 HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation failure or malformed payload.
- `401 Unauthorized`: Missing, invalid, or expired JWT token.
- `403 Forbidden`: Insufficient role permissions (e.g. non-ADMIN accessing admin endpoints).
- `404 Not Found`: Target resource does not exist in registry.
- `409 Conflict`: Unique constraint violation (e.g. duplicate email or slug).
- `429 Too Many Requests`: Rate limiter triggered.
- `500 Internal Server Error`: Uncaught laboratory exception.
- `503 Service Unavailable`: Database ping or underlying service degraded.

---

## 2. System & Health Endpoints

### `GET /api/health`
Verifies laboratory engine runtime, active uptime, and live PostgreSQL database connectivity.

- **Auth Required:** No
- **Response `200 OK`:**
```json
{
  "status": "ONLINE",
  "laboratory": "MICROVERSE Embedded Intelligence Engine",
  "version": "1.0.0",
  "uptimeSeconds": 182,
  "timestamp": "2026-11-02T14:32:44.320Z",
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

## 3. Authentication Endpoints (`/api/auth`)

### 3.1 `POST /api/auth/register`
Registers a new engineer account and auto-grants the initial `FIRST_EXPERIMENT` onboarding badge.

- **Auth Required:** No (Rate Limited)
- **Request Body:**
```json
{
  "email": "engineer@microverse.lab",
  "password": "SecurePassphrase123!",
  "name": "Alex Mercer",
  "bio": "Embedded firmware developer"
}
```
- **Response `201 Created`:**
```json
{
  "success": true,
  "message": "Microverse engineer credentials registered successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "c7a86f91-2dc0-4497-b9c1-4b10fae7b990",
      "email": "engineer@microverse.lab",
      "name": "Alex Mercer",
      "role": "USER",
      "bio": "Embedded firmware developer",
      "avatar": null,
      "createdAt": "2026-11-02T14:30:00.000Z"
    }
  }
}
```

### 3.2 `POST /api/auth/login`
Authenticates existing engineer credentials and issues a signed JWT session token.

- **Auth Required:** No (Rate Limited)
- **Request Body:**
```json
{
  "email": "engineer@microverse.lab",
  "password": "SecurePassphrase123!"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Session authenticated successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "c7a86f91-2dc0-4497-b9c1-4b10fae7b990",
      "email": "engineer@microverse.lab",
      "name": "Alex Mercer",
      "role": "USER",
      "bio": "Embedded firmware developer",
      "avatar": null,
      "badges": [
        {
          "id": "b1",
          "code": "FIRST_EXPERIMENT",
          "title": "Silicon Ignition"
        }
      ]
    }
  }
}
```

### 3.3 `GET /api/auth/me`
Fetches current authenticated engineer profile, completed chapters/lessons, bookmarks, and badges.

- **Auth Required:** Yes (`Bearer <token>`)
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "c7a86f91-2dc0-4497-b9c1-4b10fae7b990",
      "email": "engineer@microverse.lab",
      "name": "Alex Mercer",
      "role": "USER",
      "badges": [...],
      "progress": [...],
      "lessonProgress": [...],
      "bookmarks": [...],
      "_count": {
        "savedExperiments": 4,
        "attempts": 2,
        "bookmarks": 3,
        "researchNotes": 2
      }
    }
  }
}
```

### 3.4 `PUT /api/auth/profile`
Updates engineer personal bio, name, or avatar URI.

- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body:**
```json
{
  "name": "Alex Mercer, Sr.",
  "bio": "Firmware & Robotics Engineer specializing in STM32 bare-metal and FreeRTOS.",
  "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
}
```

---

## 4. Controller Endpoints (`/api/controllers`)

### 4.1 `GET /api/controllers`
Queries catalog of microcontrollers with filtering, search, and pagination.

- **Query Parameters:**
  - `search` (string): Keyword match on model, common name, or description.
  - `family` (string): e.g. `STM32`, `ESP32`, `AVR`, `RP2040`, `PIC`, `8051`.
  - `bitWidth` (number): `8`, `16`, `32`.
  - `wirelessOnly` (boolean): Filters targets with onboard RF.
  - `page` (number): Default `1`.
  - `limit` (number): Default `20`.
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Microcontrollers retrieved successfully.",
  "data": [
    {
      "id": "9366df42-4917-43cf-bc08-3e4b7897ee1b",
      "name": "STM32F401RET6",
      "commonName": "STM32F401RE (Nucleo Core)",
      "family": "STM32",
      "architecture": "ARMv7E-M (32-bit RISC)",
      "core": "ARM Cortex-M4 with FPU",
      "manufacturer": "STMicroelectronics",
      "bitWidth": 32,
      "maxClockSpeedMHz": 84.0,
      "flashKb": 512.0,
      "sramKb": 96.0,
      "gpioCount": 50,
      "isFeatured": true
    }
  ],
  "meta": {
    "total": 14,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### 4.2 `GET /api/controllers/featured`
Returns prominent microcontroller benchmarks for homepage and quick-select carousels.

- **Response `200 OK`:** Array of featured controllers sorted by clock speed.

### 4.3 `GET /api/controllers/:id`
Retrieves granular silicon specification, register maps (`specifications` JSON), pinout configurations (`pinoutConfig` JSON), and associated public research notes.

### 4.4 `GET /api/controllers/compare`
Side-by-side architectural parameter comparison for multiple controller UUIDs.
- **Query Parameter:** `ids=uuid1,uuid2,uuid3`
- **Response `200 OK`:** Array of controller objects matching the supplied IDs.

---

## 5. Lesson & Curriculum Endpoints (`/api/lessons` & `/api/chapters`)

### 5.1 `GET /api/lessons`
Fetches all curriculum micro-lessons with user completion flags.

- **Auth Required:** Optional (provides `isCompleted` flag when authenticated)
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "f86b45a0-97cb-4ca7-b28e-8e6d97cbe601",
      "chapterId": "488fbe6b-857e-4078-a0e2-6d2c479427b5",
      "lessonNumber": 1,
      "title": "MCU vs MPU Fundamentals & Silicon Topology",
      "slug": "mcu-vs-mpu-fundamentals",
      "summary": "Architectural trade-offs between integrated microcontrollers and microprocessors.",
      "estimatedMinutes": 12,
      "order": 1,
      "isCompleted": false,
      "chapter": {
        "id": "488fbe6b-857e-4078-a0e2-6d2c479427b5",
        "chapterNumber": 1,
        "title": "Foundations of Embedded Computing: Architecture & Topology",
        "level": "BEGINNER"
      }
    }
  ]
}
```

### 5.2 `GET /api/lessons/:slugOrId`
Fetches complete markdown syllabus text, code snippets, hardware diagrams, and public research notes for a specific lesson.

### 5.3 `POST /api/lessons/:id/complete`
Marks a specific lesson as completed for the authenticated engineer.

- **Auth Required:** Yes (`Bearer <token>`)

### 5.4 `GET /api/chapters`
Returns all 8 master curriculum modules, sub-lesson arrays, takeaways, and attached assessment metadata.

---

## 6. Quiz & Assessment Endpoints (`/api/quizzes`)

### 6.1 `GET /api/quizzes/chapter/:chapterId`
Retrieves assessment questions, code snippets, and multiple-choice options (without revealing correct answers).

- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "id": "quiz-uuid",
    "title": "Foundations of Embedded Computing Quiz",
    "passingScore": 70,
    "totalPoints": 40,
    "questions": [
      {
        "id": "q1",
        "question": "What is the primary architectural difference between Harvard and Von Neumann topologies?",
        "codeSnippet": null,
        "options": [
          "Harvard uses separate bus systems for code and data; Von Neumann shares a unified bus.",
          "Von Neumann has hardware floating point units while Harvard does not.",
          "Harvard only supports 8-bit registers."
        ],
        "points": 10
      }
    ]
  }
}
```

### 6.2 `POST /api/quizzes/:id/submit`
Evaluates engineer answers, stores a `QuizAttempt` record, updates curriculum progress if passed, and returns full question-by-question review with explanations.

- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body:**
```json
{
  "answers": {
    "question-id-1": 0,
    "question-id-2": 2
  }
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "attemptId": "attempt-uuid",
    "score": 40,
    "totalPoints": 40,
    "percentage": 100,
    "passed": true,
    "passingScore": 70,
    "review": [
      {
        "questionId": "question-id-1",
        "isCorrect": true,
        "pointsEarned": 10,
        "explanation": "Harvard architecture isolates instruction fetch and data access buses, preventing memory bus contention."
      }
    ]
  }
}
```

---

## 7. Progress Endpoints (`/api/progress`)

### 7.1 `GET /api/progress`
Returns high-level and granular completion analytics across chapters and lessons.

- **Auth Required:** Yes (`Bearer <token>`)
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "chapters": {
      "completed": 2,
      "total": 8,
      "percentage": 25,
      "details": [...]
    },
    "lessons": {
      "completed": 5,
      "total": 16,
      "percentage": 31,
      "details": [...]
    }
  }
}
```

### 7.2 `POST /api/progress/lesson/:lessonId`
Toggles lesson completion status.

---

## 8. Bookmark Endpoints (`/api/bookmarks`)

### 8.1 `GET /api/bookmarks`
Lists all silicon targets, chapters, or lessons bookmarked by the authenticated user.

### 8.2 `POST /api/bookmarks/toggle`
Atomically bookmarks or unbookmarks a specified resource.

- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body:**
```json
{
  "itemType": "CONTROLLER",
  "itemId": "9366df42-4917-43cf-bc08-3e4b7897ee1b"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "bookmarked": true,
    "bookmark": {
      "id": "bm-uuid",
      "itemType": "CONTROLLER",
      "itemId": "9366df42-4917-43cf-bc08-3e4b7897ee1b"
    }
  },
  "message": "Bookmark saved"
}
```

---

## 9. Experiment Endpoints (`/api/experiments`)

### 9.1 `GET /api/experiments`
Lists saved oscilloscope states, logic analyzer traces, and breadboard simulations for the user.

### 9.2 `POST /api/experiments`
Saves an interactive simulator state into PostgreSQL.

- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body:**
```json
{
  "title": "STM32 Timed PWM Servo Control Test",
  "description": "50Hz PWM wave calibration with 1.5ms neutral pulse width.",
  "experimentType": "PWM",
  "configState": {
    "timerFrequencyHz": 1000000,
    "periodArr": 20000,
    "pulseCcr": 1500,
    "prescalerPsc": 83
  },
  "schematicData": {
    "components": ["STM32F401", "SG90_Servo", "Logic_Probe"],
    "wires": [{ "from": "PA0", "to": "SERVO_SIG" }]
  }
}
```

---

## 10. Research Notes Endpoints (`/api/research-notes`)

### 10.1 `GET /api/research-notes`
Lists research notes (public notes + current user's notes). Supports filtering by `category` (`ARCHITECTURE`, `PERIPHERAL`, `PROTOCOL`, `EXPERIMENT`, `ROBOTICS`, `GENERAL`) and `search`.

### 10.2 `POST /api/research-notes`
Logs a new laboratory research note.

- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body:**
```json
{
  "title": "DMA FIFO Overrun Mitigation in High-Baud UART",
  "content": "Setting DMA FIFO threshold to half-full prevents overrun at 921,600 baud when CPU servicing RTOS context switches.",
  "category": "PERIPHERAL",
  "tags": "DMA,STM32,UART,RTOS",
  "controllerId": "9366df42-4917-43cf-bc08-3e4b7897ee1b",
  "isPublic": true
}
```

---

## 11. Admin Endpoints (`/api/admin`)

### 11.1 `GET /api/admin/metrics`
Aggregated counts of users, controllers, chapters, lessons, quizzes, attempts, and experiments.

- **Auth Required:** Yes (`role: "ADMIN"`)

### 11.2 `GET /api/admin/users`
Engineer registry directory with filter and privilege inspection.

### 11.3 `PUT /api/admin/users/:id/role`
Updates engineer security permissions (`USER` vs `ADMIN`).

