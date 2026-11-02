# MICROVERSE API Architecture Specification

**Version:** 1.1.0 (Milestone 3 Core Backend & Authentication)  
**Environment:** Development & Production  
**Protocol:** RESTful JSON over HTTPS  
**Base URLs:**
- `http://localhost:5000/api`
- `http://localhost:5000/api/v1` (Versioned Alias)  
**Authentication Scheme:**
1. `Authorization: Bearer <token>` Header
2. `microverse_session` HTTP-Only Secure Cookie

---

## 1. Global Architectural Conventions

### 1.1 Envelope Format

All responses follow a uniform JSON envelope to guarantee predictable client-side consumption:

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

### 1.2 Security & Access Controls
- **Bcrypt Hashing:** Passwords are never stored in plaintext and password hashes are never exposed in any API response.
- **Role Escalation Protection:** User registration explicitly enforces `role: 'USER'`. User profile update endpoints disallow modifying `role`.
- **RBAC:** Endpoints under `/api/admin` require verified JWT token with `role === 'ADMIN'`. Non-admins receive `403 Forbidden`.
- **Dual Session Authentication:** Supports both Bearer authorization headers and HTTP-only cookies (`SameSite: Lax`, `Secure: true` in production).

---

## 2. System & Health Endpoints

### `GET /api/health` & `GET /api/v1/health`
Verifies laboratory engine runtime, active uptime, and live PostgreSQL database connectivity.

- **Auth Required:** No
- **Response `200 OK`:**
```json
{
  "status": "ONLINE",
  "laboratory": "MICROVERSE Embedded Intelligence Engine",
  "version": "1.0.0",
  "uptimeSeconds": 240,
  "timestamp": "2026-11-02T16:48:32.223Z",
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

## 3. Authentication & User Management (`/api/auth`)

### 3.1 `POST /api/auth/register`
Registers a new engineer account with password hashing and sets session cookie.

- **Auth Required:** No (Rate Limited)
- **Request Body:**
```json
{
  "email": "engineer@microverse.lab",
  "password": "SecurePassphrase123!",
  "name": "Alex Mercer",
  "username": "alex_embedded",
  "bio": "Embedded firmware developer"
}
```
- **Response `201 Created`:** Sets `Set-Cookie: microverse_session=...; HttpOnly; SameSite=Lax`
```json
{
  "success": true,
  "message": "Microverse engineer credentials registered successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "c7a86f91-2dc0-4497-b9c1-4b10fae7b990",
      "email": "engineer@microverse.lab",
      "username": "alex_embedded",
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
Authenticates existing credentials, generates JWT token, and sets HTTP-only session cookie.

- **Auth Required:** No (Rate Limited)
- **Request Body:**
```json
{
  "email": "engineer@microverse.lab",
  "password": "SecurePassphrase123!"
}
```

### 3.3 `POST /api/auth/logout`
Terminates the current session and clears the `microverse_session` HTTP-only cookie.

- **Auth Required:** No
- **Response `200 OK`:** Clears session cookie.

### 3.4 `GET /api/auth/me`
Retrieves the authenticated user's profile, badges, progress, and bookmarks.

- **Auth Required:** Yes (Bearer Token or Cookie)

### 3.5 `PUT /api/auth/profile`
Updates permitted profile information (`name`, `username`, `bio`, `avatar`).

- **Auth Required:** Yes (Bearer Token or Cookie)
- **Request Body:**
```json
{
  "name": "Alex Mercer, Sr.",
  "username": "alex_mercer_lead",
  "bio": "Firmware & Robotics Engineer specializing in STM32 bare-metal and FreeRTOS.",
  "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
}
```

---

## 4. Controller Endpoints (`/api/controllers`)

### 4.1 `GET /api/controllers`
Queries the PostgreSQL microcontroller catalog with flexible multi-field filtering and pagination.

- **Query Parameters:**
  - `search` (string): Keyword search across model name, common name, description, architecture, core, and applications.
  - `family` (string): Filter by silicon family (e.g. `STM32`, `ESP32`, `RP2040`, `AVR`, `PIC`, `8051`).
  - `architecture` (string): Filter by core architecture (e.g. `ARMv7E-M`, `Xtensa`, `AVR`).
  - `manufacturer` (string): Filter by manufacturer (e.g. `STMicroelectronics`, `Microchip`, `Espressif`, `Raspberry Pi`).
  - `application` (string): Filter by target domain (e.g. `Robotics`, `Motor Control`, `IoT`, `TinyML`).
  - `bitWidth` (number): `8`, `16`, `32`.
  - `page` (number): Default `1`.
  - `limit` (number): Default `20` (max `100`).
  - `sort` (string): `clock_desc`, `clock_asc`, `flash_desc`, `name_asc`.
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
      "slug": "stm32f401ret6",
      "family": "STM32",
      "architecture": "ARMv7E-M (32-bit RISC)",
      "core": "ARM Cortex-M4 with FPU",
      "manufacturer": "STMicroelectronics",
      "bitWidth": 32,
      "maxClockSpeedMHz": 84.0,
      "flashKb": 512.0,
      "sramKb": 96.0,
      "gpioCount": 50,
      "applications": "Robotics, Flight Controllers, Precision Motor Control, Physical AI",
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

### 4.2 `GET /api/controllers/:idOrSlug`
Retrieves a single microcontroller by UUID, slug, or model name.

- **Response `200 OK`:** Granular specifications including `specifications` JSON and `pinoutConfig` JSON.

### 4.3 `GET /api/controllers/:idOrSlug/related`
Retrieves related microcontroller targets sharing the same silicon family, architecture, or bit-width.

---

## 5. Lesson & Curriculum Endpoints (`/api/lessons`)

### 5.1 `GET /api/lessons`
Lists curriculum lessons with optional filtering by difficulty and draft visibility.

- **Query Parameters:**
  - `difficulty` (string): `BEGINNER`, `INTERMEDIATE`, `ADVANCED`.
  - `chapterId` (UUID): Filter by parent chapter.
  - `search` (string): Keyword match on title or summary.
  - `includeDrafts` (boolean): Allowed for ADMIN users to preview draft lessons (`isPublished: false`).
- **Response `200 OK`:** Array of lessons with chapter metadata and user completion status.

### 5.2 `GET /api/lessons/:slugOrId`
Fetches complete markdown syllabus text, code snippets, hardware diagrams, and public research notes. Enforces draft protection for non-admin requests.

### 5.3 `GET /api/lessons/:slugOrId/related`
Retrieves sibling lessons in the same chapter or sharing the same difficulty level.

### 5.4 `GET /api/chapters`
Returns all 8 master curriculum modules, nested sub-lesson arrays, key takeaways, and assessment status.
