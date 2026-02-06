---
id: 20260106-spec-schema
title: define-database-schema-spec
stage: spec
feature: database-schema
date: 2026-01-06
---

# Prompt

Create @specs/database/schema.md Tables: users: - id (string, primary key) - email - name tasks: - id (int, primary key) - user_id (FK users.id) - title - description - completed - created_at - updated_at

# Response

Created feature branch `005-database-schema`.
Defined specification at `specs/005-database-schema/spec.md` with:
- 2 User Stories (User Persistence, Task Persistence)
- Defined Schema for `Users` and `Tasks` tables.
- Explicit constraints (Foreign Keys, Uniqueness, Cascade Delete).
- Success criteria focusing on Data Integrity.
Validated with `checklists/requirements.md`.
Ready for Plan.
