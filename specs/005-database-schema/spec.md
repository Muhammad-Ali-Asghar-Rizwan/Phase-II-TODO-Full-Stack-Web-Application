# Feature Specification: Database Schema

**Feature Branch**: `005-database-schema`
**Created**: 2026-01-06
**Status**: Draft
**Input**: User description: "Create @specs/database/schema.md Tables: users: - id (string, primary key) - email - name tasks: - id (int, primary key) - user_id (FK users.id) - title - description - completed - created_at - updated_at"

## User Scenarios & Testing

### User Story 1 - User Data Persistence (Priority: P1)

As a backend developer, I want to store user information in a structured `users` table so that I can manage identities.

**Why this priority**: Fundamental requirement for multi-user support.

**Independent Test**: Connect to the DB, insert a user record, query it back.

**Acceptance Scenarios**:

1. **Given** a new user record, **When** inserted into the `users` table, **Then** it persists with a unique ID and email.
2. **Given** an existing email, **When** attempting to insert a duplicate, **Then** the database enforces a unique constraint error.

---

### User Story 2 - Task Data Persistence (Priority: P1)

As a backend developer, I want to store task information in a `tasks` table linked to users so that I can support the application logic.

**Why this priority**: Core application data.

**Independent Test**: Insert a task with a valid `user_id`, verify retrieval.

**Acceptance Scenarios**:

1. **Given** a valid `user_id`, **When** a task is inserted, **Then** it is successfully linked to that user.
2. **Given** a non-existent `user_id`, **When** attempting to insert a task, **Then** the foreign key constraint prevents the insertion.
3. **Given** a task, **When** updating `completed` status, **Then** the `updated_at` timestamp is refreshed (if handled by DB trigger or ORM logic).

### Edge Cases

- **Cascading Deletes**: If a user is deleted, their tasks should be deleted (CASCADE).
- **Null Fields**: `title` cannot be null. `user_id` cannot be null.

## Requirements

### Functional Requirements

- **FR-001**: System MUST define a `users` table with `id` (String/UUID), `email` (String, Unique), `name` (String), and timestamps.
- **FR-002**: System MUST define a `tasks` table with `id` (Integer, Auto-increment), `user_id` (String, FK), `title` (String), `description` (Text, Nullable), `completed` (Boolean, Default False), and timestamps.
- **FR-003**: System MUST enforce a Foreign Key constraint linking `tasks.user_id` to `users.id`.
- **FR-004**: System MUST enforce a Unique constraint on `users.email`.
- **FR-005**: System MUST configure ON DELETE CASCADE for the User->Tasks relationship.

### Key Entities

- **User**:
  - `id`: String (PK)
  - `email`: String (Unique, Indexed)
  - `name`: String
  - `created_at`: DateTime
  - `updated_at`: DateTime

- **Task**:
  - `id`: Integer (PK)
  - `user_id`: String (FK -> User.id)
  - `title`: String
  - `description`: String (Optional)
  - `completed`: Boolean
  - `created_at`: DateTime
  - `updated_at`: DateTime

## Success Criteria

### Measurable Outcomes

- **SC-001**: **Integrity**: 100% of tasks inserted MUST have a valid parent user (FK check).
- **SC-002**: **Uniqueness**: 100% of attempts to create duplicate user emails MUST fail.
- **SC-003**: **Cleanup**: Deleting a user removes 100% of their associated tasks automatically.