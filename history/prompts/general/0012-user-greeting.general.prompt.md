---
id: 0012
title: User Greeting
stage: general
date: 2026-02-07
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: user
command: hi
labels: ["greeting"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
- history/prompts/general/0012-user-greeting.general.prompt.md
tests:

---

## Prompt

hi

## Response snapshot

Hello! How can I help you today?

## Outcome

- ✅ Impact: User was greeted.
- 🧪 Tests: No tests.
- 📁 Files: A new PHR was created.
- 🔁 Next prompts: User's next request.
- 🧠 Reflection: Successfully created a PHR for a simple user greeting.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): null
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
