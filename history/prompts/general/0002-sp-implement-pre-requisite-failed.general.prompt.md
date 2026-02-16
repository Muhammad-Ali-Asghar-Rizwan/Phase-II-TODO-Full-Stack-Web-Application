---
id: 0002
title: Sp Implement Pre-requisite Failed
stage: general
date: 2026-02-07
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: User
command: /sp.implement
labels: ["error", "sp.implement", "prerequisites"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:

tests:

---

## Prompt

/sp.implement

Execute the implementation plan by processing and executing
ALL tasks defined in specs/tasks.md.

Rules:
- Use Claude Code only
- Do not assume prior state
- Follow the Project Constitution strictly
- Implement tasks in the given order
- Ensure stateless architecture
- Persist all required data in the database

Output:
Completed implementation across backend, MCP server, and frontend
according to the tasks and specifications.

## Response snapshot

The `/sp.implement` command failed because you are not currently on a feature branch. Please switch to a feature branch (e.g., `git checkout -b 001-my-feature`) or initialize a new feature using `/sp.specify <feature-name>` before running `/sp.implement`.

## Outcome

- ✅ Impact: User informed about the prerequisite failure for `sp.implement`.
- 🧪 Tests: N/A
- 📁 Files: N/A
- 🔁 Next prompts: User needs to switch to a feature branch or initialize a new feature.
- 🧠 Reflection: The `check-prerequisites.sh` script successfully identified the incorrect branch. Provided clear instructions to the user.

## Evaluation notes (flywheel)

- Failure modes observed: `sp.implement` failed due to `check-prerequisites.sh` reporting not being on a feature branch.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
