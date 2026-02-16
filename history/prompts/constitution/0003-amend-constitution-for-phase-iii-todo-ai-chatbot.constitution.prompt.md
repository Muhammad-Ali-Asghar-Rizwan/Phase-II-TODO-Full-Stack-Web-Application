---
id: 0003
title: Amend Constitution for Phase III Todo AI Chatbot
stage: constitution
date: 2026-02-07
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: User
command: /sp.constitution
labels: ["constitution", "update"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:

---

## Prompt

Create a project constitution for Phase III: Todo AI Chatbot.

Context:
- A Todo application already exists with frontend and backend implemented
- Task CRUD functionality already works
- Phase III extends the existing app by ADDING an AI-powered chatbot
- No existing functionality should be rewritten or removed

Architecture rules:
- Backend: FastAPI (Python)
- AI: OpenAI Agents SDK
- MCP Server: Official MCP SDK
- Database: Neon PostgreSQL (existing tables reused)
- ORM: SQLModel
- Frontend: OpenAI ChatKit
- Authentication: Better Auth

Principles to enforce:
- Existing Todo app logic must be reused
- AI agent must interact with tasks ONLY via MCP tools
- MCP tools must wrap existing CRUD logic
- Server must be stateless
- Conversation state must be persisted in database
- No manual coding (Agentic Dev Stack enforced)
- AI must provide confirmations and graceful error handling

Output:
Clean Markdown constitution clearly stating that Phase III EXTENDS an existing Todo app.

## Response snapshot

The project constitution has been updated.

**Version**: 1.0.0 (This was a refinement of an existing Phase III constitution, so the version remains the same).
**Files flagged for manual follow-up**: None.
**Suggested commit message**: `docs: amend constitution to v1.0.0 (clarify Phase III extension and task interaction)`

## Outcome

- ✅ Impact: Project constitution updated to explicitly state Phase III extends existing Todo app and refines core principles.
- 🧪 Tests: N/A
- 📁 Files: .specify/memory/constitution.md modified.
- 🔁 Next prompts: User is informed about the update and suggested commit message.
- 🧠 Reflection: Successfully updated the constitution based on user's requirements and created a PHR.

## Evaluation notes (flywheel)

- Failure modes observed: N/A
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
