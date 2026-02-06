# Feature Specification: Task CRUD & Isolation

**Feature Branch**: `002-task-crud`
**Created**: 2026-01-06
**Status**: Draft
**Input**: User description: "Create @specs/features/task-crud.md User Stories: - User can create task - User can view own tasks only - User can update task - User can delete task - User can mark task complete Rules: - Task belongs to authenticated user - User isolation enforced"

## User Scenarios & Testing

### User Story 1 - Create and View Tasks (Priority: P1)

As a logged-in user, I want to create new tasks and see a list of my own tasks so that I can track my work.

**Why this priority**: Core value proposition of a Todo app.

**Independent Test**: Can be tested by creating tasks as User A and verifying they appear in User A's list (and not User B's).

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they submit a task title, **Then** a new task is created with "pending" status.
2. **Given** a user with multiple tasks, **When** they request their task list, **Then** all their tasks are returned.
3. **Given** User A and User B, **When** User A views their list, **Then** they DO NOT see any of User B's tasks.

---

### User Story 2 - Update Task Details (Priority: P2)

As a user, I want to update the details of a task (title, description) so that I can correct mistakes or add information.

**Why this priority**: Essential for maintaining accurate data.

**Independent Test**: Create a task, update its title, fetch it again to verify persistence.

**Acceptance Scenarios**:

1. **Given** an existing task belonging to the user, **When** the user updates the title, **Then** the change is saved.
2. **Given** a task belonging to User A, **When** User B tries to update it, **Then** the system returns a 403 Forbidden or 404 Not Found error.

---

### User Story 3 - Task Completion (Priority: P2)

As a user, I want to mark tasks as complete so that I can track my progress.

**Why this priority**: Key workflow step for a Todo app.

**Independent Test**: Create a task, toggle its status to 'complete', verify status persists.

**Acceptance Scenarios**:

1. **Given** a pending task, **When** the user marks it as complete, **Then** its status changes to 'completed'.
2. **Given** a completed task, **When** the user marks it as incomplete, **Then** its status changes back to 'pending'.

---

### User Story 4 - Delete Task (Priority: P3)

As a user, I want to remove tasks I no longer need so that my list stays clean.

**Why this priority**: Cleanup functionality, less critical than creation/completion.

**Independent Test**: Create a task, delete it, verify it is no longer retrievable.

**Acceptance Scenarios**:

1. **Given** an existing task, **When** the user deletes it, **Then** it is removed from their list.
2. **Given** a deleted task, **When** the user tries to update or view it, **Then** the system returns a 404 Not Found error.

### Edge Cases

- **Empty Title**: Attempting to create a task with an empty or whitespace-only title should fail validation.
- **Unauthorized Access**: Attempting to access/modify another user's task ID via API should result in 403/404.
- **Non-existent ID**: Attempting to update/delete a random ID should return 404.

## Requirements

### Functional Requirements

- **FR-001**: System MUST allow authenticated users to create a task with at least a title.
- **FR-002**: System MUST associate every created task with the authenticated user's ID.
- **FR-003**: System MUST allow users to retrieve only tasks associated with their own user ID.
- **FR-004**: System MUST allow users to update task fields (Title, Description, Is_Completed).
- **FR-005**: System MUST allow users to delete their own tasks.
- **FR-006**: System MUST enforce authorization checks on every specific task operation (Update, Delete, Get-One) to ensure ownership.
- **FR-007**: System MUST validate that task titles are not empty.

### Key Entities

- **Task**:
  - `id`: Unique Identifier
  - `title`: String (Required)
  - `description`: String (Optional)
  - `is_completed`: Boolean (Default: False)
  - `user_id`: Reference to User (Required, Foreign Key)
  - `created_at`: Timestamp
  - `updated_at`: Timestamp

## Success Criteria

### Measurable Outcomes

- **SC-001**: **Isolation Guarantee**: 100% of API attempts to access another user's task return 403 or 404.
- **SC-002**: **Persistence**: 100% of successful create/update operations are reflected in subsequent read operations.
- **SC-003**: **Performance**: Task list retrieval for a user with 50 items completes in under 200ms (P95).