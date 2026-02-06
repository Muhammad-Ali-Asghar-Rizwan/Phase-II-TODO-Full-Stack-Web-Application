# Feature Specification: REST API Endpoints

**Feature Branch**: `004-api-endpoints`
**Created**: 2026-01-06
**Status**: Draft
**Input**: User description: "Create @specs/api/rest-endpoints.md Base URL: http://localhost:8000 All endpoints require JWT: Authorization: Bearer <token> Endpoints: - GET /api/{user_id}/tasks - POST /api/{user_id}/tasks - GET /api/{user_id}/tasks/{id} - PUT /api/{user_id}/tasks/{id} - DELETE /api/{user_id}/tasks/{id} - PATCH /api/{user_id}/tasks/{id}/complete Behavior: - 401 if no token - Filter tasks by authenticated user"

## User Scenarios & Testing

### User Story 1 - Task Management API (Priority: P1)

As a frontend developer, I want a standard set of RESTful endpoints to manage tasks so that I can build the user interface.

**Why this priority**: Connects the backend logic to the frontend user experience.

**Independent Test**: Use Postman/curl to perform a full CRUD cycle (Create -> Read -> Update -> Delete) against `http://localhost:8000/api/{uid}/tasks`.

**Acceptance Scenarios**:

1. **Given** a valid JWT, **When** `POST /api/{uid}/tasks` is called with a title, **Then** a 201 Created response returns the new task.
2. **Given** a valid JWT, **When** `GET /api/{uid}/tasks` is called, **Then** a 200 OK response lists the user's tasks.
3. **Given** a valid JWT, **When** `GET /api/{uid}/tasks/{id}` is called for an existing task, **Then** the task details are returned.

---

### User Story 2 - Task Completion API (Priority: P2)

As a frontend developer, I want a specific endpoint to toggle task completion so that I don't have to send the full task object.

**Why this priority**: Optimizes common user interaction (checking a box).

**Independent Test**: Create a task, call PATCH to complete it, verify status changed.

**Acceptance Scenarios**:

1. **Given** a pending task, **When** `PATCH /api/{uid}/tasks/{id}/complete` is called, **Then** the task status updates to completed.

---

### User Story 3 - Security Enforcement (Priority: P1)

As a security engineer, I want all endpoints to reject unauthenticated or unauthorized requests so that data remains safe.

**Why this priority**: Critical security requirement.

**Independent Test**: Attempt all endpoints without headers or with a different user's ID in the path.

**Acceptance Scenarios**:

1. **Given** no Authorization header, **When** any API endpoint is called, **Then** a 401 Unauthorized is returned.
2. **Given** User A's token, **When** attempting to access `GET /api/{user_b_id}/tasks`, **Then** a 403 Forbidden (or 404 Not Found) is returned.

### Edge Cases

- **Invalid User ID format**: Should return 422 Unprocessable Entity or 404.
- **Task ID mismatch**: Requesting a task ID that doesn't belong to the `user_id` in the path should fail (404/403).
- **Malformed JSON**: POST/PUT with bad JSON should return 422.

## Requirements

### Functional Requirements

- **FR-001**: System MUST expose `GET /api/{user_id}/tasks` to list tasks.
- **FR-002**: System MUST expose `POST /api/{user_id}/tasks` to create a task.
- **FR-003**: System MUST expose `GET /api/{user_id}/tasks/{id}` to retrieve a single task.
- **FR-004**: System MUST expose `PUT /api/{user_id}/tasks/{id}` to update a task.
- **FR-005**: System MUST expose `DELETE /api/{user_id}/tasks/{id}` to remove a task.
- **FR-006**: System MUST expose `PATCH /api/{user_id}/tasks/{id}/complete` to mark a task complete.
- **FR-007**: All endpoints MUST require a valid JWT in the `Authorization: Bearer <token>` header.
- **FR-008**: System MUST return 401 Unauthorized if the token is missing or invalid.
- **FR-009**: System MUST ensure the `user_id` in the path matches the authenticated user's ID (or 403 Forbidden).

### Key Entities

- **API Error Response**:
  - `status_code`: Integer
  - `detail`: String

## Success Criteria

### Measurable Outcomes

- **SC-001**: **Compliance**: 100% of defined endpoints are reachable and return correct HTTP status codes (200, 201, 204).
- **SC-002**: **Security**: 0% of requests without valid tokens succeed.
- **SC-003**: **Isolation**: 0% of requests for another user's data succeed.