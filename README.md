# 📝 Fundoo Notes

A production-style, full-stack **note-taking application** built with Spring Boot and React.  
Inspired by Google Keep — enabling users to create, organize, and manage their personal notes through a clean REST API and modern frontend.

---

> **⚠️ Branch Strategy Notice**  
> This `main` branch is **documentation-only by design**. It contains only this README and project overview.  
> The runnable full-stack implementation lives in the **`develop`** branch.  
> See [Branch Strategy](#branch-strategy) below for details.

---

## 🏗️ Full-Stack Architecture Overview

```
┌───────────────────────────────────────────────────────┐
│                    FRONTEND (React)                    │
│  Browser → React Router → Pages → Services → Axios    │
│                  ↓ HTTP (JSON + JWT) ↓                 │
├───────────────────────────────────────────────────────┤
│                   BACKEND (Spring Boot)                │
│  Controller → Service → Repository → MySQL             │
│                                                        │
│  Event-Driven:  EventPublisher → RabbitMQ → Consumers  │
│  Cross-cutting: AOP │ Cache (Redis) │ Batch │ Security │
└───────────────────────────────────────────────────────┘
```

### Frontend Flow
```
User Interaction
  → React Page/Component
  → State Update (useState/useEffect)
  → Service API Call (Axios + interceptor)
  → Backend Response
  → React Re-render
```

### Backend Flow
```
HTTP Request
  → Controller (validation, routing)
  → Service (business logic, ownership checks)
  → Repository (JPA persistence)
  → MySQL Database
```

---

## 📦 Project Structure

### Backend (`src/main/java/com/fundoonotes/`)
```
├── FundooNotesApplication.java           # @EnableCaching
├── aspect/                               # AOP: logging & performance
├── batch/                                # Spring Batch: CSV import
├── cache/                                # Redis: token cache service
├── config/                               # Security (CORS), RabbitMQ, Redis
├── controller/                           # REST: User, Note, Reminder, Batch
├── dto/                                  # Request/Response/Event DTOs
├── entity/                               # User, Note, Reminder
├── exception/                            # Global handler + 8 custom exceptions
├── mapper/                               # Entity ↔ DTO conversion
├── messaging/                            # RabbitMQ publisher + 4 consumers
├── repository/                           # Spring Data JPA repositories
├── security/                             # JWT + TokenValidationService
└── service/                              # Interfaces + implementations
```

### Frontend (`frontend/src/`)
```
├── utils/
│   ├── apiClient.js                      # Axios instance + interceptors
│   ├── token.js                          # localStorage token management
│   └── validators.js                     # Client-side form validation
├── services/
│   ├── authService.js                    # /api/users/* calls
│   ├── noteService.js                    # /api/notes/* calls
│   └── reminderService.js               # /api/reminders/* calls
├── hooks/
│   ├── useAuth.js                        # Login/register/logout logic
│   └── useNotes.js                       # Notes CRUD + filtering
├── components/
│   ├── ProtectedRoute.jsx                # Auth guard
│   ├── Navbar.jsx                        # Top nav + search + logout
│   ├── Sidebar.jsx                       # View navigation
│   ├── NoteEditor.jsx                    # Note creation (Google Keep style)
│   ├── NoteCard.jsx                      # Presentational note card
│   └── NoteList.jsx                      # Grid layout with empty state
├── pages/
│   ├── LoginPage.jsx                     # Email + password login
│   ├── RegisterPage.jsx                  # Name + email + password register
│   ├── ForgotPasswordPage.jsx            # Email → OTP request
│   ├── ResetPasswordPage.jsx             # Email + OTP + new password
│   ├── DashboardPage.jsx                 # Active notes + creation
│   ├── ArchivePage.jsx                   # Archived notes
│   ├── TrashPage.jsx                     # Trashed notes + restore
│   └── ReminderPage.jsx                  # Reminder list + creation
├── router/
│   └── AppRoutes.jsx                     # Route configuration
├── App.jsx                               # Layout (Navbar + Sidebar + content)
├── main.jsx                              # React entry point
└── index.css                             # Global styles
```

---

## 🌿 Branch Strategy

| Branch | Purpose | Contains |
|--------|---------|----------|
| `main` | **Documentation only** | README, project overview, roadmap |
| `develop` | **Working codebase** | Full-stack: backend + frontend |
| `feature/part1/...` | **Part 1 history** | Backend foundation |
| `feature/part2/...` | **Part 2 history** | Advanced backend integration |
| `feature/part3/...` | **Part 3 history** | React frontend integration |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Java 21 | Language target |
| Spring Boot 3.5.0 | Application framework |
| Spring Web/Data JPA/Validation | REST + persistence + validation |
| Spring Security | BCrypt + CORS |
| Spring Cache + Redis | Caching + token management |
| Spring Batch | CSV bulk import |
| Spring AOP | Logging + performance |
| Spring AMQP + RabbitMQ | Event-driven messaging |
| MySQL | Relational database |
| JJWT 0.12.6 | JWT token handling |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI library |
| Vite 6 | Build tool + dev server |
| React Router 7 | Client-side routing |
| Axios | HTTP client + interceptors |
| CSS | Styling (plain CSS, no frameworks) |

---

## 🔌 API Endpoints (17 total)

### User Endpoints (5)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | Login, get JWT |
| POST | `/api/users/forgot-password` | Request OTP |
| POST | `/api/users/reset-password` | Reset with OTP |
| POST | `/api/users/logout` | Blacklist token |

### Note Endpoints (8) — require Authorization header
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notes` | Create note |
| GET | `/api/notes` | Get all notes |
| PATCH | `/api/notes/{id}/pin` | Pin |
| PATCH | `/api/notes/{id}/unpin` | Unpin |
| PATCH | `/api/notes/{id}/archive` | Archive |
| PATCH | `/api/notes/{id}/unarchive` | Unarchive |
| PATCH | `/api/notes/{id}/trash` | Trash |
| PATCH | `/api/notes/{id}/restore` | Restore |

### Reminder Endpoints (2)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reminders` | Create reminder |
| GET | `/api/reminders` | Get all reminders |

### Batch Endpoints (2)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/batch/import-notes` | Import CSV |
| GET | `/api/admin/batch/status/{id}` | Job status |

---

## 🔐 Token Flow

```
1. User logs in → backend returns JWT token
2. Frontend stores token in localStorage
3. Axios interceptor attaches token to every request (Authorization header)
4. Backend validates token via TokenValidationService
5. On logout → token blacklisted in Redis for remaining TTL
6. On 401 response → interceptor clears token, redirects to /login
```

---

## 🌐 Frontend Routing

| Path | Type | Component |
|------|------|-----------|
| `/login` | Public | LoginPage |
| `/register` | Public | RegisterPage |
| `/forgot-password` | Public | ForgotPasswordPage |
| `/reset-password` | Public | ResetPasswordPage |
| `/dashboard` | Protected | DashboardPage |
| `/archive` | Protected | ArchivePage |
| `/trash` | Protected | TrashPage |
| `/reminders` | Protected | ReminderPage |
| `/` | Redirect | → /dashboard |

---

## ✅ Part Completion Summary

### Part 1 — Backend Foundation ✅
- User registration & login with JWT
- Note CRUD with pin/archive/trash state transitions
- DTO-based API, exception handling, structured logging

### Part 2 — Advanced Backend Integration ✅
- RabbitMQ event-driven messaging (4 queues)
- Redis caching + token blacklisting + OTP management
- Spring Cache for notes (`@Cacheable`/`@CacheEvict`)
- Reminder entity + event flow
- AOP aspects (logging + performance)
- Spring Batch CSV import
- Forgot/reset password + logout

### Part 3 — React Frontend Integration ✅
- React + Vite setup with clean folder structure
- Axios client with JWT interceptor
- Protected routes with token guard
- Login / Register / Forgot / Reset password pages
- Dashboard with Google Keep-style note creation
- Archive, Trash, Reminder pages
- Client-side search filtering
- Loading / error / empty state handling
- CORS configuration for frontend-backend communication

---

## 🚀 Build & Run Instructions

### Prerequisites
- Java 21+, Maven 3.8+, MySQL 8.0+
- Redis 7.0+, RabbitMQ 3.12+
- Node.js 18+, npm 9+

### 1. Start Infrastructure
```bash
brew services start redis
brew services start rabbitmq
mysql.server start
```

### 2. Database Setup
```sql
CREATE DATABASE IF NOT EXISTS fundoo_notes;
```

### 3. Start Backend
```bash
git clone https://github.com/Devrajj-14/FunduNotes.git
cd FunduNotes
git checkout develop

export DB_USERNAME=root
export DB_PASSWORD=your_password
export JWT_SECRET=YourSecureSecretKeyAtLeast32CharsLong

./mvnw spring-boot:run
# Backend runs on http://localhost:8080
```

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### 5. Open Browser
Navigate to `http://localhost:5173` → Register → Login → Dashboard

---

## 📋 Backend Endpoint Gaps (Not Yet Implemented)
- **Labels**: No label entity/endpoints in backend → no LabelPage in frontend
- **Attachments**: No attachment entity/endpoints → no file upload UI
- **Search API**: No backend search endpoint → client-side filtering used
- **Pagination**: Backend returns all notes → frontend filters locally

---

## 🗺️ Roadmap

### Part 1 — Backend Foundation ✅
### Part 2 — Advanced Backend Integration ✅
### Part 3 — React Frontend Integration ✅

### Part 4 — Future Enhancements
- Labels (many-to-many)
- File attachments (cloud storage)
- Real-time collaboration
- OAuth2 social login
- CI/CD pipeline
- Docker containerization
- Production deployment

---

## 📄 License

This project is developed for educational purposes as part of the BridgeLabz training program.

---

*Built by [Devraj Goswami](https://github.com/Devrajj-14)*
