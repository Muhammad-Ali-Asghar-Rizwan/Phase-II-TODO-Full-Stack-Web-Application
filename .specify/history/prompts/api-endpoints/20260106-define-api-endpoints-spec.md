---
id: 20260106-spec-api
title: define-api-endpoints-spec
stage: spec
feature: api-endpoints
date: 2026-01-06
---

# Prompt

Create @specs/api/rest-endpoints.md Base URL: http://localhost:8000 All endpoints require JWT: Authorization: Bearer <token> Endpoints: - GET /api/{user_id}/tasks - POST /api/{user_id}/tasks - GET /api/{user_id}/tasks/{id} - PUT /api/{user_id}/tasks/{id} - DELETE /api/{user_id}/tasks/{id} - PATCH /api/{user_id}/tasks/{id}/complete Behavior: - 401 if no token - Filter tasks by authenticated user

# Response

Created feature branch `004-api-endpoints`.
Defined specification at `specs/004-api-endpoints/spec.md` with:
- 3 User Stories (CRUD, Completion, Security)
- Defined strict list of 6 endpoints (FR-001 to FR-006)
- Mandated JWT security and path validation (FR-007 to FR-009)
- Success criteria focusing on status code correctness and security enforcement.
Validated with `checklists/requirements.md`.
Ready for Plan.
