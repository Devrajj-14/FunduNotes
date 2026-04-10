# 📝 Fundoo Notes

A production-style, student-friendly **note-taking application backend** built with Spring Boot.  
Inspired by Google Keep — enabling users to create, organize, and manage their personal notes through a clean REST API with event-driven messaging, caching, batch processing, and AOP.

---

> **⚠️ Branch Strategy Notice**  
> This `main` branch is **documentation-only by design**. It contains only this README and project overview.  
> The runnable backend implementation lives in the **`develop`** branch.  
> See [Branch Strategy](#branch-strategy) below for details.

---

## 🏗️ Architecture Overview

The application follows a strict **layered architecture** with event-driven capabilities:

```
Client Request
  → Controller          (REST endpoint, request mapping, validation)
  → Service Layer       (business logic, ownership checks)
  → Repository Layer    (data persistence via Spring Data JPA)
  → Database            (MySQL)

Event-Driven:
  ├── EventPublisher     (publish to RabbitMQ exchanges)
  ├── Consumers          (UserEvent, Notification, Reminder, Audit)
  └── NotificationService (log/simulate → future email/push/in-app)

Cross-cutting:
  ├── Config            (Security, RabbitMQ, Redis configs)
  ├── Security          (JwtUtil, TokenValidationService)
  ├── Cache             (TokenCacheService — Redis-backed)
  ├── Aspect            (LoggingAspect, PerformanceAspect)
  ├── Batch             (Spring Batch CSV import)
  ├── Exception         (GlobalExceptionHandler, 8 custom exceptions)
  ├── Mapper            (EntityDtoMapper — entity ↔ DTO conversion)
  └── DTO               (request/response/event objects)
```

### Design Principles
- **Controllers are thin** — they only expose endpoints and delegate to services
- **Services contain business logic** — validation, ownership checks, state transitions
- **Entities never leak to API responses** — all output goes through DTOs
- **TokenValidationService centralizes auth** — wraps JWT + Redis blacklist check
- **Events are asynchronous** — RabbitMQ decouples producers from consumers
- **Cache is transparent** — internal methods with `@Cacheable`; no API signature drift
- **AOP aspects are scoped** — service.impl.* only for predictable behavior
- **Sensitive data is NEVER logged** — OTPs, tokens, passwords are protected

---

## 📦 Package Structure

```
com.fundoonotes
├── FundooNotesApplication.java           # @EnableCaching
├── aspect/
│   ├── LoggingAspect.java               # Method entry/exit logging (DEBUG)
│   └── PerformanceAspect.java           # Execution time measurement
├── batch/
│   ├── config/BatchConfig.java          # Job, Step, reader/processor/writer
│   ├── dto/NoteCsvRow.java              # CSV row DTO (OpenCSV)
│   ├── processor/NoteItemProcessor.java # Validates + transforms to Note
│   └── writer/NoteItemWriter.java       # Batch saves via NoteRepository
├── cache/
│   └── TokenCacheService.java           # Redis: verify tokens, OTPs, blacklist
├── config/
│   ├── RabbitMQConfig.java              # Exchanges, queues, bindings
│   ├── RedisConfig.java                 # RedisTemplate, CacheManager
│   └── SecurityConfig.java             # PasswordEncoder, permit-all chain
├── controller/
│   ├── UserController.java             # /api/users (5 endpoints)
│   ├── NoteController.java             # /api/notes (8 endpoints)
│   ├── ReminderController.java         # /api/reminders (2 endpoints)
│   └── BatchController.java            # /api/admin/batch (2 endpoints)
├── dto/
│   ├── event/
│   │   ├── UserRegistrationEvent.java
│   │   ├── PasswordResetEvent.java
│   │   ├── ReminderEvent.java
│   │   └── NoteActivityEvent.java
│   ├── request/
│   │   ├── UserRegisterRequestDto.java
│   │   ├── LoginRequestDto.java
│   │   ├── NoteRequestDto.java
│   │   ├── ReminderRequestDto.java
│   │   ├── ForgotPasswordRequestDto.java
│   │   └── ResetPasswordRequestDto.java
│   └── response/
│       ├── UserResponseDto.java
│       ├── LoginResponseDto.java
│       ├── NoteResponseDto.java
│       ├── ReminderResponseDto.java
│       ├── MessageResponseDto.java
│       └── ErrorResponse.java
├── entity/
│   ├── User.java                        # users table
│   ├── Note.java                        # notes table
│   └── Reminder.java                    # reminders table
├── exception/
│   ├── GlobalExceptionHandler.java      # @RestControllerAdvice (8 handlers)
│   ├── UserAlreadyExistsException.java  # 409
│   ├── UserNotFoundException.java       # 404
│   ├── InvalidCredentialsException.java # 401
│   ├── NoteNotFoundException.java       # 404
│   ├── UnauthorizedAccessException.java # 401/403
│   ├── InvalidOtpException.java         # 400
│   ├── ReminderNotFoundException.java   # 404
│   └── BatchProcessingException.java    # 500
├── mapper/
│   └── EntityDtoMapper.java             # Static mapping (User, Note, Reminder)
├── messaging/
│   ├── producer/EventPublisher.java     # RabbitTemplate publisher
│   └── consumer/
│       ├── UserEventConsumer.java       # user.registration.queue
│       ├── NotificationConsumer.java    # user.notification.queue
│       ├── ReminderConsumer.java        # reminder.queue
│       └── AuditConsumer.java           # audit.queue
├── repository/
│   ├── UserRepository.java
│   ├── NoteRepository.java
│   └── ReminderRepository.java
├── security/
│   ├── JwtUtil.java                     # JWT generation/validation
│   └── TokenValidationService.java      # Centralized token + blacklist
└── service/
    ├── UserService.java
    ├── NoteService.java
    ├── ReminderService.java
    ├── NotificationService.java
    └── impl/
        ├── UserServiceImpl.java
        ├── NoteServiceImpl.java
        ├── ReminderServiceImpl.java
        └── NotificationServiceImpl.java
```

---

## 🌿 Branch Strategy

| Branch | Purpose | Contains |
|--------|---------|----------|
| `main` | **Documentation only** | README, project overview, roadmap |
| `develop` | **Working codebase** | Full Part 1 + Part 2 implementation |
| `feature/part1/fundoo-notes-backend-foundation` | **Part 1 history** | Preserved commit history |
| `feature/part2/fundoo-notes-advanced-backend-integration` | **Part 2 history** | Preserved commit history |

This follows **Git Flow** methodology:
1. Features are developed on `feature/*` branches
2. Completed features merge into `develop`
3. `main` holds only release-ready documentation and summaries
4. Feature branches are preserved with `-k` flag for history

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Java 21 | Language target |
| Spring Boot 3.5.0 | Application framework |
| Spring Web | REST API |
| Spring Data JPA | Data persistence |
| Spring Validation | Bean validation (JSR 380) |
| Spring Security | PasswordEncoder (BCrypt) |
| Spring Cache | Redis-backed caching |
| Spring Batch | CSV bulk import |
| Spring AOP | Cross-cutting concerns |
| Spring AMQP | RabbitMQ messaging |
| Spring Data Redis | Token cache & blacklist |
| MySQL | Relational database |
| RabbitMQ | Event-driven messaging |
| Redis | Caching & token management |
| JJWT 0.12.6 | JWT token handling |
| OpenCSV 5.9 | CSV parsing for batch |
| Lombok | Boilerplate reduction |
| Maven | Build tool |

---

## ✅ Part 1 — Backend Foundation

### User Management
- User registration with email uniqueness check
- Secure password storage (BCrypt encoding)
- User login with JWT token generation
- Input validation (email format, password length)

### Note Management
- Create notes linked to authenticated user
- Retrieve all notes for authenticated user
- **Explicit state actions** (not toggles):
  - Pin / Unpin
  - Archive / Unarchive
  - Trash / Restore

### Security
- JWT token generation (HMAC-SHA256 via JJWT)
- Token validation and user ID extraction
- Note ownership enforcement
- Missing/invalid token handling

---

## ✅ Part 2 — Advanced Backend Integration

### RabbitMQ Event-Driven Messaging
- Topic exchange with 4 queues (registration, notification, reminder, audit)
- Event publishers for user registration, password reset, reminders, note activity
- Consumer → NotificationService pattern (future-ready for email/push/in-app)

### Redis Integration
- **Token blacklisting**: Logout invalidates tokens for remaining TTL
- **OTP storage**: Forgot-password OTPs stored with 10-minute TTL
- **Verification tokens**: Stored with 15-minute TTL
- Key strategy: `fundoo:blacklist:*`, `fundoo:reset:*`, `fundoo:verify:*`

### Spring Cache (Redis-backed)
- `@Cacheable` on note reads (cache by userId)
- `@CacheEvict` on all note mutations
- Internal method pattern preserves Part 1 API signatures
- Cache hit = zero DB queries; cache miss = fetchFromDB + cache populate

### Reminder System
- Reminder entity with ManyToOne to Note
- CRUD via `/api/reminders` endpoints
- ReminderEvent published to RabbitMQ on creation
- NotificationService processes reminder notifications (simulated)

### AOP Aspects
- **LoggingAspect**: Method entry/exit at DEBUG level (param types only — no values)
- **PerformanceAspect**: Execution time tracking (WARN ≥ 500ms)
- Scoped to `service.impl.*` only

### Spring Batch CSV Import
- Upload CSV → parse → validate → save notes for authenticated user
- `POST /api/admin/batch/import-notes` (authenticated)
- `GET /api/admin/batch/status/{id}` (job status polling)
- Chunk-based processing (10 items per chunk)

### Security Extensions
- **Forgot password**: OTP generation → Redis storage → PasswordResetEvent
- **Reset password**: OTP validation → password update → Redis cleanup
- **Logout**: Token blacklisting with remaining JWT TTL
- **TokenValidationService**: Centralized JWT + blacklist check

### Additional Exceptions
- `InvalidOtpException` → 400 Bad Request
- `ReminderNotFoundException` → 404 Not Found
- `BatchProcessingException` → 500 Internal Server Error
- `UnauthorizedAccessException` → 401 (token issues) or 403 (ownership)

---

## 🔌 API Summary

### User Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/users/register` | Register a new user | 201 |
| POST | `/api/users/login` | Login and get JWT token | 200 |
| POST | `/api/users/forgot-password` | Request password reset OTP | 200 |
| POST | `/api/users/reset-password` | Reset password with OTP | 200 |
| POST | `/api/users/logout` | Invalidate JWT token | 200 |

### Note Endpoints

All note endpoints require `Authorization` header with a valid JWT token.

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/notes` | Create a new note | 201 |
| GET | `/api/notes` | Get all notes for user | 200 |
| PATCH | `/api/notes/{id}/pin` | Pin a note | 200 |
| PATCH | `/api/notes/{id}/unpin` | Unpin a note | 200 |
| PATCH | `/api/notes/{id}/archive` | Archive a note | 200 |
| PATCH | `/api/notes/{id}/unarchive` | Unarchive a note | 200 |
| PATCH | `/api/notes/{id}/trash` | Trash a note | 200 |
| PATCH | `/api/notes/{id}/restore` | Restore from trash | 200 |

### Reminder Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/reminders` | Create a reminder for a note | 201 |
| GET | `/api/reminders` | Get all reminders for user | 200 |

### Batch Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/admin/batch/import-notes` | Import notes from CSV | 202 |
| GET | `/api/admin/batch/status/{id}` | Check import job status | 200 |

### Error Responses

All errors return structured JSON:
```json
{
  "timestamp": "2026-04-10 11:22:00",
  "status": 409,
  "error": "Conflict",
  "message": "User with email user@test.com already exists",
  "path": "/api/users/register"
}
```

---

## 🚀 Build & Run Instructions

### Prerequisites
- Java 21+
- Maven 3.8+
- MySQL 8.0+
- Redis 7.0+ (`brew install redis && brew services start redis`)
- RabbitMQ 3.12+ (`brew install rabbitmq && brew services start rabbitmq`)

### Database Setup
```sql
CREATE DATABASE IF NOT EXISTS fundoo_notes;
```

### Verify Infrastructure
```bash
redis-cli ping      # → PONG
rabbitmqctl status   # → running
```

### Run the Application
```bash
# Clone and switch to develop branch
git clone https://github.com/Devrajj-14/FunduNotes.git
cd FunduNotes
git checkout develop

# Set environment variables for your local MySQL
export DB_USERNAME=root
export DB_PASSWORD=your_password
export JWT_SECRET=YourSecureSecretKeyAtLeast32CharsLong

# Run
./mvnw spring-boot:run
```

The application starts on `http://localhost:8080`.

### Configuration
All config is externalized in `application.properties`. Override sensitive values via:
- **Environment variables**: `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRATION`, `RABBITMQ_*`, `REDIS_*`
- **Local profile**: Create `application-local.properties` (git-ignored) for dev overrides

---

## 🗺️ Roadmap

### Part 1 — Backend Foundation ✅
- Spring Boot project setup
- User registration & login with JWT
- Note CRUD with state transitions
- DTO-based API design
- Exception handling & logging
- Clean architecture foundation

### Part 2 — Advanced Backend Integration ✅
- RabbitMQ event-driven messaging
- Redis caching & token management
- Spring Cache for notes (Redis-backed)
- Reminder entity & event flow
- AOP aspects (logging & performance)
- Spring Batch CSV import
- Forgot/reset password & logout
- Centralized TokenValidationService

### Part 3 — Full Stack Integration (Future)
- Frontend (React/Angular)
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
