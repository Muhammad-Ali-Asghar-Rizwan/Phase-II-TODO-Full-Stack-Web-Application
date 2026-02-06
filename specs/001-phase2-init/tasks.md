---
description: "Task list for Phase II Initialization"
---

# Tasks: Phase II Initialization

**Input**: Design documents from `/specs/001-phase2-init/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Git repository with .gitignore for Python and Node in .gitignore
- [x] T002 Create Monorepo structure (backend/, frontend/) in root
- [x] T003 [P] Initialize Backend (FastAPI, uv/poetry) in backend/pyproject.toml
- [x] T004 [P] Initialize Frontend (Next.js 16) in frontend/package.json
- [x] T005 [P] Setup environment variables template in .env.example

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T006 Setup SQLModel Database connection in backend/src/core/db.py
- [x] T007 [P] Configure CORS and Middleware in backend/src/main.py
- [x] T008 [P] Implement JWT verification utility in backend/src/core/security.py
- [x] T009 [P] Install and configure Better Auth in frontend/src/lib/auth.ts
- [x] T010 Create User model (SQLModel) in backend/src/models/user.py
- [x] T011 Create Todo model (SQLModel) in backend/src/models/todo.py

**Checkpoint**: Backend can connect to DB, Frontend has Auth client, Models defined.

---

## Phase 3: User Story 1 - User Authentication (Priority: P1) 🎯 MVP

**Goal**: Users can register and login via Frontend; Backend verifies tokens.

**Independent Test**: Register via Frontend, Login, Verify JWT via Backend script.

### Implementation for User Story 1

- [x] T012 [US1] Create Auth page (Login/Register) in frontend/src/app/auth/page.tsx
- [x] T013 [P] [US1] Implement Protected Route component in frontend/src/components/auth-guard.tsx
- [x] T014 [US1] Add Logout functionality in frontend/src/components/user-menu.tsx
- [x] T015 [US1] Create "WhoAmI" endpoint to verify token in backend/src/api/auth.py

**Checkpoint**: Functional Login/Logout flow.

---

## Phase 4: User Story 2 - Todo Management (Priority: P1)

**Goal**: Full CRUD for Todos.

**Independent Test**: Create/Read/Update/Delete Todos via API using valid Token.

### Implementation for User Story 2

- [x] T016 [US2] Implement Todo Service (CRUD logic) in backend/src/services/todo_service.py
- [x] T017 [US2] Create POST /api/todos endpoint in backend/src/api/todos.py
- [x] T018 [US2] Create GET /api/todos endpoint in backend/src/api/todos.py
- [x] T019 [P] [US2] Create PUT/DELETE /api/todos/{id} endpoints in backend/src/api/todos.py
- [x] T020 [US2] Create Todo List UI component in frontend/src/components/todo-list.tsx
- [x] T021 [US2] Create Todo Item/Edit UI component in frontend/src/components/todo-item.tsx

**Checkpoint**: Users can manage their todos.

---

## Phase 5: User Story 3 - Multi-User Isolation (Priority: P2)

**Goal**: Ensure data privacy between users.

**Independent Test**: Attempt to access User A's todo with User B's token (expect 403/404).

### Implementation for User Story 3

- [x] T022 [US3] Add ownership check in Todo Service update/delete in backend/src/services/todo_service.py
- [x] T023 [P] [US3] Add ownership filter in Todo Service list query in backend/src/services/todo_service.py
- [x] T024 [US3] Write integration test for isolation in backend/tests/test_isolation.py

**Checkpoint**: Strict data isolation enforced.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T025 [P] Add API documentation (Swagger UI default) verification
- [x] T026 Update README.md with run instructions
- [x] T027 [P] Run linter (ruff/eslint) and fix issues

---

## Dependencies & Execution Order

- **Foundational** blocks all Stories.
- **US1 (Auth)** blocks US2 (Todos) because Todos need an authenticated user.
- **US3 (Isolation)** refines US2 logic; can be done after or during US2.

## Implementation Strategy

1. **Setup**: Get the Monorepo skeleton ready.
2. **Foundation**: DB + Models + Basic Auth config.
3. **MVP**: Auth (US1) + Basic Todo CRUD (US2).
4. **Security**: Hardening Isolation (US3).
